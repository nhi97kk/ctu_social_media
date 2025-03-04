<template>
  <div>
    <!-- loader -->
    <loader v-if="loader"></loader>

    <!-- content  -->
    <div v-else>
      <div class="container py-1" style="margin-top: 4rem">
        <!-- Cover Image -->
        <div class="row justify-content-center position-relative">
          <div class="col-md-10 col-12">
            <img
              :src="group.coverImage"
              alt="Cover Image"
              class="img-fluid w-100 rounded border-info border shadow"
              style="max-height: 300px; object-fit: cover"
            />
          </div>
          <router-link
            :to="
              group.owner._id === user._id
                ? { name: 'me-page' }
                : { name: 'profile', params: { id: group.owner._id } }
            "
          >
            <span
              class="bg-info text-white py-1 px-2 position-absolute rounded btn-hover"
              style="top: 5px; right: 115px"
              >Group of {{ group.owner.name }}</span
            ></router-link
          >
        </div>

        <div class="row justify-content-center">
          <div class="row col-md-9 col-12">
            <!-- Avatar -->
            <div class="col-md-3 col-12" style="height: 120px">
              <img
                :src="group.avatar"
                alt="Avatar"
                class="rounded-circle img-thumbnail position-absolute border-info border shadow"
                style="
                  bottom: 20px;
                  width: 170px;
                  height: 170px;
                  object-fit: cover;
                  border: 0.5px solid white;
                "
              />
            </div>
            <!-- Group info -->
            <div class="col-md-9 col-12 py-3">
              <div class="info-profile text-color d-flex flex-column w-75">
                <h4>
                  {{ group.name }}
                </h4>
                <span class="text-color">
                  <i class="fa-solid fa-file-lines mr-2 text-success"></i>
                  {{ group.desc }}
                </span>
                <span>
                  <i class="fa-solid fa-calendar-check text-primary mr-2"></i>
                  {{ group.members.length }} Member
                </span>
              </div>

              <button
                v-if="user._id === group.owner._id"
                data-toggle="modal"
                data-target="#myModaltoEditGroup"
                class="btn btn-warning text-white position-absolute border-white border shadow"
                style="top: 1rem; right: 0"
              >
                <span><i class="fa-solid fa-gear mr-2"></i>Edit group</span>
              </button>
              <div v-else>
                <button
                  v-if="group.members.includes(user._id)"
                  @click="leaveGroup(group._id)"
                  class="btn btn-outline-danger position-absolute border-white border shadow"
                  style="top: 1rem; right: 0"
                >
                  <span
                    ><i class="fa-solid fa-right-from-bracket mr-2"></i
                    >Leave</span
                  >
                </button>

                <button
                  v-else
                  @click="sendRequest(group._id)"
                  class="btn position-absolute text-white border-white border shadow"
                  :class="
                    group.requests.includes(user._id)
                      ? 'btn-warning'
                      : 'btn-info'
                  "
                  style="top: 1rem; right: 0"
                >
                  <i
                    class="fa-solid mr-2"
                    :class="
                      group.requests.includes(user._id)
                        ? 'fa-clock'
                        : 'fa-arrow-up-right-from-square'
                    "
                  ></i>
                  <span>{{
                    group.requests.includes(user._id)
                      ? "Request pending"
                      : "Send request"
                  }}</span>
                </button>
                <button
                  class="btn btn-outline-warning position-absolute shadow"
                  style="top: 4rem; right: 0"
                  @click="submitReport(group._id)"
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

        <div class="row mr-0">
          <div class="col-3">
            <div class="p-2">
              <div class="p-2 mb-2">
                <button
                  class="btn d-flex align-items-center rounded-lg p-2 border-info border shadow"
                  style="background-color: #fff"
                  data-toggle="modal"
                  data-target="#myModaltoSearchPostGroup"
                >
                  <i class="fa-solid fa-magnifying-glass mr-2"></i>
                  <input
                    type="text"
                    placeholder="Find in group"
                    class="border-none"
                    style="border: none; background-color: transparent; flex: 1"
                  />
                </button>
              </div>

              <!-- Khu vực "Group Discussion" -->
              <div
                @click="selectGroup('discussion')"
                :class="[
                  'rounded-lg p-2 mb-2 text-white btn-hover border-info border shadow',
                  selectedGroup === 'discussion'
                    ? 'bg-warning'
                    : 'bg-secondary',
                ]"
              >
                <div class="w-100 d-flex align-items-center">
                  <div class="icon-group mr-3">
                    <i class="fa-solid fa-newspaper text-info"></i>
                  </div>
                  <span>Group Discussion</span>
                </div>
              </div>

              <!-- Khu vực "Members List" -->
              <div
                @click="selectGroup('member')"
                :class="[
                  'rounded-lg p-2 mb-2 text-white btn-hover border-info border shadow',
                  selectedGroup === 'member' ? 'bg-warning' : 'bg-secondary',
                ]"
              >
                <div class="w-100 d-flex align-items-center">
                  <div class="icon-group mr-3">
                    <i class="fa-solid fa-users-rectangle text-danger"></i>
                  </div>
                  <span>Members List</span>
                </div>
              </div>

              <!-- Khu vực "Join Requests" -->
              <div
                v-show="user._id === group.owner._id"
                @click="selectGroup('resquest')"
                :class="[
                  'rounded-lg p-2 mb-2 text-white btn-hover border-info border shadow',
                  selectedGroup === 'resquest' ? 'bg-warning' : 'bg-secondary',
                ]"
              >
                <div class="w-100 d-flex align-items-center">
                  <div class="icon-group mr-3">
                    <i class="fa-solid fa-users-gear text-success"></i>
                  </div>
                  <span>Join Requests</span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-9 group-body rounded-lg">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>

    <!-- The Modal -->
    <div class="modal list" id="myModaltoSearchPostGroup">
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
                  @keyup.enter="onSubmitSearch"
                />

                <button
                  class="btn btn-md btn-success ml-3"
                  @click="onSubmitSearch"
                >
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
                            $('#myModaltoSearchPostGroup').modal('hide');
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

    <!-- The Modal to Edit Group -->
    <div
      v-if="!loader && user._id === group.owner._id"
      class="modal"
      id="myModaltoEditGroup"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title text-center">Edit group</h4>
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
                :validation-schema="groupFormSchema"
              >
                <div class="mb-3 form-group">
                  <label for="name" class="form-label">Group name: </label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    class="form-control"
                    placeholder="Type your group name"
                    v-model="data.name"
                  />
                  <ErrorMessage
                    name="name"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>
                <div class="mb-3 form-group">
                  <label for="desc" class="form-label"
                    >Group description:
                  </label>
                  <Field
                    as="textarea"
                    rows="4"
                    type="text"
                    name="desc"
                    id="desc"
                    class="form-control"
                    placeholder="What's your group about?"
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
                      for="avatar-group"
                      class="form-label"
                      style="cursor: pointer"
                    >
                      <a class="nav-link">Choose photo</a>
                    </label>
                    <input
                      hidden
                      type="file"
                      name="avatar-group"
                      id="avatar-group"
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
                      >Cover image:</label
                    >
                    <label
                      for="cover-group"
                      class="form-label"
                      style="cursor: pointer"
                    >
                      <a class="nav-link">Choose photo</a>
                    </label>
                    <input
                      hidden
                      type="file"
                      name="cover-group"
                      id="cover-group"
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
  </div>
</template>

<script setup>
import Loader from "@/components/Loader.vue";

import reportService from "@/services/report.service.js";
import userService from "@/services/user.service.js";
import groupService from "@/services/group.service.js"; // Change this to group service
import postService from "@/services/post.service.js";

import { ref, onBeforeMount, provide } from "vue";
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toast-notification";
import $ from "jquery";
import { formatDistanceToNow } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

const $toast = useToast();
const route = useRoute();
const router = useRouter();
const user = ref({});
const group = ref(null);
const loader = ref(true); // Initialize loader to true
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
  targetModel: "Group",
});
const selectedGroup = ref("discussion");
const posts = ref([]);
const desc = ref("");

// Hàm điều hướng
const selectGroup = (groupName) => {
  selectedGroup.value = groupName;
  if (groupName === "discussion") {
    router.push({ name: "group-discussion" });
  } else if (groupName === "member") {
    router.push({ name: "group-member" });
  } else if (groupName === "resquest") {
    router.push({ name: "group-resquest" });
  }
};

const groupFormSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Group name cannot be empty")
    .min(5, "Group name must have at least 5 characters")
    .max(100, "Group name cannot exceed 100 characters"),
  desc: yup
    .string()
    .trim()
    .required("Group description cannot be empty")
    .min(5, "Group description must have at least 5 characters")
    .max(500, "Group description cannot exceed 500 characters"),
});

function onAvatarChange(e) {
  formDataAvatar.value = new FormData();
  formDataAvatar.value.append("avatar-group", e.target.files[0]);
  avatar.value = URL.createObjectURL(e.target.files[0]);
}

function onCoverChange(e) {
  formDataCover.value = new FormData();
  formDataCover.value.append("cover-group", e.target.files[0]);
  cover.value = URL.createObjectURL(e.target.files[0]);
}

async function onSubmit() {
  loading.value = true;

  const res = await groupService.updateGroup(group.value._id, data.value); // Change to group service
  if (res.status !== "success") {
    $toast.error("Error occurred! Please try again later...", {
      position: "top-right",
    });
    loading.value = false;
    return;
  }

  if (formDataAvatar.value != null) {
    const resAvatar = await groupService.uploadAvatar(
      group.value._id,
      formDataAvatar.value
    );
    if (resAvatar.status !== "success") {
      $toast.error(
        resAvatar.message || "Error occurred! Please try again later...",
        {
          position: "top-right",
        }
      );
    }
  }

  if (formDataCover.value != null) {
    const resCover = await groupService.uploadCover(
      group.value._id,
      formDataCover.value
    );
    if (resCover.status !== "success") {
      $toast.error(
        resCover.message || "Error occurred! Please try again later...",
        {
          position: "top-right",
        }
      );
    }
  }

  $toast.success("Group edited successfully!", {
    position: "top-right",
  });
  await refresh();
  formDataAvatar.value = null;
  formDataCover.value = null;
  loading.value = false;
  $("#myModaltoEditGroup").modal("hide");
}

async function refresh() {
  const res = await userService.getMe();

  if (res.status !== "success") {
    $toast.error(res.message || "Error occurred! Please try again later...", {
      position: "top-right",
    });
    router.push({ name: "home-page" });
    return;
  } else {
    user.value = res.data.user;
  }

  const response = await groupService.getGroup(route.params.id); // Change to group service

  if (response.status !== "success") {
    $toast.error(res.message || "Error occurred! Please try again later...", {
      position: "top-right",
    });
    router.push({ name: "home-page" });
    return;
  } else {
    group.value = response.data.group; // Change to group
    report.value.targetId = group.value._id;
    avatar.value = group.value.avatar;
    cover.value = group.value.coverImage;
    data.value.name = group.value.name;
    data.value.desc = group.value.desc;
  }

  loader.value = false;
}

onBeforeMount(async () => {
  await refresh();
  selectGroup("discussion");
});

async function leaveGroup(groupId) {
  const result = await Swal.fire({
    title: "Leave Group",
    text: "Are you sure you want to leave this group?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  if (!result.isConfirmed) return;

  const res = await groupService.leave(groupId);
  if (res.status === "success") {
    group.value.members = res.data;
    $toast.success(`You have been leaved ${group.value.name}`, {
      position: "top-right",
    });
  } else {
    $toast.error("An error occurred! Please try again later.", {
      position: "top-right",
    });
  }
}

async function sendRequest(groupId) {
  const res = await groupService.sendRequest(groupId);
  if (res.status === "success") {
    group.value.requests = res.data;
  } else {
    $toast.error("An error occurred! Please try again later.", {
      position: "top-right",
    });
  }
}

// Report group
async function submitReport(groupId) {
  const result = await Swal.fire({
    title: "Report Group",
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
    $toast.success(`You reported ${group.value.name}.`, {
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

////////
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
async function onSubmitSearch() {
  const filter = {};

  if (desc.value.trim()) {
    filter.desc = desc.value.trim();
    filter.onModel = "Group";
    filter.posted_on = group.value._id;
  } else return;

  // Gọi service để lấy danh sách sản phẩm
  const response = await postService.search(filter);

  if (response.status === "success") {
    posts.value = response.data.posts;
  } else {
    posts.value = [];
  }
}

provide("user", user);
provide("group", group);
</script>

<style scoped>
label {
  font-weight: bold;
}
.error-feedback {
  color: red;
}

.icon-group {
  height: 45px;
  width: 45px;
  border-radius: 50%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--lighter);
}

.group-body {
  background-color: aliceblue;
  height: auto;
}
</style>
