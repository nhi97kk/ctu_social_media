<template>
  <div class="d-flex jusitfy-content-center align-items-center">
    <div class="w-100">
      <router-link v-if="hide" :to="{ name: 'product-list' }">
        <i class="fa-solid fa-arrow-left-long"></i> All Products
      </router-link>
      <button v-else @click="getTrash" class="btn btn-outline-danger">
        <i class="fa-solid fa-trash-can"></i> Trash
      </button>
    </div>
    <select v-model="type" class="form-select form-select-md ms-1">
      <option value="">-- Type --</option>
      <option value="Books">Books - Sách và giáo trình</option>
      <option value="Stationery">Stationery - Dụng cụ học tập</option>
      <option value="Electronics">Electronics - Thiết bị điện tử</option>
      <option value="Clothing">Clothing - Quần áo và phụ kiện</option>
      <option value="Courses">Courses - Khóa học</option>
      <option value="Digital">Digital - Sản phẩm kỹ thuật số</option>
      <option value="Food">Food - Đồ ăn uống</option>
      <option value="Essentials">Essentials - Đồ dùng cần thiết</option>
      <option value="Other">Other - Khác</option>
    </select>
    <select
      v-model="status"
      class="form-select form-select-md ms-1"
      aria-label=".form-select-md"
    >
      <option value="" selected>-- Status --</option>
      <option value="pending">Pending</option>
      <option value="approved">Approved</option>
      <option value="rejected">Rejected</option>
      <option value="sold">Sold</option>
    </select>
    <input
      v-model.number="priceMin"
      type="number"
      class="form-control form-control-md ms-1"
      placeholder="Min Price"
      @input="validatePriceInput"
      min="0"
    />
    <input
      v-model.number="priceMax"
      type="number"
      class="form-control form-control-md ms-1"
      placeholder="Max Price"
      @input="validatePriceInput"
      :min="priceMin"
    />
    <button class="btn btn-md btn-outline-dark ms-3" @click="onSubmit">
      Filter
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const type = ref('');
const status = ref('');
const priceMin = ref();
const priceMax = ref();
const hide = ref(false);

// Hàm validate giá trị nhập liệu
function validatePriceInput() {
  if (priceMin.value < 0) {
    priceMin.value = 0;
  }
  if (priceMax.value < priceMin.value) {
    priceMax.value = priceMin.value;
  }
}

// Theo dõi thay đổi của route.query để cập nhật giá trị bộ lọc
watch(
  () => route.query,
  (query) => {
    hide.value = query.hide || false;
    type.value = query.type || '';
    status.value = query.status || '';
    priceMin.value = query.price_min ? Number(query.price_min) : undefined;
    priceMax.value = query.price_max ? Number(query.price_max) : undefined;
  },
  { immediate: true }, // Cập nhật ngay khi component được mount
);

async function onSubmit() {
  await router.push({
    name: 'product-list',
    query: {
      hide: route.query.hide || false,
      type: type.value || undefined,
      status: status.value || undefined,
      price_min: priceMin.value || undefined,
      price_max: priceMax.value || undefined,
    },
  });
}

async function getTrash() {
  await router.push({
    name: 'product-list',
    query: {
      hide: true,
    },
  });
}
</script>

