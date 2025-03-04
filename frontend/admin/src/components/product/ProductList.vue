<template>
  <!-- loader -->
  <loader v-if="loader"></loader>

  <div v-else class="px-4">
    <ProductFilter></ProductFilter>
    <DataTable
      class="table table-hover table-striped table-bordered"
      width="100%"
      :options="{
        paging: false, // Tắt phân trang
        lengthChange: false, // Tắt show entries
        info: false, // Tắt thông tin phân trang (entries)
      }"
    >
      <thead class="table-success">
        <tr>
          <th>Name</th>
          <th>Price x Quantity</th>
          <th>Type</th>
          <th>Note</th>
          <th>Created By</th>
          <th>Created At</th>
          <th>Status</th>
          <th>Option</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product._id">
          <td>{{ product.name }}</td>
          <td>
            {{ priceString(product.price) }}đ
            <span class="text-danger">x {{ product.stockQuantity }}</span>
          </td>
          <td>{{ product.type || 'Other' }}</td>
          <td>{{ product.note }}</td>
          <td>
            <span
              class="fw-bold btn-hover"
              @click="
                $router.push({
                  name: 'user-detail',
                  params: { userId: product.createdBy._id },
                })
              "
            >
              {{ product.createdBy.name }}
              <i class="fa-solid fa-arrow-up-right-from-square text-primary"></i
            ></span>
          </td>
          <td>{{ timeAgo(product.createdAt) }}</td>
          <td>
            <span
              :class="{
                'text-warning': product.status === 'pending',
                'text-success': product.status === 'sold',
                'text-primary': product.status === 'approved',
                'text-danger': product.status === 'rejected',
              }"
              class="text-capitalize fw-bold"
            >
              {{ product.status }}
            </span>
          </td>
          <td style="text-align: center">
            <button
              class="btn btn-primary btn-sm"
              @click="goToProductDetail(product._id)"
            >
              View
            </button>
          </td>
        </tr>
      </tbody>
    </DataTable>
  </div>
</template>

<script setup>
import ProductFilter from '@/components/product/ProductFilter.vue';
import Loader from '@/components/partials/Loader.vue';

import productService from '@/services/product.service.js';

import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';

DataTable.use(DataTablesCore);

const $toast = useToast();
const loader = ref(true);
const route = useRoute();
const router = useRouter();
const products = ref([]);

// Hàm tính khoảng cách thời gian theo múi giờ Việt Nam
function timeAgo(date) {
  // Múi giờ Việt Nam
  const timeZone = 'Asia/Ho_Chi_Minh';
  // Chuyển đổi thời gian từ UTC về múi giờ Việt Nam
  const vietnamTime = utcToZonedTime(new Date(date), timeZone);
  // Format ngày, tháng, năm, giờ, phút, giây
  return format(vietnamTime, 'dd/MM/yyyy HH:mm:ss');
}

// Format giá tiền
function priceString(price) {
  return new Intl.NumberFormat('vi', {}).format(price);
}

function goToProductDetail(id) {
  router.push({ name: 'product-detail', params: { productId: id } });
}

// Hàm fetch sản phẩm theo query
async function fetchProducts() {
  loader.value = true;

  // Gọi service để lấy danh sách sản phẩm
  const response = await productService.getAllProducts(route.query);

  if (response.status === 'success') {
    products.value = response.data.products;
  } else {
    $toast.error(response.message || 'Failed to load products');
  }
  loader.value = false;
}

// Khởi tạo dữ liệu khi component được mount
onMounted(fetchProducts);

// Theo dõi sự thay đổi của query để tự động cập nhật danh sách sản phẩm
watch(() => route.query, fetchProducts);
</script>

<style scoped></style>

