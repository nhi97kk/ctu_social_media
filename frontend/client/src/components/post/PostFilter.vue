<template>
  <div>
    <button
      data-toggle="modal"
      data-target="#myModaltoSearchPost"
      class="btn search text-white p-2 rounded-circle d-flex text-center justify-content-center"
    >
      <i
        class="fa-solid fa-magnifying-glass align-self-center"
        style="font-size: 1.2rem"
      ></i>
    </button>

    <!-- The Modal -->
    <div class="modal list" id="myModaltoSearchPost">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title text-center">Search for Posts...</h4>
            <button type="button" class="close" data-dismiss="modal">
              &times;
            </button>
          </div>

          <!-- Modal body -->
          <div class="view view-post-container smaller-margin">
            <div class="view-post p-4">
              <div class="d-flex jusitfy-content-center align-items-center">
                <input
                  type="search"
                  class="form-control ml-3"
                  placeholder="Search by content"
                  v-model="desc"
                  @keyup.enter="onSubmit"
                />

                <button class="btn btn-md btn-success ml-3" @click="onSubmit">
                  Search
                </button>
              </div>
              <hr />
              <div class="">
                <div v-if="posts.length == 0" class="w-100 text-center py-3">
                  <span>No posts available...</span>
                </div>
                <div v-else class="w-100 text-center py-3">
                  <span>{{ posts.length }} results found.</span>
                </div>
                <div v-for="post in posts" :key="post._id" class="w-100 mb-2">
                  <div
                    class="p-3 view view-post-container smaller-margin border border-info rounded shadow"
                  >
                    <div class="view-post">
                      <div class="upper">
                        <div class="d-flex">
                          <div class="user">
                            <div class="profile">
                              <img
                                :src="post.user.avatar"
                                alt=""
                                class="border border-info rounded-circle"
                              />
                            </div>
                          </div>

                          <div class="info ml-2">
                            <h6 class="name">{{ post.user.name }}</h6>
                            <span style="font-size: 12px; color: #999">{{
                              timeAgo(post.createdAt)
                            }}</span>
                          </div>
                        </div>

                        <div class="dots"></div>
                      </div>

                      <div class="desc my-2">
                        <p>{{ post?.desc }}</p>
                      </div>

                      <div class="post-img">
                        <img
                          class="w-100"
                          style="height: 300px; object-fit: contain"
                          :src="post.images[0]"
                          alt="Post image"
                        />
                      </div>

                      <div class="actions-container mt-3">
                        <button
                          @click="
                            $('#myModaltoSearchPost').modal('hide');
                            $router.push({
                              name: 'post',
                              params: { id: post._id },
                            });
                          "
                          class="btn btn-primary w-100"
                        >
                          View More
                          <i
                            class="fa-solid fa-arrow-up-right-from-square text-white"
                          ></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import postService from "@/services/post.service.js";

import { ref, onBeforeMount, provide } from "vue";
import { useRoute, useRouter } from "vue-router";
import { formatDistanceToNow } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import $ from "jquery";

const route = useRoute();
const router = useRouter();
const posts = ref([]);
const desc = ref("");

// Hàm tính khoảng cách thời gian theo múi giờ Việt Nam
function timeAgo(date) {
  // Múi giờ Việt Nam
  const timeZone = "Asia/Ho_Chi_Minh";
  // Chuyển đổi thời gian từ UTC về múi giờ Việt Nam
  const vietnamTime = utcToZonedTime(new Date(date), timeZone);
  // Tính khoảng cách từ thời gian hiện tại đến thời gian đã được chuyển đổi
  return formatDistanceToNow(vietnamTime, { addSuffix: true });
}

// Hàm fetch sản phẩm theo query
async function onSubmit() {
  const filter = {};

  if (desc.value.trim()) {
    filter.desc = desc.value.trim();
    filter.onModel = "User";
  } else return;

  // Gọi service để lấy danh sách sản phẩm
  const response = await postService.search(filter);

  if (response.status === "success") {
    posts.value = response.data.posts;
  } else {
    posts.value = [];
  }
}
</script>
<style>
.modal-backdrop {
  z-index: 90 !important;
}
</style>
