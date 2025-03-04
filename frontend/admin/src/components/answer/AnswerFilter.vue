<template>
  <div class="w-100 d-flex justify-content-between">
    <router-link v-if="hide" :to="{ name: 'answer-list' }">
      <i class="fa-solid fa-arrow-left-long"></i> All Answers
    </router-link>
    <button v-else @click="getTrash" class="btn btn-outline-danger">
      <i class="fa-solid fa-trash-can"></i> Trash
    </button>

    <div class="d-flex">
      <select
        v-model="isSolution"
        class="form-select form-select-md ms-1"
        aria-label=".form-select-md"
      >
        <option value="" selected>-- Status --</option>
        <option value="true">Solution</option>
        <option value="false">Not Solution</option>
      </select>

      <button class="btn btn-md btn-outline-dark ms-3" @click="onSubmit">
        Filter
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const hide = ref(false);
const isSolution = ref('');

// Theo dõi thay đổi của route.query để cập nhật giá trị bộ lọc
watch(
  () => route.query,
  (query) => {
    hide.value = query.hide || false;
    isSolution.value = query.isSolution || '';
  },
  { immediate: true }, // Cập nhật ngay khi component được mount
);

async function onSubmit() {
  await router.push({
    name: 'answer-list',
    query: {
      hide: route.query.hide || false,
      isSolution: isSolution.value || undefined,
    },
  });
}

async function getTrash() {
  await router.push({
    name: 'answer-list',
    query: {
      hide: true,
    },
  });
}
</script>

