<template>
  <!-- loader -->
  <loader v-if="loader"></loader>

  <div v-else class="px-4">
    <CommentFilter></CommentFilter>
    <DataTable
      class="table table-hover table-striped table-bordered"
      width="100%"
      :options="{
        paging: false, // Tắt phân trang
        lengthChange: false, // Tắt show entries
        info: false, // Tắt thông tin phân trang (entries)
        columnDefs: [
          { orderable: false, targets: [2, 5] }, // Tắt sắp xếp cho cột thứ 3 (Post)
        ],
      }"
    >
      <thead class="table-success">
        <tr>
          <th style="text-align: center; width: 35%">Content</th>
          <th style="text-align: center">Likes</th>
          <th style="text-align: center">Post</th>
          <th style="text-align: center">Created By</th>
          <th style="text-align: center">Created At</th>
          <th style="text-align: center">Option</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="comment in comments" :key="comment._id">
          <td style="text-align: center">{{ comment.desc }}</td>
          <td style="text-align: center">
            {{ comment.likes.length }}
          </td>
          <td style="text-align: center">
            <button
              @click="
                $router.push({
                  name: 'post-detail',
                  params: { postId: comment.post._id },
                })
              "
              class="btn btn-secondary btn-sm"
            >
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </button>
          </td>
          <td style="text-align: center">
            <span
              class="fw-bold btn-hover"
              @click="
                $router.push({
                  name: 'user-detail',
                  params: { userId: comment.user._id },
                })
              "
            >
              {{ comment.user.name }}
              <i class="fa-solid fa-arrow-up-right-from-square text-primary"></i
            ></span>
          </td>
          <td style="text-align: center">{{ timeAgo(comment.createdAt) }}</td>
          <td style="text-align: center">
            <button
              class="btn btn-primary btn-sm"
              @click="
                $router.push({
                  name: 'comment-detail',
                  params: { commentId: comment._id },
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
import CommentFilter from '@/components/comment/CommentFilter.vue';
import Loader from '@/components/partials/Loader.vue';

import commentService from '@/services/comment.service.js';

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
const comments = ref([]);

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
async function fetchComments() {
  loader.value = true;

  // Gọi service để lấy danh sách sản phẩm
  const response = await commentService.getAllComments(route.query);

  if (response.status === 'success') {
    comments.value = response.data.comments;
  } else {
    $toast.error(response.message || 'Failed to load comments');
  }
  loader.value = false;
}

// Khởi tạo dữ liệu khi component được mount
onMounted(fetchComments);

// Theo dõi sự thay đổi của query để tự động cập nhật danh sách sản phẩm
watch(() => route.query, fetchComments);
</script>

<style scoped></style>

