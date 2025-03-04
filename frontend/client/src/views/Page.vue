<template>
  <router-view>
    <!-- loader -->
    <loader v-if="loader"></loader>

    <!-- content  -->
    <div v-else>
      <div class="container py-1" style="margin-top: 4rem">
        <!-- Cover Image -->
        <div class="row justify-content-center position-relative">
          <div class="col-md-10 col-12">
            <img
              :src="page.coverImage"
              alt="Cover Image"
              class="img-fluid w-100 rounded shadow border border-info"
              style="max-height: 300px; object-fit: cover"
            />
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="row col-md-9 col-12">
            <!-- Avatar -->
            <div class="col-md-3 col-12" style="height: 120px">
              <img
                :src="page.avatar"
                alt="Avatar"
                class="rounded-circle img-thumbnail position-absolute shadow border border-info"
                style="
                  bottom: 20px;
                  width: 170px;
                  height: 170px;
                  object-fit: cover;
                  border: 0.5px solid white;
                "
              />
            </div>
            <!-- Profile info -->
            <div class="col-md-9 col-12 py-3">
              <div class="info-profile text-color d-flex flex-column w-75">
                <h4>
                  {{ page.name }}
                </h4>
                <span class="text-color">
                  <i class="fa-solid fa-file-lines mr-2 text-success"></i>
                  {{ page.desc }}
                </span>
                <span>
                  <i class="fa-solid fa-calendar-check text-primary mr-2"></i>
                  {{ page.followers.length }} Follow
                </span>
              </div>

              <div v-if="user._id === page.owner._id">
                <button
                  data-toggle="modal"
                  data-target="#myModaltoEditPage"
                  class="btn btn-warning text-white position-absolute shadow border border-white"
                  style="top: 1rem; right: 0"
                >
                  <span><i class="fa-solid fa-gear mr-2"></i>Edit page</span>
                </button>

                <button
                  data-toggle="modal"
                  data-target="#myModaltoPost"
                  class="btn btn-success text-white position-absolute shadow border border-white"
                  style="top: 4rem; right: 0"
                >
                  <span
                    ><i class="fa-solid fa-calendar-plus mr-2"></i>Create
                    post</span
                  >
                </button>
              </div>
              <div v-else>
                <button
                  @click="handleFollow(page._id)"
                  class="btn position-absolute shadow border border-white"
                  :class="
                    page.followers.some((follower) => follower._id === user._id)
                      ? 'btn-outline-danger'
                      : 'btn-info'
                  "
                  style="top: 1rem; right: 0"
                >
                  <i
                    class="fa-solid mr-2"
                    :class="
                      page.followers.some(
                        (follower) => follower._id === user._id
                      )
                        ? 'fa-thumbs-down'
                        : 'fa-thumbs-up'
                    "
                  ></i>
                  <span>{{
                    page.followers.some((follower) => follower._id === user._id)
                      ? "Unfollow"
                      : "Follow"
                  }}</span>
                </button>
                <button
                  class="btn btn-outline-warning position-absolute shadow border border-white"
                  style="top: 4rem; right: 0"
                  @click="submitReport(page._id)"
                >
                  <i class="fa-solid fa-triangle-exclamation mr-2"></i>
                  <span>Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-md-10 col-12">
            <hr class="w-100 border-info" />
          </div>
        </div>
      </div>
      <div class="container d-flex">
        <div class="d-flex flex-column align-items-center col-3">
          <h3 class="text-color">Followers ({{ page.followers.length }})</h3>

          <div
            v-if="page.followers.length > 0"
            v-for="friend in page.followers.slice(0, 3)"
            class="d-flex align-items-center mt-3 bg-white p-2 w-100 rounded border border-info shadow"
          >
            <button
              class="btn"
              @click="
                $router.push(
                  user._id === friend._id
                    ? { name: 'me-page' }
                    : { name: 'profile', params: { id: friend._id } }
                )
              "
            >
              <img
                :src="friend.avatar"
                alt="avatar"
                class="rounded-circle border border-info mr-3 btn-hover"
                style="width: 50px; height: 50px"
              />
            </button>
            <div>
              <h6>{{ friend.name }}</h6>
              <span class="text-secondary" style="text-transform: capitalize">{{
                friend.role
              }}</span>
            </div>
          </div>
          <div v-else class="text-center text-color">
            No followers available...
          </div>
          <button
            v-if="page.followers.length > 3"
            data-toggle="modal"
            data-target="#myModaltoViewFriend"
            class="btn btn-link mt-2"
          >
            View more
          </button>
        </div>
        <div class="posts w-70">
          <h3 class="text-color">Posts of {{ page.name }}</h3>

          <div class="timeline mb-4" v-if="posts.length > 0">
            <post-card
              v-for="post in posts"
              :key="post._id"
              :post="post"
            ></post-card>
          </div>
          <div v-else class="text-center text-white">No posts available...</div>
        </div>
      </div>

      <!-- The Modal -->
      <div
        v-if="page.followers.length > 0"
        class="modal"
        id="myModaltoViewFriend"
      >
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
              <h4 class="modal-title text-center">
                All followers of {{ user.name }}
              </h4>
              <button type="button" class="close" data-dismiss="modal">
                &times;
              </button>
            </div>
            <div class="row p-2">
              <div class="col-4" v-for="friend in page.followers">
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

    <!-- The Modal to Edit Page-->
    <div class="modal list" id="myModaltoEditPage">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title text-center">Edit page</h4>
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
                :validation-schema="pageFormSchema"
              >
                <div class="mb-3 form-group">
                  <label for="name" class="form-label">Page name: </label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    class="form-control"
                    placeholder="Type your page name"
                    v-model="data.name"
                  />
                  <ErrorMessage
                    name="name"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>
                <div class="mb-3 form-group">
                  <label for="desc" class="form-label"
                    >Page description:
                  </label>
                  <Field
                    as="textarea"
                    rows="4"
                    type="text"
                    name="desc"
                    id="desc"
                    class="form-control"
                    placeholder="What's your page about?"
                    v-model="data.desc"
                  />
                  <ErrorMessage
                    name="desc"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>
                <div class="mb-4 form-group">
                  <div class="d-flex justify-content-between">
                    <label class="form-label font-weight-bold">Avatar: </label>
                    <label
                      for="avatar-page"
                      class="form-label"
                      style="cursor: pointer"
                    >
                      <a class="nav-link">Chose photo</a>
                    </label>
                    <input
                      hidden
                      type="file"
                      name="avatar-page"
                      id="avatar-page"
                      class="form-control"
                      multiple
                      accept="image/*"
                      @change="onAvatarChange"
                    />
                  </div>
                  <div class="row justify-content-center">
                    <div v-if="avatar">
                      <img
                        class="rounded-circle"
                        style="height: 150px; width: 150px; object-fit: cover"
                        :src="avatar"
                        alt="images"
                      />
                    </div>
                    <div
                      v-else
                      class="rounded-circle d-flex justify-content-center align-items-center bg-secondary"
                      style="height: 150px; width: 150px"
                    >
                      <i class="fa-solid fa-image" style="font-size: 5rem"></i>
                    </div>
                  </div>
                </div>
                <div class="mb-4 form-group">
                  <div class="d-flex justify-content-between">
                    <label class="form-label font-weight-bold"
                      >Cover image:
                    </label>
                    <label
                      for="cover-page"
                      class="form-label"
                      style="cursor: pointer"
                    >
                      <a class="nav-link">Chose photo</a>
                    </label>
                    <input
                      hidden
                      type="file"
                      name="cover-page"
                      id="cover-page"
                      class="form-control"
                      multiple
                      accept="image/*"
                      @change="onCoverChange"
                    />
                  </div>
                  <div class="row justify-content-center">
                    <div v-if="cover" class="col-10">
                      <img
                        class="rounded w-100"
                        style="height: 200px; object-fit: cover"
                        :src="cover"
                        alt="images"
                      />
                    </div>
                    <div
                      v-else
                      class="col-10 rounded w-100 d-flex justify-content-center align-items-center bg-secondary"
                      style="height: 200px"
                    >
                      <i class="fa-solid fa-image" style="font-size: 5rem"></i>
                    </div>
                  </div>
                </div>
                <div class="form-group text-center">
                  <button
                    class="btn btn-warning"
                    type="submit"
                    :disabled="loading"
                  >
                    Update
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

    <!-- The Modal -->
    <div class="modal list" id="myModaltoPost">
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
import PostCard from "@/components/PostCard.vue";
import Loader from "@/components/Loader.vue";
import ImageList from "@/components/product/ImageList.vue";

import reportService from "@/services/report.service.js";
import userService from "@/services/user.service.js";
import postService from "@/services/post.service.js";
import pageService from "@/services/page.service.js";

import { ref, onBeforeMount, provide } from "vue";
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toast-notification";
import $ from "jquery";

const $toast = useToast();
const route = useRoute();
const router = useRouter();
const user = ref({});
const page = ref(null);
const posts = ref([]);
const loader = ref(true); // Khởi tạo loader với false
const avatar = ref(null);
const cover = ref(null);
const formDataAvatar = ref(null);
const formDataCover = ref(null);
const loading = ref(false);
const data = ref({
  name: "",
  desc: "",
});
const report = ref({
  message: "",
  targetId: null,
  targetModel: "Page",
});

const formData = ref(new FormData()); // Để chứa dữ liệu ảnh khi tải lên
const images = ref([]);
const dataPost = ref({
  desc: "",
  onModel: "Page",
  posted_on: "",
});

const pageFormSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Page name is requied!")
    .min(5, "Page name must have at least 5 letters.")
    .max(100, "Page name must be less than 50 letters."),
  desc: yup
    .string()
    .trim()
    .required("Page description is requied!")
    .min(5, "Page description must have at least 5 letters.")
    .max(500, "Page description must be less than 500 letters."),
});

function onAvatarChange(e) {
  formDataAvatar.value = new FormData();
  formDataAvatar.value.append("avatar-page", e.target.files[0]);
  avatar.value = URL.createObjectURL(e.target.files[0]);
}

function onCoverChange(e) {
  formDataCover.value = new FormData();
  formDataCover.value.append("cover-page", e.target.files[0]);
  cover.value = URL.createObjectURL(e.target.files[0]);
}

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
  dataPost.value.posted_on = page.value._id;
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

async function onSubmit() {
  loading.value = true;

  const res = await pageService.updatePage(page.value._id, data.value);
  if (res.status !== "success") {
    $toast.error("Error occur! Try again later...", {
      position: "top-right",
    });
    loading.value = false;
    return;
  }

  if (formDataAvatar.value != null) {
    const resAvatar = await pageService.uploadAvatar(
      page.value._id,
      formDataAvatar.value
    );
    if (resAvatar.status !== "success") {
      $toast.error(resAvatar.message || "Error occur! Try again later...", {
        position: "top-right",
      });
    }
  }

  if (formDataCover.value != null) {
    const resCover = await pageService.uploadCover(
      page.value._id,
      formDataCover.value
    );
    if (resCover.status !== "success") {
      $toast.error(resCover.message || "Error occur! Try again later...", {
        position: "top-right",
      });
    }
  }

  $toast.success("Edit page successfully!", {
    position: "top-right",
  });
  await refresh();
  formDataAvatar.value = null;
  formDataCover.value = null;
  loading.value = false;
  $("#myModaltoEditPage").modal("hide");
}

async function loadPosts() {
  const response = await postService.getAllPagePosts(page.value._id);
  if (response.status !== "success") {
    $toast.error(res.message || "Error occur! Try again later...", {
      position: "top-right",
    });
    router.push({ name: "home-page" });
    return;
  } else {
    posts.value = response.data.posts;
  }
}

async function refresh() {
  const res = await userService.getMe();

  if (res.status !== "success") {
    $toast.error(res.message || "Error occur! Try again later...", {
      position: "top-right",
    });
    router.push({ name: "home-page" });
    return;
  } else {
    user.value = res.data.user;
  }

  const response = await pageService.getPage(route.params.id);

  if (response.status !== "success") {
    $toast.error(res.message || "Error occur! Try again later...", {
      position: "top-right",
    });
    router.push({ name: "home-page" });
    return;
  } else {
    page.value = response.data.page;
    report.value.targetId = page.value._id;
    avatar.value = page.value.avatar;
    cover.value = page.value.coverImage;
    data.value.name = page.value.name;
    data.value.desc = page.value.desc;
    loadPosts();
  }

  loader.value = false;
}

//
async function submitReport(pageId) {
  const result = await Swal.fire({
    title: "Report Page",
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
    $toast.success(`You reported ${page.value.name}`, {
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

function toggleFollower(page, currentUser) {
  const index = page.followers.findIndex(
    (follower) => follower._id === currentUser._id
  );

  if (index !== -1) {
    // Nếu đã tồn tại, loại bỏ phần tử này khỏi mảng
    page.followers.splice(index, 1);
  } else {
    // Nếu chưa tồn tại, thêm user hiện tại vào mảng
    page.followers.push({
      _id: currentUser._id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      role: currentUser.role,
    });
  }
}

async function handleFollow(pageId) {
  const response = await pageService.follow(pageId);
  if (response.status !== "success") {
    $toast.error("An error occurred! Please try again later.", {
      position: "top-right",
    });
    return;
  } else {
    toggleFollower(page.value, user.value);
  }
}

onBeforeMount(async () => {
  await refresh();
});

provide("user", user);
</script>
<style scoped>
label {
  font-weight: bold;
}
.error-feedback {
  color: red;
}
</style>
