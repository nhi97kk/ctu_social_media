<template>
  <div class="d-flex jusitfy-content-center align-items-center">
    <div class="w-100">
      <router-link v-if="hide" :to="{ name: 'question-list' }">
        <i class="fa-solid fa-arrow-left-long"></i> All Questions
      </router-link>
      <button v-else @click="getTrash" class="btn btn-outline-danger">
        <i class="fa-solid fa-trash-can"></i> Trash
      </button>
    </div>

    <select
      v-model="filter"
      class="form-select form-select-md ms-1 w-25"
      aria-label=".form-select-md"
    >
      <option value="" selected>-- Status --</option>
      <option value="Unanswered">Unanswered</option>
      <option value="Unsolved">Unsolved</option>
      <option value="Solved">Solved</option>
    </select>
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
const filter = ref('');
const hide = ref(false);

// Theo dõi thay đổi của route.query để cập nhật giá trị bộ lọc
watch(
  () => route.query,
  (query) => {
    hide.value = query.hide || false;
    filter.value = query.filter || '';
  },
  { immediate: true }, // Cập nhật ngay khi component được mount
);

async function onSubmit() {
  await router.push({
    name: 'question-list',
    query: {
      filter: filter.value || undefined,
    },
  });
}

async function getTrash() {
  await router.push({
    name: 'question-list',
    query: {
      hide: true,
    },
  });
}
</script>

