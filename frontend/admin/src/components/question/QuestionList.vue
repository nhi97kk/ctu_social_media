<template>
  <!-- loader -->
  <loader v-if="loader"></loader>

  <div v-else class="px-4 mt-3">
    <QuestionFilter></QuestionFilter>
    <DataTable
      class="table table-hover table-striped table-bordered"
      width="100%"
      :options="{
        paging: false, // Tắt phân trang
        lengthChange: false, // Tắt show entries
        info: false, // Tắt thông tin phân trang (entries)
        columnDefs: [{ orderable: false, targets: [9] }],
      }"
    >
      <thead class="table-success">
        <tr>
          <th>Title</th>
          <th class="w-25">Body</th>
          <th>Topic</th>
          <th style="text-align: center">
            <i class="fa-regular fa-message"></i>
          </th>
          <th style="text-align: center"><i class="fa-regular fa-eye"></i></th>
          <th style="text-align: center">
            <i class="fa-regular fa-thumbs-up"></i>
          </th>
          <th>Created By</th>
          <th>Created At</th>
          <th>Status</th>
          <th>Option</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="question in questions" :key="question._id">
          <td>{{ question.title }}</td>
          <td>{{ question.body }}</td>
          <td>
            <span class="text-success">{{ question.topic.name }}</span>
          </td>
          <td style="text-align: center">{{ question.answers.length }}</td>
          <td style="text-align: center">{{ question.views }}</td>
          <td style="text-align: center">{{ question.likes.length }}</td>

          <td>
            <span
              class="fw-bold btn-hover"
              @click="
                $router.push({
                  name: 'user-detail',
                  params: { userId: question.createdBy._id },
                })
              "
            >
              {{ question.createdBy.name }}
              <i class="fa-solid fa-arrow-up-right-from-square text-primary"></i
            ></span>
          </td>
          <td>{{ timeAgo(question.createdAt) }}</td>
          <td>
            <span
              :class="{
                'text-danger': question.isSolved === false,
                'text-success': question.isSolved === true,
              }"
              class="text-capitalize fw-bold"
            >
              {{ question.isSolved === true ? 'Solved' : 'UnSolved' }}
            </span>
          </td>
          <td style="text-align: center">
            <button
              class="btn btn-primary btn-sm"
              @click="
                $router.push({
                  name: 'question-detail',
                  params: { questionId: question._id },
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
import QuestionFilter from '@/components/question/questionFilter.vue';
import Loader from '@/components/partials/Loader.vue';

import questionService from '@/services/question.service.js';

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
const questions = ref([]);

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
async function fetchQuestions() {
  loader.value = true;

  // Gọi service để lấy danh sách sản phẩm
  const response = await questionService.getAllQuestions(route.query);

  if (response.status === 'success') {
    questions.value = response.data.questions;
  } else {
    $toast.error(response.message || 'Failed to load questions');
  }
  loader.value = false;
}

// Khởi tạo dữ liệu khi component được mount
onMounted(fetchQuestions);

// Theo dõi sự thay đổi của query để tự động cập nhật danh sách sản phẩm
watch(() => route.query, fetchQuestions);
</script>

<style scoped></style>

