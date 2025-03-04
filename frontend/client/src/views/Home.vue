<template>
  <router-view>
    <!-- loader -->
    <loader v-if="loader"></loader>

    <!-- content -->
    <div v-else class="wrapper" style="min-height: 90vh">
      <left-side></left-side>
      <div class="posts">
        <!--create post-->
        <div class="timeline">
          <div class="view create-post border border-info shadow">
            <div class="input">
              <div class="user">
                <div class="profile">
                  <img :src="user?.avatar" alt="" />
                </div>
              </div>
              <div
                class="input w-100 text-white py-2 px-3 ml-3"
                data-toggle="modal"
                data-target="#myModaltoPost"
              >
                What's on your mind, {{ user?.name }}?
              </div>
            </div>
            <div class="media">
              <div class="category">
                <div class="option">
                  <div class="icon">
                    <i class="fa-solid fa-question"></i>
                  </div>
                  <span>How's</span>
                </div>

                <div class="option">
                  <div class="icon">
                    <i class="fa-solid fa-icons"></i>
                  </div>
                  <span>your day</span>
                </div>

                <div class="option">
                  <div class="icon">
                    <i class="fa-solid fa-person-running"></i>
                  </div>
                  <span>going?</span>
                </div>
              </div>
            </div>
          </div>
          <!-- //Posts -->
          <PostCard
            v-if="posts.length > 0"
            v-for="post in posts"
            :post="post"
            :key="post._id"
          />
          <div v-else class="text-center text-color my-2">
            No posts available...
          </div>
        </div>
      </div>
      <right-side></right-side>
    </div>

    <!-- The Modal -->
    <div class="modal" id="myModaltoPost">
      <div class="modal-dialog modal-lg">
        <div class="modal-content list">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title text-center">Create post</h4>
            <button type="button" class="close" data-dismiss="modal">
              &times;
            </button>
          </div>

          <!-- Modal body -->
          <div class="view view-post-container smaller-margin">
            <div class="view-post p-4">
              <Form
                class="form"
                @submit="onSubmit"
                :validation-schema="postFormSchema"
              >
                <!-- post content  -->
                <div class="mb-3 form-group">
                  <label for="desc" class="form-label">Content: </label>
                  <Field
                    as="textarea"
                    rows="4"
                    type="text"
                    name="desc"
                    id="desc"
                    class="form-control"
                    :placeholder="`What's on your mind, ${user?.name}?`"
                    v-model="data.desc"
                  />
                  <ErrorMessage
                    name="desc"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>

                <!-- Image List -->
                <div class="mb-3 form-group">
                  <label class="form-label font-weight-bold">Images: </label>
                  <ImageList
                    v-if="images.length > 0"
                    :images="images"
                    @remove="removeImage"
                    :can-remove="true"
                  />
                  <div
                    v-else
                    class="col-4 rounded w-100 d-flex justify-content-center align-items-center bg-secondary"
                    style="height: 150px"
                  >
                    <i class="fa-solid fa-image" style="font-size: 5rem"></i>
                  </div>
                </div>

                <!-- Upload Images -->
                <div class="mb-3 form-group">
                  <label
                    v-if="images.length < 5"
                    for="images"
                    class="form-label text-primary font-weight-bold p-1 border border-primary rounded btn-hover"
                    >Add Image
                  </label>
                  <input
                    hidden
                    type="file"
                    name="images"
                    id="images"
                    class="form-control"
                    multiple
                    accept="image/*"
                    @change="onImagesChange"
                  />
                </div>

                <!-- btn submit -->
                <div class="form-group text-center">
                  <button
                    class="btn btn-warning"
                    type="submit"
                    :disabled="loading"
                  >
                    Create
                    <span
                      class="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                      v-if="loading"
                    ></span>
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </router-view>
</template>

<script setup>
import LeftSide from "@/components/home/LeftSide.vue";
import RightSide from "@/components/home/RightSide.vue";
import PostCard from "@/components/PostCard.vue";
import Loader from "@/components/Loader.vue";
import ImageList from "@/components/product/ImageList.vue";

import userService from "@/services/user.service.js";
import postService from "@/services/post.service";

import { useChatStore } from "@/stores/chat.js";

import { ref, onBeforeMount, computed, provide, onMounted } from "vue";
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toast-notification";
import $ from "jquery";

const chatStore = useChatStore();
const $toast = useToast();
const user = ref({});
const posts = ref([]);
const router = useRouter();
const loading = ref(false);
const loader = ref(true);
const images = ref([]);
const formData = ref(new FormData()); // Để chứa dữ liệu ảnh khi tải lên
const data = ref({
  desc: "",
  onModel: "User",
  posted_on: "",
});

const postFormSchema = yup.object({
  desc: yup
    .string()
    .required("Post content is requied!")
    .min(5, "Post content must have at least 5 letters.")
    .max(500, "Post content must be less than 50 letters."),
});

// Handle image change (preview images before submitting)
function onImagesChange(e) {
  for (let i = 0; i < e.target.files.length; i++) {
    const file = e.target.files[i];
    images.value.push(file); // Add to images array for preview
    formData.value.append("post", file);
  }
  // Clear input file sau khi thêm hình ảnh
  e.target.value = null;
}

// Remove an image
function removeImage(index) {
  images.value.splice(index, 1);
  // Xóa hình ảnh khỏi FormData
  const newFormData = new FormData();
  images.value.forEach((image) => {
    if (typeof image !== "string") {
      newFormData.append("post", image);
    }
  });
  formData.value = newFormData;
}

async function onSubmit() {
  // Check if images are selected
  if (images.value.length === 0) {
    $toast.error("Please upload at least one image.", {
      position: "top-right",
    });
    return;
  }

  const result = await Swal.fire({
    title: "Confirmation",
    text: "Are you sure you want to add this post?",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  loading.value = true;

  // Create post
  data.value.posted_on = user.value._id;
  const response = await postService.createPost(data.value);

  if (response.status !== "success") {
    $toast.error("Error occur! Try again later...", {
      position: "top-right",
    });
    loading.value = false;
    return;
  }

  if (response.status === "success") {
    //  Add new image
    const res = await postService.createPostImages(
      response.data.post._id,
      formData.value
    );

    $toast.success("Create post successfully!", {
      position: "top-right",
    });
    posts.value = [res.data.post, ...posts.value];

    // Reset modal data
    data.value.desc = ""; // Reset nội dung mô tả
    // Reset modal data
    images.value = []; // Xóa URL ảnh
    formData.value = new FormData(); // Xóa dữ liệu ảnh
    $("#myModaltoPost").modal("hide");
  } else {
    $toast.error("Error occur! Try again later...", {
      position: "top-right",
    });
  }
  loading.value = false;
}

async function refresh() {
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

  const res = await postService.getNewsFeed();

  posts.value = res.data.posts;
  user.value = response.data.user;
  chatStore.socket.emit("new-user-add", user.value._id);
  loader.value = false;
}

onBeforeMount(async () => {
  await refresh();
});

onMounted(() => {
  chatStore.setupSocket(); // Thiết lập kết nối socket khi component được mount
});

provide("user", user);
</script>
<style scoped>
@import "./style/home.css";
</style>
