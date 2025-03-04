<template>
  <!-- loader -->
  <loader v-if="loader"></loader>

  <div v-else class="px-4">
    <UserFilter></UserFilter>
    <DataTable
      class="table table-hover table-striped table-bordered"
      width="100%"
      :options="{
        paging: false, // Tắt phân trang
        lengthChange: false, // Tắt show entries
        info: false, // Tắt thông tin phân trang (entries)
        columnDefs: [
          { orderable: false, targets: [0, 8] }, // Tắt sắp xếp cho cột thứ 3 (Post)
        ],
      }"
    >
      <thead class="table-success">
        <tr>
          <th>Avatar</th>
          <th>Name</th>
          <th>Email</th>
          <th>Gender</th>
          <th>Role</th>
          <th>Major</th>
          <th>Status</th>
          <th>Created At</th>
          <th>Options</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>
            <img
              :src="user.avatar"
              alt="User Image"
              width="80"
              height="80"
              style="object-fit: cover"
              class="rounded-circle"
            />
          </td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td class="text-secondary">{{ user.gender }}</td>
          <td>
            <span
              :class="{
                'text-danger': user.role === 'admin',
                'text-success': user.role === 'user',
                'text-warning': user.role === 'teacher',
              }"
              class="text-capitalize fw-bold"
            >
              {{ user.role }}
            </span>
          </td>

          <td>
            {{
              user?.major.name
                ? user.major.name + '(' + user.major.college + ')'
                : '-'
            }}
          </td>
          <td>
            <span
              :class="{
                'text-danger': user.active === false,
                'text-success': user.active === true,
              }"
              class="text-capitalize fw-bold"
            >
              {{ user.active ? 'Active' : 'InActive' }}
            </span>
          </td>

          <td>{{ timeAgo(user.createdAt) }}</td>
          <td>
            <button
              v-if="user.email !== store.email"
              class="btn btn-primary btn-sm"
              @click="goToUserDetail(user._id)"
            >
              View
            </button>
          </td>
        </tr>
      </tbody>
    </DataTable>
  </div>
</template>

<script setup>
import UserFilter from '@/components/user/UserFilter.vue';
import Loader from '@/components/partials/Loader.vue';

import userService from '@/services/user.service.js';

import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';
import { useUserStore } from '@/stores/user';

DataTable.use(DataTablesCore);

const store = useUserStore();
const $toast = useToast();
const loader = ref(true);
const route = useRoute();
const router = useRouter();
const users = ref([]);

// Hàm tính khoảng cách thời gian theo múi giờ Việt Nam
function timeAgo(date) {
  // Múi giờ Việt Nam
  const timeZone = 'Asia/Ho_Chi_Minh';
  // Chuyển đổi thời gian từ UTC về múi giờ Việt Nam
  const vietnamTime = utcToZonedTime(new Date(date), timeZone);
  // Format ngày, tháng, năm, giờ, phút, giây
  return format(vietnamTime, 'dd/MM/yyyy HH:mm:ss');
}

function goToUserDetail(id) {
  router.push({ name: 'user-detail', params: { userId: id } });
}

// Hàm fetch sản phẩm theo query
async function fetchUsers() {
  loader.value = true;

  // Gọi service để lấy danh sách sản phẩm
  const response = await userService.getAllUsers(route.query);

  if (response.status === 'success') {
    users.value = response.data.users;
  } else {
    $toast.error(response.message || 'Failed to load users');
  }
  loader.value = false;
}

// Khởi tạo dữ liệu khi component được mount
onMounted(fetchUsers);

// Theo dõi sự thay đổi của query để tự động cập nhật danh sách sản phẩm
watch(() => route.query, fetchUsers);
</script>

<style scoped></style>

