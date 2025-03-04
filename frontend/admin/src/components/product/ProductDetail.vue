<template>
  <!-- loader -->
  <loader v-if="loader"></loader>

  <div v-else>
    <div class="container mt-3">
      <router-link :to="{ name: 'product-list' }">
        <i class="fa-solid fa-arrow-left-long"></i> Back
      </router-link>
    </div>
    <div class="container px-5 py-3">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <img
            :src="product.createdBy.avatar"
            class="rounded-circle border border-info"
            style="width: 80px; height: 80px; object-fit: cover"
            alt="Avatar"
          />
          <div class="ms-3">
            <p class="text-success font-weight-bold m-0">
              {{ product.createdBy.name }}
            </p>
            <p class="text-secondary m-0" style="text-transform: capitalize">
              {{ product.createdBy.role }}
            </p>
          </div>
        </div>
        <span class="text-secondary"
          ><i class="fa-regular fa-calendar text-success"></i>
          {{ timeAgo(product.createdAt) }}</span
        >
      </div>
      <br />
      <div style="text-align: left; color: black">
        <h4 class="fw-bold">Product name: {{ product.name }}</h4>
        <h5>Description: {{ product.note }}</h5>
        <h5>Type: {{ product?.type }}</h5>

        <h5 class="mt-3" style="font-size: 1.2em">
          Price: {{ priceString }}đ | Quantity: {{ product.stockQuantity }}
        </h5>
        <h6 class="text-secondary">
          Status:
          <span
            :class="{
              'bg-primary': product.status === 'approved',
              'bg-danger': product.status === 'rejected',
              'bg-success': product.status === 'sold',
              'bg-warning': product.status === 'pending',
            }"
            class="p-1 text-white rounded"
            >{{ product.status }}</span
          >
        </h6>
        <div>
          <div v-if="product.status === 'pending'" class="me-3 my-2">
            <button
              @click="approveProduct(product._id)"
              class="btn btn-sm btn-success me-2"
            >
              Approve
            </button>
            <button
              @click="rejectProduct(product._id)"
              class="btn btn-sm btn-warning"
            >
              Reject
            </button>
          </div>

          <div>
            <button
              v-if="product.hide == false"
              class="btn btn-outline-danger"
              @click="submitHide()"
            >
              Move to Trash
            </button>
            <button
              v-else-if="product.hide == true"
              class="btn btn-outline-secondary"
              @click="submitRestore()"
            >
              Restore
            </button>
          </div>
        </div>
      </div>
      <!-- Hiển thị danh sách ảnh -->
      <div class="mt-3">
        <div class="d-flex img-list" style="overflow-x: scroll; gap: 1rem">
          <img
            v-for="img in product.images"
            :src="img"
            alt="Product Images"
            class="shadow mb-2"
            style="height: 400px"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Loader from '@/components/partials/Loader.vue';

import productService from '@/services/product.service';

import { ref, onBeforeMount, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { useToast } from 'vue-toast-notification';
import { formatDistanceToNow } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

const $toast = useToast();
const router = useRouter();
const route = useRoute();
const loader = ref(true);
const product = ref(null);

// Hàm tính khoảng cách thời gian theo múi giờ Việt Nam
function timeAgo(date) {
  // Múi giờ Việt Nam
  const timeZone = 'Asia/Ho_Chi_Minh';
  // Chuyển đổi thời gian từ UTC về múi giờ Việt Nam
  const vietnamTime = utcToZonedTime(new Date(date), timeZone);
  // Tính khoảng cách từ thời gian hiện tại đến thời gian đã được chuyển đổi
  return formatDistanceToNow(vietnamTime, { addSuffix: true });
}

// Format giá tiền
const priceString = computed(() => {
  return new Intl.NumberFormat('vi', {}).format(product.value.price);
});

async function approveProduct(productId) {
  const res = await productService.updateApprovedProduct(productId);
  if (res.status == 'success') {
    product.value.status = 'approved';
  } else {
    $toast.error(res.message || 'An error occurred! Please try again later.', {
      position: 'top-right',
    });
  }
}

async function rejectProduct(productId) {
  const res = await productService.updateRejectedProduct(productId);
  if (res.status == 'success') {
    product.value.status = 'rejected';
  } else {
    $toast.error(res.message || 'An error occurred! Please try again later.', {
      position: 'top-right',
    });
  }
}

async function submitHide() {
  const result = await Swal.fire({
    title: 'Move to Trash',
    text: 'Are you sure you want to remove this product to Trash?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });

  if (!result.isConfirmed) return;

  const response = await productService.hideProduct(product.value._id);
  if (response.status === 'success') {
    $toast.success(`The product have been moved!`, {
      position: 'top-right',
    });

    product.value.hide = true;
  } else {
    $toast.error(
      response.message || 'An error occurred! Please try again later.',
      {
        position: 'top-right',
      },
    );
  }
}

async function submitRestore() {
  const result = await Swal.fire({
    title: 'Restore',
    text: 'Are you sure you want to restore this product?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });

  if (!result.isConfirmed) return;

  const response = await productService.restoreProduct(product.value._id);
  if (response.status === 'success') {
    $toast.success(`The product have been restored!`, {
      position: 'top-right',
    });

    product.value.hide = false;
  } else {
    $toast.error(
      response.message || 'An error occurred! Please try again later.',
      {
        position: 'top-right',
      },
    );
  }
}

onBeforeMount(async () => {
  const response = await productService.getProduct(route.params.productId);

  if (response.status === 'success') {
    product.value = response.data.product;
  } else {
    $toast.error(
      response.message || 'An error occurred! Please try again later.',
      {
        position: 'top-right',
      },
    );

    router.push({ name: 'product-list' });
  }

  loader.value = false;
});
</script>

<style scoped></style>

