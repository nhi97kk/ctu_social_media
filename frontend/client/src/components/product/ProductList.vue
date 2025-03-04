<template>
  <div>
    <div class="row" v-if="products.length > 0">
      <product-item
        v-for="product in products"
        :key="product._id"
        :product="product"
      ></product-item>
    </div>
    <div v-else class="text-center mt-5 text-white">
      <h4>No items available....</h4>
    </div>
  </div>
</template>

<script setup>
import productService from "@/services/product.service.js";
import ProductItem from "@/components/product/ProductItem.vue";

import { ref, onBeforeMount, watch } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

const $toast = useToast();
const route = useRoute();
const products = ref([]);

// Hàm refreshProducts để gọi API với filter phù hợp
async function refreshProducts() {
  const response = await productService.getAllProducts(route.query);

  if (response.status === "success") {
    products.value = response.data.products;
  } else {
    $toast.error(
      response.message || "An error occurred! Please try again later.",
      {
        position: "top-right",
      }
    );
  }
}

// Theo dõi sự thay đổi của route.query để cập nhật danh sách
watch(
  () => route.query,
  async () => {
    await refreshProducts();
  }
);

onBeforeMount(async () => {
  await refreshProducts();
});
</script>

<style scoped>
.page {
  max-width: 1000px;
}
</style>
