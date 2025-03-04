<template>
  <div class="d-flex jusitfy-content-center align-items-center">
    <input
      v-model="name"
      type="text"
      class="form-control form-control-md ml-1"
      placeholder="Type product key..."
    />
    <select v-model="type" class="form-control ml-1">
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
    <input
      v-model.number="priceMin"
      type="number"
      class="form-control form-control-md ml-1"
      placeholder="Min Price"
      @input="validatePriceInput"
      min="0"
    />
    <input
      v-model.number="priceMax"
      type="number"
      class="form-control form-control-md ml-1"
      placeholder="Max Price"
      @input="validatePriceInput"
      :min="priceMin"
    />
    <button
      class="btn btn-warning text-white ml-3 shadow border border-white"
      @click="onSubmit"
    >
      Filter
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const type = ref("");
const name = ref("");
const priceMin = ref();
const priceMax = ref();
const status = ref("");
const createdBy = ref();

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
    status.value = query.status || "";
    createdBy.value = query.createdBy || undefined;
    type.value = query.type || "";
    name.value = query.name || "";
    priceMin.value = query.price_min ? Number(query.price_min) : undefined;
    priceMax.value = query.price_max ? Number(query.price_max) : undefined;
  },
  { immediate: true } // Cập nhật ngay khi component được mount
);

async function onSubmit() {
  await router.push({
    name: "product-list",
    query: {
      status: status.value || undefined,
      createdBy: createdBy.value || undefined,
      name: name.value || undefined,
      type: type.value || undefined,
      price_min: priceMin.value || undefined,
      price_max: priceMax.value || undefined,
    },
  });
}
</script>
