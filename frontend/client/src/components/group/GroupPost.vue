<template>
  <div class="posts w-75 my-3">
    <div class="timeline mb-4">
      <div
        v-if="user._id === group.owner._id || group.members.includes(user._id)"
        class="view create-post border-info border shadow"
      >
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
      <post-card
        v-if="posts.length > 0"
        v-for="post in posts"
        :key="post._id"
        :post="post"
      ></post-card>
      <div v-else class="text-center my-3">No posts available.</div>
    </div>
  </div>
  <!-- The Modal to create Post -->
  <div
    v-if="user._id === group.owner._id || group.members.includes(user._id)"
    class="modal"
    id="myModaltoPost"
  >
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
              @submit="onSubmitPost"
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
                  v-model="dataPost.desc"
                />
                <ErrorMessage name="desc" class="error-feedback"></ErrorMessage>
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
</template>

<script setup>
import PostCard from "@/components/PostCard.vue";
import Loader from "@/components/Loader.vue";
import ImageList from "@/components/product/ImageList.vue";

import postService from "@/services/post.service";

import { ref, onBeforeMount, computed, inject } from "vue";
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toast-notification";
import $ from "jquery";

const $toast = useToast();
const user = inject("user");
const group = inject("group");
const posts = ref([]);
const router = useRouter();
const loading = ref(false);
const loader = ref(true);

const formData = ref(new FormData()); // Để chứa dữ liệu ảnh khi tải lên
const images = ref([]);
const dataPost = ref({
  desc: "",
  onModel: "Group", // Change this to Group
  posted_on: "",
});

const postFormSchema = yup.object({
  desc: yup
    .string()
    .required("Post content cannot be empty")
    .min(5, "Post content must have at least 5 characters")
    .max(500, "Post content cannot exceed 500 characters"),
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

async function onSubmitPost() {
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
  dataPost.value.posted_on = group._value._id;
  const response = await postService.createPost(dataPost.value);

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
    dataPost.value.desc = ""; // Reset nội dung mô tả
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

async function loadPosts() {
  const response = await postService.getAllGroupPosts(group._value._id); // Change to group service
  if (response.status !== "success") {
    $toast.error(res.message || "Error occurred! Please try again later...", {
      position: "top-right",
    });
    router.push({ name: "home-page" });
    return;
  } else {
    posts.value = response.data.posts;
  }
}

onBeforeMount(async () => {
  await loadPosts();
});
</script>
