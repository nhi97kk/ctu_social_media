<template>
  <!-- loader -->
  <loader v-if="loader"></loader>

  <div v-else class="px-4">
    <TopicFilter></TopicFilter>
    <DataTable
      class="table table-hover table-striped table-bordered"
      width="100%"
      :options="{
        paging: false, // Tắt phân trang
        lengthChange: false, // Tắt show entries
        info: false, // Tắt thông tin phân trang (entries)
        columnDefs: [
          { orderable: false, targets: [5] }, // Tắt sắp xếp cho cột thứ 3 (Post)
        ],
      }"
    >
      <thead class="table-success">
        <tr>
          <th style="width: 20%">Name</th>
          <th style="width: 30%">Description</th>
          <th>Questions</th>
          <th>Created By</th>
          <th>Created At</th>
          <th>Options</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="topic in topics" :key="topic._id">
          <td>{{ topic.name }}</td>
          <td>{{ topic.desc }}</td>
          <td style="text-align: center">{{ topic.questions.length }}</td>
          <td>
            <span
              class="fw-bold btn-hover"
              @click="
                $router.push({
                  name: 'user-edit',
                  params: { userId: topic.createdBy._id },
                })
              "
            >
              {{ topic.createdBy.name }}
              <i class="fa-solid fa-arrow-up-right-from-square text-primary"></i
            ></span>
          </td>
          <td>{{ timeAgo(topic.createdAt) }}</td>

          <td style="text-align: center">
            <button
              class="btn btn-warning btn-sm me-1"
              @click="
                $router.push({
                  name: 'topic-edit',
                  params: { topicId: topic._id },
                })
              "
            >
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    </DataTable>
  </div>
</template>

<script setup>
import Loader from '@/components/partials/Loader.vue';
import TopicFilter from './TopicFilter.vue';

import topicService from '@/services/topic.service.js';

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
const topics = ref([]);

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
async function fetchTopics() {
  loader.value = true;

  // Gọi service để lấy danh sách sản phẩm
  const response = await topicService.getAllTopics();

  if (response.status === 'success') {
    topics.value = response.data.topics;
  } else {
    $toast.error(response.message || 'Failed to load topics');
  }
  loader.value = false;
}

// Khởi tạo dữ liệu khi component được mount
onMounted(fetchTopics);
</script>

<style scoped></style>

