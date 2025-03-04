<template>
  <div class="d-flex jusitfy-content-center align-items-center">
    <div class="w-100">
      <router-link
        v-if="route.query.hide === 'true' || !route.query"
        :to="{ name: 'report-list' }"
      >
        <i class="fa-solid fa-arrow-left-long"></i> All Reports
      </router-link>
      <button v-else @click="getTrash" class="btn btn-outline-danger">
        <i class="fa-solid fa-trash-can"></i> Trash
      </button>
    </div>
    <select
      v-model="targetModel"
      class="form-select form-select-md ms-1 w-25"
      aria-label=".form-select-md"
    >
      <option value="" selected>-- Model --</option>
      <option value="Post">Post</option>
      <option value="Comment">Comment</option>
      <option value="Question">Question</option>
      <option value="Answer">Answer</option>
      <option value="User">User</option>
      <option value="Page">Page</option>
      <option value="Group">Group</option>
    </select>
    <select
      v-model="status"
      class="form-select form-select-md ms-1 w-25"
      aria-label=".form-select-md"
    >
      <option value="" selected>-- Status --</option>
      <option value="pending">Pending</option>
      <option value="resolved">Resolved</option>
      <option value="rejected">Rejected</option>
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
const targetModel = ref('');
const status = ref('');
const hide = ref(false);

// Theo dõi thay đổi của route.query để cập nhật giá trị bộ lọc
watch(
  () => route.query,
  (query) => {
    hide.value = query.hide || false;
    targetModel.value = query.targetModel || '';
    status.value = query.status || '';
  },
  { immediate: true }, // Cập nhật ngay khi component được mount
);

async function onSubmit() {
  await router.push({
    name: 'report-list',
    query: {
      targetModel: targetModel.value || undefined,
      status: status.value || undefined,
    },
  });
}

async function getTrash() {
  await router.push({
    name: 'report-list',
    query: {
      hide: true,
    },
  });
}
</script>

