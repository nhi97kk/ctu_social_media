<template>
  <!-- loader -->
  <loader v-if="loader"></loader>

  <div v-else class="px-4">
    <AnswerFilter></AnswerFilter>
    <DataTable
      class="table table-hover table-striped table-bordered"
      width="100%"
      :options="{
        paging: false, // Tắt phân trang
        lengthChange: false, // Tắt show entries
        info: false, // Tắt thông tin phân trang (entries)
        columnDefs: [
          { orderable: false, targets: [2, 6] }, // Tắt sắp xếp cho cột thứ 3 (Post)
        ],
      }"
    >
      <thead class="table-success">
        <tr>
          <th style="width: 40%">Content</th>
          <th style="text-align: center">
            <i class="fa-regular fa-thumbs-up"></i>
          </th>
          <th>Question</th>
          <th>Created By</th>
          <th>Created At</th>
          <th>Status</th>
          <th>Option</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="answer in answers" :key="answer._id">
          <td>{{ answer.content }}</td>
          <td style="text-align: center">{{ answer.likes.length }}</td>
          <td style="text-align: center">
            <button
              @click="
                $router.push({
                  name: 'question-detail',
                  params: { questionId: answer.question },
                })
              "
              class="btn btn-secondary"
            >
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </button>
          </td>
          <td>
            <span
              class="fw-bold btn-hover"
              @click="
                $router.push({
                  name: 'user-detail',
                  params: { userId: answer.createdBy._id },
                })
              "
            >
              {{ answer.createdBy.name }}
              <i class="fa-solid fa-arrow-up-right-from-square text-primary"></i
            ></span>
          </td>
          <td>{{ timeAgo(answer.createdAt) }}</td>
          <td>
            <span
              :class="{
                'text-secondary': answer.isSolution === false,
                'text-success': answer.isSolution === true,
              }"
              class="text-capitalize fw-bold"
            >
              {{ answer.isSolution === true ? 'Solution' : 'Not Solution' }}
            </span>
          </td>
          <td style="text-align: center">
            <button
              class="btn btn-primary btn-sm"
              @click="goToAnswerDetail(answer._id)"
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
import AnswerFilter from '@/components/answer/AnswerFilter.vue';
import Loader from '@/components/partials/Loader.vue';

import answerService from '@/services/answer.service.js';

import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';

DataTable.use(DataTablesCore);

const $toast = useToast();
const loader = ref(true);
const route = useRoute();
const router = useRouter();
const answers = ref([]);

// Hàm tính khoảng cách thời gian theo múi giờ Việt Nam
function timeAgo(date) {
  // Múi giờ Việt Nam
  const timeZone = 'Asia/Ho_Chi_Minh';
  // Chuyển đổi thời gian từ UTC về múi giờ Việt Nam
  const vietnamTime = utcToZonedTime(new Date(date), timeZone);
  // Format ngày, tháng, năm, giờ, phút, giây
  return format(vietnamTime, 'dd/MM/yyyy HH:mm:ss');
}

function goToAnswerDetail(id) {
  router.push({ name: 'answer-detail', params: { answerId: id } });
}

// Hàm fetch sản phẩm theo query
async function fetchAnswers() {
  loader.value = true;

  // Gọi service để lấy danh sách sản phẩm
  const response = await answerService.getAllAnswers(route.query);

  if (response.status === 'success') {
    answers.value = response.data.answers;
  } else {
    $toast.error(response.message || 'Failed to load answers');
  }
  loader.value = false;
}

// Khởi tạo dữ liệu khi component được mount
onMounted(fetchAnswers);

// Theo dõi sự thay đổi của query để tự động cập nhật danh sách sản phẩm
watch(() => route.query, fetchAnswers);
</script>

<style scoped></style>

