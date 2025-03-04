<template>
  <div class="d-flex flex-start flex-column p-2">
    <div
      data-toggle="modal"
      data-target="#myModaltoCreateGroup"
      class="d-flex justify-content-center align-items-center p-2 rounded-lg bg-success text-white my-4 btn-hover shadow border border-white"
      style="width: fit-content"
    >
      <i class="fa-solid fa-plus mr-2"></i>
      <span>Create a group</span>
    </div>
    <h4 class="text-color">Your groups</h4>
    <div class="row">
      <div v-if="groups.length == 0" class="text-color text-center py-3">
        <span>You not have any page.</span>
      </div>
      <div
        v-else
        v-for="group in groups"
        :key="group._id"
        class="col-6 d-flex flex-column mb-2"
      >
        <div
          class="d-flex align-items-center rounded-lg bg-white p-2 shadow border border-info"
        >
          <div>
            <img
              :src="group.avatar"
              alt=""
              style="width: 150px; height: 150px; object-fit: cover"
              class="rounded-circle shadow border border-info"
            />
          </div>
          <div class="d-flex flex-column ml-4">
            <h4 class="btn-hover">{{ group.name }}</h4>
            <span
              ><i class="fa-solid fa-users-rectangle text-success mr-2"></i>
              {{ group.members.length }} Member</span
            >
            <span
              ><i class="fa-solid fa-user-clock text-danger mr-2"></i>
              {{ group.requests.length }} Request</span
            >
            <div class="d-flex">
              <button
                v-if="group.status === 'approved'"
                @click="
                  $router.push({ name: 'group', params: { id: group._id } })
                "
                class="btn btn-info d-flex align-items-center my-3 fit-content mr-3"
              >
                <i class="fa-solid fa-gear text-warning mr-2"></i>
                <span>Go to Group</span>
              </button>
              <span
                v-else
                class="p-2 rounded-lg text-white my-3 mr-2"
                :class="group.status === 'pending' ? 'bg-danger' : 'bg-warning'"
                >{{ group.status }}</span
              >

              <button
                @click="submitDelete(group._id)"
                class="btn btn-outline-danger d-flex align-items-center my-3 fit-content"
              >
                <i class="fa-solid fa-trash mr-2"></i>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- The Modal -->
  <div class="modal" id="myModaltoCreateGroup">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title text-center">Create group</h4>
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
                <ErrorMessage name="name" class="error-feedback"></ErrorMessage>
              </div>
              <div class="mb-3 form-group">
                <label for="desc" class="form-label">Group description: </label>
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
                <ErrorMessage name="desc" class="error-feedback"></ErrorMessage>
              </div>
              <div class="mb-4 form-group">
                <div class="d-flex justify-content-between">
                  <label class="form-label font-weight-bold">Avatar: </label>
                  <label
                    for="avatar-group"
                    class="form-label"
                    style="cursor: pointer"
                  >
                    <a class="nav-link">Chose photo</a>
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
                    >Cover image:
                  </label>
                  <label
                    for="cover-group"
                    class="form-label"
                    style="cursor: pointer"
                  >
                    <a class="nav-link">Chose photo</a>
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
              <div class="mb-4 form-group">
                <div class="d-flex justify-content-between">
                  <label class="form-label font-weight-bold">Members: </label>
                  <label
                    class="form-label"
                    style="cursor: pointer"
                    @click="getFriends()"
                  >
                    <a class="nav-link">Chose from friends</a>
                  </label>
                </div>
                <div class="w-100 mb-2" v-if="!hide">
                  <div
                    v-if="friends.length > 0"
                    class="row border border-info rounded"
                  >
                    <h5 class="col-12">Friends</h5>
                    <div
                      class="col-12 w-100 d-flex jusitfy-content-center align-items-center"
                    >
                      <input
                        type="search"
                        class="form-control ml-3"
                        placeholder="Search by name"
                        v-model="name"
                        @keyup.enter="getFriends()"
                      />

                      <button
                        class="btn btn-md btn-success ml-3"
                        @click="getFriends()"
                      >
                        Search
                      </button>
                    </div>
                    <div
                      v-for="friend in friends"
                      :key="friend._id"
                      @click="addMember(friend)"
                      class="d-flex flex-column align-items-center p-1 m-2 border border-success rounded col-2 bg btn-hover"
                    >
                      <img
                        :src="friend.avatar"
                        alt=""
                        class="rounded-circle border border-success"
                        style="width: 80px; height: 80px; object-fit: cover"
                      />
                      <span class="font-weight-bold">{{ friend.name }}</span>
                      <span
                        class="text-secondary"
                        style="text-transform: capitalize"
                        >{{ friend.role }}</span
                      >
                    </div>
                  </div>
                </div>
                <div
                  v-if="data.members.length > 0"
                  class="row border border-info rounded"
                >
                  <h5 class="col-12">Members</h5>
                  <div
                    v-for="member in data.members"
                    :key="member._id"
                    class="d-flex flex-column align-items-center p-1 m-2 border border-success rounded col-2 bg btn-hover position-relative"
                  >
                    <img
                      :src="member.avatar"
                      alt=""
                      class="rounded-circle border border-success"
                      style="width: 80px; height: 80px; object-fit: cover"
                    />
                    <span class="font-weight-bold">{{ member.name }}</span>
                    <span
                      class="text-secondary"
                      style="text-transform: capitalize"
                      >{{ member.role }}</span
                    >
                    <span class="remove-icon" @click="removeMember(member)">
                      <i
                        class="fa-solid fa-xmark p-1 rounded-circle border border-danger"
                      ></i>
                    </span>
                  </div>
                </div>
              </div>
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
import groupService from "@/services/group.service.js";
import userService from "@/services/user.service.js";

import { ref, onBeforeMount, computed, inject } from "vue";
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import $ from "jquery";

const $toast = useToast();
const user = inject("user");
const groups = ref([]);
const avatar = ref(null);
const cover = ref(null);
const formDataAvatar = ref(null);
const formDataCover = ref(null);
const loading = ref(false);
const data = ref({
  name: "",
  desc: "",
  members: [],
});
const friends = ref([]);
const loadFriends = ref(true);
const hide = ref(true);
const name = ref("");

const groupFormSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Group name is requied!")
    .min(5, "Group name must have at least 5 letters.")
    .max(50, "Group name must be less than 50 letters."),
  desc: yup
    .string()
    .trim()
    .required("Group description is requied!")
    .min(5, "Group description must have at least 5 letters.")
    .max(100, "Group description must be less than 100 letters."),
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
  if (formDataAvatar.value === null || formDataCover === null) {
    $toast.error(
      "You must upload both avatar and cover image for your group!",
      {
        position: "top-right",
      }
    );
    loading.value = false;
    return;
  }

  const result = await Swal.fire({
    title: "Confirmation",
    text: "Are you sure you want to add this group?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;
  loading.value = true;

  data.value.members = data.value.members.map((member) => member._id);
  const res = await groupService.createGroup(data.value);
  if (res.status !== "success") {
    $toast.error("An error occurred! Please try again later.", {
      position: "top-right",
    });
    loading.value = false;
    return;
  } else {
    const resAvatar = await groupService.uploadAvatar(
      res.data.group._id,
      formDataAvatar.value
    );

    const resCover = await groupService.uploadCover(
      res.data.group._id,
      formDataCover.value
    );

    if (resAvatar.status === "success" && resCover.status === "success") {
      $toast.success("Create group successfully!", {
        position: "top-right",
      });

      await refresh();
      formDataAvatar.value = null;
      formDataCover.value = null;
      avatar.value = null;
      cover.value = null;
      data.value.members = [];
      loading.value = false;
      $("#myModaltoCreateGroup").modal("hide");
    }
  }
}

async function getFriends() {
  hide.value = false;

  const filter = {};

  if (name.value.trim()) filter.name = name.value.trim();
  const response = await userService.getAllFriends(user._value._id, filter);

  if (response.status !== "success") {
    $toast.error(
      response.message || "An error occurred! Please try again later.",
      {
        position: "top-right",
      }
    );

    return;
  }

  friends.value = response.data.friends;
  loadFriends.value = false;
}

// Thêm bạn vào members bằng ID và loại khỏi danh sách friends
const addMember = (newMem) => {
  if (data.value.members.some((members) => members._id == newMem._id)) return;
  data.value.members.push(newMem);
  friends.value = friends.value.filter((friend) => friend._id !== newMem._id);
};

const removeMember = (mem) => {
  data.value.members = data.value.members.filter(
    (member) => member._id !== mem._id
  );
  if (friends.value.some((friend) => friend._id == mem._id)) return;
  friends.value.push(mem);
};

async function refresh() {
  const response = await groupService.getAllUserGroups(user._value._id);

  if (response.status !== "success") {
    $toast.error("An error occurred! Please try again later.", {
      position: "top-right",
    });
    router.push({ name: "home-page" });
    return;
  }

  groups.value = response.data.groups;
}

async function submitDelete(groupId) {
  const result = await Swal.fire({
    title: "Delete Group",
    text: "Are you sure you want to delete this group?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  if (!result.isConfirmed) return;

  const response = await groupService.deleteGroup(groupId);
  if (response.status === "success") {
    $toast.success(`Group have been deleted!`, {
      position: "top-right",
    });
    await refresh();
  } else {
    $toast.error(response.message || "An error occurred! Try again later.", {
      position: "top-right",
    });
  }
}

onBeforeMount(async () => {
  await refresh();
});
</script>
<style scoped>
label {
  font-weight: bold;
}
.error-feedback {
  color: red;
}

.remove-icon {
  position: absolute;
  top: 2px;
  right: 2px;
  color: #ccc;
  background-color: inherit;
  transition: all 0.3s;
  cursor: pointer;
}

.remove-icon:hover {
  color: red;
}
</style>
