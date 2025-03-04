<template>
  <!-- loader -->
  <loader v-if="loader"></loader>

  <div v-else class="px-4">
    <PostFilter></PostFilter>
    <DataTable
      class="table table-hover table-striped table-bordered"
      width="100%"
      :options="{
        paging: false, // Tắt phân trang
        lengthChange: false, // Tắt show entries
        info: false, // Tắt thông tin phân trang (entries)
        columnDefs: [
          { orderable: false, targets: [6] }, // Tắt sắp xếp cho cột thứ 3 (Post)
        ],
      }"
    >
      <thead class="table-success">
        <tr>
          <th style="width: 40%; text-align: center">Content</th>
          <th style="text-align: center">
            <i class="fa-regular fa-thumbs-up"></i>
          </th>
          <th style="text-align: center">
            <i class="fa-regular fa-message"></i>
          </th>

          <th style="text-align: center">Posted On</th>
          <th style="text-align: center">Posted By</th>
          <th style="text-align: center">Created At</th>
          <th style="text-align: center">Option</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in posts" :key="post._id">
          <td style="text-align: center">{{ post.desc }}</td>
          <td style="text-align: center">{{ post.likes.length }}</td>
          <td style="text-align: center">
            {{ post.comments.length }}
          </td>
          <td style="text-align: center">
            <span
              :class="{
                'text-danger': post.onModel === 'Group',
                'text-success': post.onModel === 'User',
                'text-warning': post.onModel === 'Page',
              }"
              class="text-capitalize fw-bold"
            >
              {{ post.onModel }}
            </span>
            <span
              v-if="post.onModel !== 'User'"
              class="fw-bold text-capitalize"
            >
              - {{ post.posted_on.name }}</span
            >
          </td>
          <td style="text-align: center">
            <span
              class="fw-bold btn-hover"
              @click="
                $router.push({
                  name: 'user-detail',
                  params: { userId: post.user._id },
                })
              "
            >
              {{ post.user.name }}
              <i class="fa-solid fa-arrow-up-right-from-square text-primary"></i
            ></span>
          </td>
          <td style="text-align: center">{{ timeAgo(post.createdAt) }}</td>
          <td style="text-align: center">
            <button
              class="btn btn-primary btn-sm"
              @click="goToPostDetail(post._id)"
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
import Loader from '@/components/partials/Loader.vue';
import PostFilter from '@/components/post/PostFilter.vue';

import postService from '@/services/post.service.js';

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
const router = useRouter();
const route = useRoute();
const posts = ref([]);

// Hàm tính khoảng cách thời gian theo múi giờ Việt Nam
function timeAgo(date) {
  // Múi giờ Việt Nam
  const timeZone = 'Asia/Ho_Chi_Minh';
  // Chuyển đổi thời gian từ UTC về múi giờ Việt Nam
  const vietnamTime = utcToZonedTime(new Date(date), timeZone);
  // Format ngày, tháng, năm, giờ, phút, giây
  return format(vietnamTime, 'dd/MM/yyyy HH:mm:ss');
}

function goToPostDetail(id) {
  router.push({ name: 'post-detail', params: { postId: id } });
}

// Hàm fetch sản phẩm theo query
async function fetchPosts() {
  loader.value = true;

  // Gọi service để lấy danh sách sản phẩm
  const response = await postService.getAllPosts(route.query);

  if (response.status === 'success') {
    posts.value = response.data.posts;
  } else {
    $toast.error(response.message || 'Failed to load posts');
  }
  loader.value = false;
}

// Khởi tạo dữ liệu khi component được mount
onMounted(fetchPosts);

// Theo dõi sự thay đổi của query để tự động cập nhật danh sách sản phẩm
watch(() => route.query, fetchPosts);
</script>

<style scoped></style>

