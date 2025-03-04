<template>
  <div class="row mb-2">
    <h2 class="col-6">All Accounts</h2>
    <div class="col-6 d-flex justify-content-end align-items-center">
      <router-link :to="{ name: 'user-add' }" class="btn btn-success"
        >Add New</router-link
      >
    </div>
  </div>
  <div class="d-flex jusitfy-content-center align-items-center">
    <input
      type="search"
      class="form-control"
      placeholder="Search by email"
      v-model="email"
    />
    <select v-model="role" class="form-select form-select-md ms-1">
      <option value="" selected>All role</option>
      <option value="admin">Admin</option>
      <option value="teacher">Teacher</option>
      <option value="user">User</option>
    </select>
    <select
      v-model="active"
      class="form-select form-select-md ms-1"
      aria-label=".form-select-md"
    >
      <option value="" selected>Status</option>
      <option value="active">Active</option>
      <option value="inactive">InActive</option>
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
const email = ref('');
const role = ref('');
const active = ref('');

// Theo dõi thay đổi của route.query để cập nhật giá trị bộ lọc
watch(
  () => route.query,
  (query) => {
    email.value = query.email || '';
    role.value = query.role || '';
    active.value =
      query.active == 'true'
        ? 'active'
        : query.active == 'false'
        ? 'inactive'
        : ''; // Trường hợp không có giá trị thì để trống
  },
  { immediate: true }, // Cập nhật ngay khi component được mount
);

async function onSubmit() {
  await router.push({
    name: 'user-list',
    query: {
      email: email.value.trim() ? email.value.trim() : undefined,
      role: role.value ? role.value : undefined,
      active: active.value ? active.value === 'active' : undefined,
    },
  });
}
</script>

