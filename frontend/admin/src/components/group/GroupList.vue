<template>
  <!-- loader -->
  <loader v-if="loader"></loader>

  <div v-else class="px-4">
    <GroupFilter></GroupFilter>
    <DataTable
      class="table table-hover table-striped table-bordered"
      width="100%"
      :options="{
        paging: false, // Tắt phân trang
        lengthChange: false, // Tắt show entries
        info: false, // Tắt thông tin phân trang (entries)
        columnDefs: [
          { orderable: false, targets: [2, 3, 7] }, // Tắt sắp xếp cho cột thứ 3 (Post)
        ],
      }"
    >
      <thead class="table-success">
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Avatar</th>
          <th>Cover Image</th>
          <th>Owner</th>
          <th>Status</th>
          <th>Created At</th>
          <th>Option</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="group in groups" :key="group._id">
          <td>{{ group.name }}</td>
          <td>{{ group.desc }}</td>
          <td>
            <img
              v-if="group.avatar"
              :src="group.avatar"
              alt="Group Image"
              width="80"
              height="80"
              style="object-fit: cover"
            />
            <span v-else>No Image</span>
          </td>
          <td>
            <img
              v-if="group.coverImage"
              :src="group.coverImage"
              alt="Group Image"
              width="120"
              height="80"
              style="object-fit: cover"
            />
            <span v-else>No Image</span>
          </td>

          <td>
            <span
              class="fw-bold btn-hover"
              @click="
                $router.push({
                  name: 'user-detail',
                  params: { userId: group.owner._id },
                })
              "
            >
              {{ group.owner.name }}
              <i class="fa-solid fa-arrow-up-right-from-square text-primary"></i
            ></span>
          </td>
          <td>
            <span
              :class="{
                'text-warning': group.status === 'pending',
                'text-success': group.status === 'approved',
                'text-danger': group.status === 'rejected',
              }"
              class="text-capitalize fw-bold"
            >
              {{ group.status }}
            </span>
          </td>
          <td>{{ timeAgo(group.createdAt) }}</td>

          <td>
            <button
              class="btn btn-primary btn-sm"
              @click="
                $router.push({
                  name: 'group-detail',
                  params: { groupId: group._id },
                })
              "
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
import GroupFilter from '@/components/group/GroupFilter.vue';
import Loader from '@/components/partials/Loader.vue';

import groupService from '@/services/group.service.js';

import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';
import Swal from 'sweetalert2';

DataTable.use(DataTablesCore);

const $toast = useToast();
const loader = ref(true);
const route = useRoute();
const router = useRouter();
const groups = ref([]);

// Hàm tính khoảng cách thời gian theo múi giờ Việt Nam
function timeAgo(date) {
  // Múi giờ Việt Nam
  const timeZone = 'Asia/Ho_Chi_Minh';
  // Chuyển đổi thời gian từ UTC về múi giờ Việt Nam
  const vietnamTime = utcToZonedTime(new Date(date), timeZone);
  // Format ngày, tháng, năm, giờ, phút, giây
  return format(vietnamTime, 'dd/MM/yyyy HH:mm:ss');
}

// Hàm fetch sản phẩm theo query
async function fetchGroups() {
  loader.value = true;

  // Gọi service để lấy danh sách sản phẩm
  const response = await groupService.getAllGroups(route.query);

  if (response.status === 'success') {
    groups.value = response.data.groups;
  } else {
    $toast.error(response.message || 'Failed to load groups');
  }
  loader.value = false;
}

// Khởi tạo dữ liệu khi component được mount
onMounted(fetchGroups);

// Theo dõi sự thay đổi của query để tự động cập nhật danh sách sản phẩm
watch(() => route.query, fetchGroups);
</script>

<style scoped></style>

