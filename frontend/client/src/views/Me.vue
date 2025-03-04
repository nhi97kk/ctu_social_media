<template>
  <div>
    <!-- loader -->
    <loader v-if="loader"></loader>

    <!-- content -->
    <div v-else style="margin-top: 4rem; min-height: 90vh" class="py-1">
      <me-card :user="user" :me="true" @change-img="onChangeImg"></me-card>
      <div class="container d-flex">
        <div class="d-flex flex-column align-items-center col-3">
          <h3 class="text-color">Friends ({{ friends.length }})</h3>
          <div
            v-if="friends.length > 0"
            v-for="friend in friends.slice(0, 3)"
            class="d-flex align-items-center mt-3 bg-white p-2 w-100 rounded border border-info shadow"
          >
            <router-link
              :to="
                user._id === friend._id
                  ? { name: 'me-page' }
                  : { name: 'profile', params: { id: friend._id } }
              "
            >
              <img
                :src="friend.avatar"
                alt="avatar"
                class="rounded-circle border border-info mr-3 btn-hover"
                style="width: 50px; height: 50px; object-fit: cover"
              />
            </router-link>
            <div>
              <h6>{{ friend.name }}</h6>
              <span class="text-secondary" style="text-transform: capitalize">{{
                friend.role
              }}</span>
            </div>
          </div>
          <div v-else class="text-center text-color">
            No friends available...
          </div>
          <button
            v-if="friends.length > 3"
            data-toggle="modal"
            data-target="#myModaltoViewFriend"
            class="btn btn-link mt-2"
          >
            View more
          </button>
        </div>
        <div class="posts w-70">
          <h3 class="text-color">Posts of {{ user.name }}</h3>

          <div class="timeline mb-4" v-if="posts.length > 0">
            <post-card
              v-for="post in posts"
              :key="post._id"
              :post="post"
            ></post-card>
          </div>
          <div v-else class="text-color">No posts available...</div>
        </div>
      </div>
    </div>

    <!-- The Modal -->
    <div class="modal" id="myModaltoViewFriend">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title text-center">
              All friends of {{ user.name }}
            </h4>
            <button type="button" class="close" data-dismiss="modal">
              &times;
            </button>
          </div>
          <div class="row p-2">
            <div
              class="col-4"
              v-if="friends.length > 0"
              v-for="friend in friends"
            >
              <button
                @click="
                  $('#myModaltoViewFriend').modal('hide');
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
                    style="width: 50px; height: 50px"
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
import MeCard from "@/components/me/MeCard.vue";
import PostCard from "@/components/PostCard.vue";
import Loader from "@/components/Loader.vue";

import userService from "@/services/user.service.js";
import postService from "@/services/post.service";

import { ref, onMounted, provide } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import $ from "jquery";

const router = useRouter();
const user = ref({});
const posts = ref([]);
const friends = ref([]);
const loader = ref(true); // Khởi tạo loader với false

async function refreshUsers() {
  try {
    const response = await userService.getMe();

    if (response.status !== "success") {
      await Swal.fire({
        icon: "error",
        title: "Thất bại",
        text: response.message || "Đã xảy ra lỗi, vui lòng thử lại sau!",
      });
      router.push({ name: "home-page" });
      return;
    }

    const res = await postService.getAllUserPosts(response.data.user._id);
    const ress = await userService.getAllFriends(response.data.user._id);

    user.value = response.data.user;
    posts.value = res.data.posts;
    friends.value = ress.data.friends;
  } catch (error) {
    console.error("Error fetching data", error);
  } finally {
    loader.value = false; // Dữ liệu đã sẵn sàng, ẩn loader
  }
}

// Hàm xử lý khi nhận được tín hiệu thay đổi ảnh
async function onChangeImg() {
  loader.value = true; // Hiển thị loader trong khi chờ cập nhật
  await refreshUsers(); // Cập nhật thông tin người dùng và bài viết
}

onMounted(async () => {
  await refreshUsers();
});

provide("user", user);
</script>
