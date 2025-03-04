<template>
  <!-- loader -->
  <loader v-if="loader"></loader>

  <div v-else class="container">
    <div class="w-100 my-3">
      <router-link :to="{ name: 'post-list' }">
        <i class="fa-solid fa-arrow-left-long"></i> All Posts
      </router-link>
    </div>

    <ReportContent
      :hide="post.hide"
      :targetId="post._id"
      :targetModel="'Post'"
      @restore="submitRestore"
      @hide="submitHide"
    ></ReportContent>

    <div class="p-4 border border-info rounded">
      <div class="">
        <div class="d-flex align-items-center" v-if="page != null">
          <router-link
            :to="{ name: 'page-detail', params: { pageId: page._id } }"
          >
            <img
              :src="page.avatar"
              alt=""
              class="border border-info rounded-circle"
              style="width: 80px; height: 80px; object-fit: cover"
            />
          </router-link>

          <div class="ms-2">
            <h6 class="fw-bold">{{ page.name }}</h6>
            <span style="font-size: 15px; color: #999">{{
              timeAgo(post.createdAt)
            }}</span>
          </div>
        </div>

        <div class="d-flex" v-else-if="group != null">
          <router-link
            :to="{ name: 'group-detail', params: { groupId: group._id } }"
            class="position-relative"
          >
            <img
              :src="group.avatar"
              alt=""
              class="rounded border border-warning"
              style="width: 80px; height: 80px; object-fit: cover"
            />

            <img
              :src="post.user.avatar"
              alt=""
              class="rounded-circle position-absolute border border-info"
              style="
                width: 60px;
                height: 60px;
                object-fit: cover;
                bottom: -5px;
                right: -5px;
              "
            />
          </router-link>

          <div class="ms-2">
            <h6 class="fw-bold">{{ group.name }}</h6>
            <span class="name d-block">{{ post.user.name }}</span>
            <span style="font-size: 12px; color: #999">{{
              timeAgo(post.createdAt)
            }}</span>
          </div>
        </div>

        <div class="d-flex align-items-center" v-else>
          <router-link
            :to="{ name: 'user-detail', params: { userId: post.user._id } }"
          >
            <img
              :src="post.user.avatar"
              alt=""
              class="border border-info rounded-circle"
              style="width: 80px; height: 80px; object-fit: cover"
            />
          </router-link>

          <div class="ms-2">
            <h6 class="fw-bold">{{ post.user.name }}</h6>
            <span style="font-size: 12px; color: #999">{{
              timeAgo(post.createdAt)
            }}</span>
          </div>
        </div>
      </div>

      <div class="my-2">
        <p>{{ post?.desc }}</p>
      </div>

      <p v-if="!postShared && post.shared_from" class="text-secondary">
        <i class="fa-solid fa-triangle-exclamation"></i> Shared post have been
        deleted.
      </p>
      <div v-else class="post-img">
        <div id="demo" class="carousel slide" data-bs-ride="carousel">
          <!-- The slideshow -->
          <div class="carousel-inner">
            <div
              v-for="(img, index) in imagesToDisplay"
              :key="img"
              class="carousel-item text-center"
              :class="{ active: index === 0 }"
            >
              <img
                :src="img"
                alt="Post image"
                style="object-fit: contain; height: 400px; width: 600px"
              />
            </div>
          </div>

          <!-- Left and right controls/icons -->
          <button
            v-if="imagesToDisplay.length > 1"
            class="carousel-control-prev"
            type="button"
            data-bs-target="#demo"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon"></span>
          </button>
          <button
            v-if="imagesToDisplay.length > 1"
            class="carousel-control-next"
            type="button"
            data-bs-target="#demo"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>
      <div v-if="postShared" class="post-shared rounded border border-info">
        <div class="upper">
          <div class="d-flex align-items-center">
            <router-link
              v-if="pageShared == null"
              :to="{
                name: 'user-detail',
                params: { userId: postShared.user._id },
              }"
            >
              <img
                :src="postShared.user.avatar"
                alt=""
                class="border border-info rounded-circle"
                style="width: 80px; height: 80px; object-fit: cover"
              />
            </router-link>
            <router-link
              v-else
              :to="{
                name: 'page-detail',
                params: { pageId: pageShared._id },
              }"
            >
              <img
                :src="pageShared.avatar"
                alt=""
                class="border border-info rounded-circle"
                style="width: 80px; height: 80px; object-fit: cover"
              />
            </router-link>

            <div class="ms-2">
              <h6 class="fw-bold">
                {{
                  pageShared == null ? postShared.user.name : pageShared.name
                }}
              </h6>
              <span style="font-size: 12px; color: #999">{{
                timeAgo(postShared.createdAt)
              }}</span>
            </div>
          </div>
        </div>

        <div class="mt-2">
          <p>{{ postShared?.desc }}</p>
        </div>
      </div>

      <div class="d-flex mt-3">
        <div class="d-flex me-4">
          <div class="me-2">
            <i class="fa-regular fa-thumbs-up"></i>
          </div>
          <span>{{ post.likes.length }} like</span>
        </div>

        <div class="d-flex me-4">
          <div class="me-2">
            <i class="fa-regular fa-message"></i>
          </div>
          <span>{{ post.comments.length }} comment </span>
        </div>

        <div class="d-flex me-4">
          <div class="me-2">
            <i class="fa-regular fa-share-from-square"></i>
          </div>
          <span>{{ post.shares }} share </span>
        </div>
      </div>
    </div>

    <div class="comment-post d-flex flex-column">
      <div v-if="post.comments.length == 0" class="text-center py-3">
        <span>No comment available...</span>
      </div>
      <div v-else>
        <div
          v-if="post.comments.length - comments.length > 0"
          class="text-center py-3"
        >
          <span
            >{{ post.comments.length - comments.length }} Comment have been move
            to Trash...</span
          >
        </div>

        <div
          v-for="comment in comments"
          :key="comment"
          class="my-2 d-flex align-items-start"
        >
          <img
            :src="comment.user.avatar"
            alt=""
            class="rounded-circle me-2 border border-info"
            style="width: 60px; height: 60px; object-fit: cover"
          />
          <div class="d-flex flex-column">
            <span class="fw-bold">{{ comment.user.name }}</span>
            <span class="p-2 rounded border border-secondary">{{
              comment.desc
            }}</span>
            <span
              ><i class="fa-regular fa-thumbs-up"></i>
              {{ comment.likes.length }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Loader from '@/components/partials/Loader.vue';
import ReportContent from '@/components/report/ReportContent.vue';

import postService from '@/services/post.service.js';
import commentService from '@/services/comment.service.js';
import pageService from '@/services/page.service.js';
import groupService from '@/services/group.service.js';

import { computed, onBeforeMount, ref } from 'vue';
import Swal from 'sweetalert2';
import { useToast } from 'vue-toast-notification';
import { formatDistanceToNow } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useRouter, useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();
const $toast = useToast();
const post = ref(null);
const comments = ref([]);
const postShared = ref(null);
const page = ref(null);
const pageShared = ref(null);
const group = ref(null);
const deleted = ref(false);
const loader = ref(true);

// Hàm tính khoảng cách thời gian theo múi giờ Việt Nam
function timeAgo(date) {
  // Múi giờ Việt Nam
  const timeZone = 'Asia/Ho_Chi_Minh';
  // Chuyển đổi thời gian từ UTC về múi giờ Việt Nam
  const vietnamTime = utcToZonedTime(new Date(date), timeZone);
  // Tính khoảng cách từ thời gian hiện tại đến thời gian đã được chuyển đổi
  return formatDistanceToNow(vietnamTime, { addSuffix: true });
}

const imagesToDisplay = computed(() => {
  return postShared.value ? postShared.value.images : post.value.images;
});

async function submitHide() {
  const result = await Swal.fire({
    title: 'Move to Trash',
    text: 'Are you sure you want to remove this post to Trash?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });

  if (!result.isConfirmed) return;

  const response = await postService.hidePost(post.value._id);
  if (response.status === 'success') {
    $toast.success(`The post have been moved!`, {
      position: 'top-right',
    });

    post.value.hide = true;
  } else {
    $toast.error(
      response.message || 'An error occurred! Please try again later.',
      {
        position: 'top-right',
      },
    );
  }
}

async function submitRestore() {
  const result = await Swal.fire({
    title: 'Restore',
    text: 'Are you sure you want to restore this post?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });

  if (!result.isConfirmed) return;

  const response = await postService.restorePost(post.value._id);
  if (response.status === 'success') {
    $toast.success(`The post have been restored!`, {
      position: 'top-right',
    });

    post.value.hide = false;
  } else {
    $toast.error(
      response.message || 'An error occurred! Please try again later.',
      {
        position: 'top-right',
      },
    );
  }
}

// Hàm để tải bình luận của bài viết
async function loadComments(postId) {
  try {
    const response = await commentService.getAllCommentsPost(postId);
    if (response.status === 'success') {
      comments.value = response.data.data; // Lưu bình luận vào biến comments
    }
  } catch (error) {
    $toast.error(
      `Lỗi xảy ra khi tải bình luận bài viết của ${post.user.name}`,
      {
        position: 'top-right',
      },
    );
  }
}

// Hàm để tải bài viết đã chia sẻ
async function loadPostShared(postId) {
  const response = await postService.getPost(postId);
  if (response.status === 'success') {
    postShared.value = response.data.post; // Lưu bình luận vào biến comments
  } else return;

  if (postShared.value.onModel === 'Page') {
    const response = await pageService.getPage(postShared.value.posted_on);

    if (response.status !== 'success') {
      return;
    } else {
      pageShared.value = response.data.page;
    }
  }
}

async function loadPage() {
  if (post.value.onModel === 'Page') {
    const response = await pageService.getPage(post.value.posted_on);

    if (response.status !== 'success') {
      $toast.error(res.message || 'Error occur! Try again later...', {
        position: 'top-right',
      });
      router.push({ name: 'post-list' });
      return;
    } else {
      page.value = response.data.page;
    }
  }
}

async function loadGroup() {
  if (post.value.onModel === 'Group' && route.name != 'group-discussion') {
    const response = await groupService.getGroup(post.value.posted_on);

    if (response.status !== 'success') {
      $toast.error(res.message || 'Error occur! Try again later...', {
        position: 'top-right',
      });
      router.push({ name: 'post-list' });
      return;
    } else {
      group.value = response.data.group;
    }
  }
}

onBeforeMount(async () => {
  const response = await postService.getPost(route.params.postId);

  if (response.status === 'success') {
    post.value = response.data.post;

    loadComments(post.value._id);
    loadPage();
    loadGroup();
    if (post.value.shared_from) {
      loadPostShared(post.value.shared_from);
    }
  } else {
    $toast.error(
      response.message || 'An error occurred! Please try again later.',
      {
        position: 'top-right',
      },
    );

    router.push({ name: 'post-list' });
  }

  loader.value = false;
});
</script>
<style scoped>
.icon-disabled {
  opacity: 0.5;
  pointer-events: none;
}

.w-99 {
  max-width: 99%;
}

.arrow-custom::before {
  position: absolute;
  content: '';
  top: -17px;
  right: 0px;
  border-width: 10px 13px;
  border-color: transparent transparent #fff transparent;
  border-style: solid;
}

.post-shared {
  padding: 0.5rem 1rem;
  border: 1px solid #fff;
  border-top: none;
  border-radius: 15px;
}

.postOptions {
  display: none;
}
.dots:hover .postOptions {
  display: flex;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  padding: 1.5rem 0;
  background-color: var(--accent);
}

.carousel-item {
  height: 400px;
}
</style>

