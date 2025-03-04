<template>
  <div class="w-100 d-flex justify-content-between">
    <div></div>
    <div class="col-6 d-flex justify-content-end align-items-center">
      <router-link :to="{ name: 'topic-add' }" class="btn btn-success"
        >Add Topic</router-link
      >
    </div>
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
    name: 'topic-list',
    query: {
      hide: true,
    },
  });
}
</script>

