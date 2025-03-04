<template>
  <div class="w-100 mt-2 d-flex justify-content-between">
    <router-link v-if="hide" :to="{ name: 'post-list' }">
      <i class="fa-solid fa-arrow-left-long"></i> All Posts
    </router-link>
    <button v-else @click="getTrash" class="btn btn-outline-danger">
      <i class="fa-solid fa-trash-can"></i> Trash
    </button>

    <div class="d-flex">
      <select
        v-model="onModel"
        class="form-select form-select-md ms-1"
        aria-label=".form-select-md"
      >
        <option value="" selected>-- Posted On --</option>
        <option value="User">User</option>
        <option value="Page">Page</option>
        <option value="Group">Group</option>
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
const onModel = ref('');

// Theo dõi thay đổi của route.query để cập nhật giá trị bộ lọc
watch(
  () => route.query,
  (query) => {
    hide.value = query.hide || false;
    onModel.value = query.onModel || '';
  },
  { immediate: true }, // Cập nhật ngay khi component được mount
);

async function onSubmit() {
  await router.push({
    name: 'post-list',
    query: {
      hide: route.query.hide || false,
      onModel: onModel.value || undefined,
    },
  });
}

async function getTrash() {
  await router.push({
    name: 'post-list',
    query: {
      hide: true,
    },
  });
}
</script>

