<template>
  <div class="w-100">
    <router-link v-if="hide" :to="{ name: 'comment-list' }">
      <i class="fa-solid fa-arrow-left-long"></i> Back to List Comments
    </router-link>
    <button v-else @click="getTrash" class="btn btn-outline-danger">
      <i class="fa-solid fa-trash-can"></i> Trash
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const hide = ref(false);

// Theo dõi thay đổi của route.query để cập nhật giá trị bộ lọc
watch(
  () => route.query,
  (query) => {
    hide.value = query.hide || false;
  },
  { immediate: true }, // Cập nhật ngay khi component được mount
);

async function getTrash() {
  await router.push({
    name: 'comment-list',
    query: {
      hide: true,
    },
  });
}
</script>

