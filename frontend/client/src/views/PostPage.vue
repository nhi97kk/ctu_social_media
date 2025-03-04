<template>
  <!--post container-->
  <!-- loader -->
  <loader v-if="loader"></loader>

  <div
    v-else
    class="list"
    style="margin-top: 4rem; height: 90vh; overflow-y: scroll"
  >
    <div v-if="!deleted" class="d-flex">
      <!-- img -->
      <div class="w-50">
        <div class="post-img mt-3">
          <div
            :id="'carousel-' + post._id"
            class="carousel slide"
            data-ride="carousel"
          >
            <!-- The slideshow -->
            <div class="carousel-inner">
              <div
                v-for="(img, index) in post.images"
                :key="img"
                class="carousel-item"
                :class="{ active: index === 0 }"
              >
                <img
                  :src="img"
                  alt="Post image"
                  class="w-100"
                  style="object-fit: contain; height: 100%"
                />
              </div>
            </div>

            <!-- Left and right controls -->
            <a
              v-if="post.images.length > 1"
              class="carousel-control-prev"
              :href="'#carousel-' + post._id"
              data-slide="prev"
            >
              <span class="carousel-control-prev-icon"></span>
            </a>
            <a
              v-if="post.images.length > 1"
              class="carousel-control-next"
              :href="'#carousel-' + post._id"
              data-slide="next"
            >
              <span class="carousel-control-next-icon"></span>
            </a>
          </div>
        </div>
      </div>

      <div class="w-50">
        <div class="px-1 posts w-100">
          <div
            class="view view-post-container smaller-margin border border-info shadow"
          >
            <div class="view-post">
              <div class="upper">
                <div class="d-flex" v-if="page != null">
                  <router-link :to="{ name: 'page', params: { id: page._id } }">
                    <div class="user">
                      <div class="profile">
                        <img
                          :src="page.avatar"
                          alt=""
                          class="border border-info rounded-circle"
                        />
                      </div>
                    </div>
                  </router-link>

                  <div class="info">
                    <h6 class="name">{{ page.name }}</h6>
                    <span style="font-size: 12px; color: #999">{{
                      timeAgo(post.createdAt)
                    }}</span>
                  </div>
                </div>

                <div class="d-flex" v-else-if="group != null">
                  <router-link
                    :to="{ name: 'group', params: { id: group._id } }"
                    class="position-relative"
                  >
                    <img
                      :src="group.avatar"
                      alt=""
                      class="rounded border border-warning"
                      style="width: 50px; height: 50px; object-fit: cover"
                    />

                    <img
                      :src="post.user.avatar"
                      alt=""
                      class="rounded-circle position-absolute border border-info"
                      style="
                        width: 35px;
                        height: 35px;
                        object-fit: cover;
                        bottom: -5px;
                        right: -5px;
                      "
                    />
                  </router-link>

                  <div class="info">
                    <h6 class="name">{{ group.name }}</h6>
                    <span class="name d-block">{{ post.user.name }}</span>
                    <span style="font-size: 12px; color: #999">{{
                      timeAgo(post.createdAt)
                    }}</span>
                  </div>
                </div>

                <div class="d-flex" v-else>
                  <router-link
                    :to="
                      post.user._id === user._id
                        ? { name: 'me-page' }
                        : { name: 'profile', params: { id: post.user._id } }
                    "
                  >
                    <div class="user">
                      <div class="profile">
                        <img
                          :src="post.user.avatar"
                          alt=""
                          class="border border-info rounded-circle"
                        />
                      </div>
                    </div>
                  </router-link>

                  <div class="info">
                    <h6 class="name">{{ post.user.name }}</h6>
                    <span style="font-size: 12px; color: #999">{{
                      timeAgo(post.createdAt)
                    }}</span>
                  </div>
                </div>

                <div class="dots">
                  <i
                    class="fa-solid fa-ellipsis btn-hover text-color"
                    style="font-size: 1.5rem"
                  ></i>

                  <div
                    class="postOptions arrow-custom position-absolute flex-column rounded-lg p-2 bg-white mt-2 border border-dark"
                    style="right: 0"
                  >
                    <div
                      v-if="user._id != post.user._id"
                      @click="submitReport(post._id)"
                      class="d-flex align-items-center btn-hover"
                    >
                      <i
                        class="fa-solid fa-triangle-exclamation mr-2 text-warning"
                      ></i>
                      <span class="text-nowrap">Report this post.</span>
                    </div>
                    <div
                      v-else
                      @click="submitDelete(post._id)"
                      class="d-flex align-items-center btn-hover"
                    >
                      <i class="fa-solid fa-trash-can mr-2 text-danger"></i>
                      <span class="text-nowrap">Delete this post.</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="desc">
                <p>{{ post?.desc }}</p>
              </div>

              <div class="actions-container mt-3">
                <div class="action">
                  <div @click="handleLike" class="btn-hover icon">
                    <i
                      class="fa-regular fa-thumbs-up"
                      :class="{ 'text-warning': post.likes.includes(user._id) }"
                    ></i>
                  </div>
                  <span
                    class="like"
                    data-toggle="modal"
                    data-target="#myModaltoViewLikes"
                    >{{ post.likes.length }} like</span
                  >
                </div>

                <div class="action">
                  <div class="icon">
                    <i class="fa-regular fa-message"></i>
                  </div>
                  <span>{{ comments.length }} comment </span>
                </div>

                <div
                  v-show="!post.shared_from && post.onModel != 'Group'"
                  class="action btn-hover"
                  @click="share(post._id)"
                >
                  <div class="icon">
                    <i class="fa-regular fa-share-from-square"></i>
                  </div>
                  <span>{{ post.shares }} share </span>
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex my-2 w-100">
            <div class="user mx-2">
              <div class="profile">
                <img
                  :src="
                    page != null && user._id === page.owner._id
                      ? page.avatar
                      : user.avatar
                  "
                  alt=""
                  class="border border-info rounded-circle shadow-lg"
                />
              </div>
            </div>

            <Form class="input-side d-flex align-items-center" style="flex: 1">
              <Field
                class="input-cmt p-2"
                style="flex: 1; border-radius: 25px"
                type="text"
                name="desc"
                placeholder="Write a comment"
                v-model="comment"
              />

              <div class="media mx-2 btn-hover">
                <div
                  class="icon"
                  @click="submitComment(post._id, post.user.name)"
                  :class="{ 'icon-disabled': !comment }"
                  :disabled="!comment"
                >
                  <i
                    class="fa-solid fa-paper-plane text-color"
                    style="font-size: 1.5rem"
                  ></i>
                </div>
              </div>
            </Form>
          </div>

          <div class="comment-post d-flex flex-column">
            <CommentCard
              v-if="comments.length > 0"
              v-for="cmt in comments"
              :comment="cmt"
              :page="page"
              :key="cmt._id"
            >
            </CommentCard>
            <div v-else class="text-center py-3 text-color">
              <span>No comments available...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="text-secondary m-0">
      <i class="fa-solid fa-triangle-exclamation"></i> This post have been
      deleted.
    </p>

    <!-- modal view like -->
    <!-- The Modal -->
    <div v-if="likeList.length > 0" class="modal" id="myModaltoViewLikes">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h5 class="modal-title text-center">Users who liked this post</h5>
            <button type="button" class="close" data-dismiss="modal">
              &times;
            </button>
          </div>
          <div class="row p-2">
            <div class="col-4" v-for="friend in likeList">
              <button
                @click="
                  $('#myModaltoViewLikes').modal('hide');
                  $router.push(
                    user._id === friend._id
                      ? { name: 'me-page' }
                      : { name: 'profile', params: { id: friend._id } }
                  );
                "
                class="btn btn-hover d-flex align-items-center my-2 bg-white w-100 rounded border border-info shadow"
              >
                <div>
                  <img
                    :src="friend.avatar"
                    alt="avatar"
                    class="rounded-circle border border-info mr-3"
                    style="width: 50px; height: 50px; object-fit: cover"
                  />
                </div>
                <div>
                  <h6>{{ friend.name }}</h6>
                  <span
                    class="text-secondary"
                    style="text-transform: capitalize"
                    >{{ friend.role }}</span
                  >
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import CommentCard from "@/components/post/CommentCard.vue";
import Loader from "@/components/Loader.vue";

import postService from "@/services/post.service.js";
import commentService from "@/services/comment.service.js";
import pageService from "@/services/page.service.js";
import groupService from "@/services/group.service.js";
import reportService from "@/services/report.service.js";
import userService from "@/services/user.service.js";

import { computed, onBeforeMount, ref, provide } from "vue";
import { Field, Form } from "vee-validate";
import Swal from "sweetalert2";
import { useToast } from "vue-toast-notification";
import { formatDistanceToNow } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const $toast = useToast();
const post = ref(null);
const user = ref(null);
const comments = ref([]);
const likeList = ref([]);
const comment = ref("");
const data = ref({
  desc: "",
});
const report = ref({
  message: "",
  targetId: route.params.id,
  targetModel: "Post",
});
const page = ref(null);
const group = ref(null);
const deleted = ref(false);
const loader = ref(true);

// Hàm tính khoảng cách thời gian theo múi giờ Việt Nam
function timeAgo(date) {
  // Múi giờ Việt Nam
  const timeZone = "Asia/Ho_Chi_Minh";
  // Chuyển đổi thời gian từ UTC về múi giờ Việt Nam
  const vietnamTime = utcToZonedTime(new Date(date), timeZone);
  // Tính khoảng cách từ thời gian hiện tại đến thời gian đã được chuyển đổi
  return formatDistanceToNow(vietnamTime, { addSuffix: true });
}

// Hàm toggle like
async function handleLike() {
  const response = await postService.likePost(post.value._id);
  if (response.status !== "success") {
    $toast.error(
      response.message || "An error occurred! Please try again later...",
      {
        position: "top-right",
      }
    );
    return;
  } else {
    post.value.likes = response.data;
    likeList.value = response.likeList;
  }
}

//
async function submitReport(postId) {
  const result = await Swal.fire({
    title: "Report Post",
    input: "textarea",
    inputLabel: "Report Details",
    inputPlaceholder: "Provide details for this report...",
    confirmButtonText: "Submit Report",
    cancelButtonText: "Cancel",
    showCancelButton: true,
    preConfirm: (inputValue) => {
      if (inputValue.trim().length === 0) {
        Swal.showValidationMessage("Report details cannot be empty.");
      } else if (inputValue.length > 500) {
        Swal.showValidationMessage(
          "Report details must be 500 characters or less."
        );
      } else {
        report.value.message = inputValue; // Gán lại chuỗi gốc nếu thỏa mãn điều kiện
      }
    },
  });

  if (!result.isConfirmed) return;

  const response = await reportService.createReport(report.value);
  if (response.status === "success") {
    $toast.success(`You reported post of ${post.value.user.name}`, {
      position: "top-right",
    });
  } else {
    $toast.error(
      response.message || "An error occurred! Please try again later.",
      {
        position: "top-right",
      }
    );
  }
}

async function submitDelete(postId) {
  const result = await Swal.fire({
    title: "Delete Post",
    text: "Are you sure you want to delete this post?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  if (!result.isConfirmed) return;

  const response = await postService.deletePost(postId);
  if (response.status === "success") {
    deleted.value = true;
    $toast.success(`Post have been deleted!`, {
      position: "top-right",
    });
  } else {
    $toast.error(response.message || "Occur error! Try again later.", {
      position: "top-right",
    });
  }
}

// Hàm gửi bình luận
async function submitComment(postId, postUserName) {
  if (!comment.value.trim()) {
    $toast.error("Your comment is empty.", {
      position: "top-right",
    });
    return;
  }

  // Create comment
  const response = await commentService.createComment(postId, comment.value);
  if (response.status === "success") {
    $toast.success(`Bạn đã bình luận về bài viết của ${postUserName}`, {
      position: "top-right",
    });
  }
  // Sau khi gửi thành công
  comment.value = "";
  loadComments(post.value._id);
}

// Hàm để tải bình luận của bài viết
async function loadComments(postId) {
  try {
    const response = await commentService.getAllCommentsPost(postId);
    if (response.status === "success") {
      likeList.value = response.likeList;
      comments.value = response.data.data; // Lưu bình luận vào biến comments
    }
  } catch (error) {
    $toast.error(
      `Lỗi xảy ra khi tải bình luận bài viết của ${post.value.user.name}`,
      {
        position: "top-right",
      }
    );
  }
}

async function share(postId) {
  // Đặt lại `desc` trước mỗi lần chia sẻ
  data.value.desc = "";

  const result = await Swal.fire({
    title: "Share Post",
    input: "textarea",
    inputLabel: "Your thoughts",
    inputPlaceholder: "Write something about this post...",
    confirmButtonText: "Share",
    cancelButtonText: "Cancel",
    showCancelButton: true,
    preConfirm: (inputValue) => {
      if (inputValue.trim().length === 0) {
        Swal.showValidationMessage("Content cannot be empty.");
      } else if (inputValue.length > 500) {
        Swal.showValidationMessage("Content must be under 500 characters.");
      } else {
        data.value.desc = inputValue; // Gán lại chuỗi gốc nếu thỏa mãn điều kiện
      }
    },
  });

  if (!result.isConfirmed) return;

  const response = await postService.share(postId, data.value);

  if (response.status !== "success") {
    $toast.error("Error occur! Try again later...", {
      position: "top-right",
    });
    return;
  } else {
    $toast.success("You have been shared a post.", {
      position: "top-right",
    });
    post.value.shares += 1;
  }
}

async function loadPage() {
  if (post.value.onModel === "Page") {
    const response = await pageService.getPage(post.value.posted_on);

    if (response.status !== "success") {
      $toast.error(res.message || "Error occur! Try again later...", {
        position: "top-right",
      });
      router.push({ name: "home-page" });
      return;
    } else {
      page.value = response.data.page;
    }
  }
}

async function loadGroup() {
  if (post.value.onModel === "Group" && route.name != "group-discussion") {
    const response = await groupService.getGroup(post.value.posted_on);

    if (response.status !== "success") {
      $toast.error(res.message || "Error occur! Try again later...", {
        position: "top-right",
      });
      router.push({ name: "home-page" });
      return;
    } else {
      group.value = response.data.group;
    }
  }
}

async function loadUser() {
  loader.value = true;
  const response = await userService.getMe();

  if (response.status !== "success") {
    $toast.error("An error occurred! Please try again later.", {
      position: "top-right",
    });
    router.push({ name: "home-page" });
    return;
  } else user.value = response.data.user;

  const res = await postService.getPost(route.params.id);

  if (res.status !== "success") {
    $toast.error(res.messost || "Error occur! Try again later...", {
      position: "top-right",
    });
    router.push({ name: "home-post" });
    return;
  } else post.value = res.data.post;

  loadComments(post.value._id);
  loadPage();
  loadGroup();
  loader.value = false;
}

onBeforeMount(() => {
  loadUser();
});

provide("user", user);
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
  content: "";
  top: -20px;
  right: 3px;
  border-width: 10px 13px;
  border-color: transparent transparent var(--text) transparent;
  border-style: solid;
}

.post-shared {
  padding: 0.5rem 1rem;
  border: 1px solid var(--text);
  border-top: none;
  border-radius: 15px;
}

.postOptions {
  display: none;
}
.dots:hover .postOptions {
  display: flex;
}

.like:hover {
  color: blue !important;
  text-decoration: underline;
  cursor: pointer;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  padding: 1.5rem 0;
  background-color: rgb(7, 42, 65);
}

.carousel-item {
  height: 400px;
}
</style>
