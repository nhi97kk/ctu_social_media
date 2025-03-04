<template>
  <div class="d-flex col-4 p-2">
    <div
      class="d-flex w-100 flex-column justify-content-between align-items-stretch p-2 bg-white rounded-lg shadow border border-info"
    >
      <!-- Hiển thị ảnh chính (ảnh đầu tiên trong danh sách) -->
      <img
        style="height: 300px; object-fit: contain"
        :src="product.images[0]"
        alt="Product Image"
      />

      <div class="my-2 d-flex justify-content-between flex-column">
        <!-- Tên sản phẩm, giá và số lượng -->
        <div class="font-weight-bold">{{ product.name }}</div>
        <div class="price">
          Price: {{ priceString }}đ | Quantity: {{ product.stockQuantity }}
        </div>
      </div>

      <!-- Button "Xem thêm" -->
      <div class="d-flex flex-column">
        <button
          class="btn btn-success text-white"
          data-toggle="modal"
          :data-target="'#modalProduct' + product._id"
        >
          View More <i class="fa-solid fa-info"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- Modal khi click vào "Xem thêm" -->
  <div class="modal" :id="'modalProduct' + product._id">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title text-center">Product Detail</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal Body -->
        <div class="container px-3 py-3">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <img
                :src="product.createdBy.avatar"
                class="rounded-circle border border-info"
                style="width: 80px; height: 80px; object-fit: cover"
                alt="Avatar"
              />
              <div class="ml-3">
                <p class="text-success font-weight-bold m-0">
                  {{ product.createdBy.name }}
                </p>
                <p
                  class="text-secondary m-0"
                  style="text-transform: capitalize"
                >
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
            <p style="font-size: 1rem">Description: {{ product.note }}</p>
            <h5 style="font-size: 1rem">Type: {{ product?.type }}</h5>
            <h5 class="mt-3 fw-bold" style="font-size: 1.2em">
              Price: {{ priceString }}đ | Quantity: {{ product.stockQuantity }}
            </h5>

            <div v-if="product.status == 'approved'">
              <button
                v-if="product.createdBy._id != user._id"
                class="btn btn-outline-success"
                @click="chat(product.createdBy._id)"
              >
                Chat with seller
              </button>
              <button
                v-else-if="product.createdBy._id == user._id"
                class="btn btn-outline-danger"
                @click="sold(product._id)"
              >
                Sold
              </button>
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
    </div>
  </div>
</template>
<script setup>
import chatService from "@/services/chat.service.js";
import productService from "@/services/product.service.js";

import { computed, ref, inject } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2"; // Modal sử dụng Sweetalert2
import "sweetalert2/dist/sweetalert2.min.css";
import { formatDistanceToNow } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import $ from "jquery";

const router = useRouter();
// Nhận prop từ component cha
const props = defineProps(["product"]);
const user = inject("user");

// Format giá tiền
const priceString = computed(() => {
  return new Intl.NumberFormat("vi", {}).format(props.product.price);
});

// Hàm tính khoảng cách thời gian theo múi giờ Việt Nam
function timeAgo(date) {
  // Múi giờ Việt Nam
  const timeZone = "Asia/Ho_Chi_Minh";
  // Chuyển đổi thời gian từ UTC về múi giờ Việt Nam
  const vietnamTime = utcToZonedTime(new Date(date), timeZone);
  // Tính khoảng cách từ thời gian hiện tại đến thời gian đã được chuyển đổi
  return formatDistanceToNow(vietnamTime, { addSuffix: true });
}

async function chat(userId) {
  const res = await chatService.create({ members: [userId, user._value._id] });
  if (res.status == "success") {
    const id = res.data.existingChat
      ? res.data.existingChat._id
      : res.data.chat._id;
    $("#modalProduct" + props.product._id).modal("hide");
    router.push({ name: "chat-message", params: { chatId: id } });
  } else {
    $toast.error(res.message || "An error occurred! Please try again later.", {
      position: "top-right",
    });
  }
}

async function sold(productId) {
  const res = await productService.updateSoldProduct(productId);
  if (res.status == "success") {
    props.product.status = "sold";
  } else {
    $toast.error(res.message || "An error occurred! Please try again later.", {
      position: "top-right",
    });
  }
}
</script>
<style scoped>
.img-list::-webkit-scrollbar {
  width: 1rem;
}
.img-list::-webkit-scrollbar-thumb {
  background-color: #95e1d3;
  border-radius: 2rem;
}
.img-list::-webkit-scrollbar-track {
  background-color: #f5f5f5;
  border-radius: 2rem;
}
</style>
