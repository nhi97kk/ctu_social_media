<template>
  <div>
    <div class="wrapper" style="min-height: 90vh">
      <div
        class="shortcuts w-25 mr-3 p-3 rounded-lg border border-secondary shadow"
      >
        <div class="first-col w-75">
          <h4 class="text-color">Chats</h4>
          <div
            data-toggle="modal"
            data-target="#modalCreateGroupChat"
            class="d-flex justify-content-center align-items-center p-2 rounded-lg bg-success text-white my-2 btn-hover border border-white shadow"
            style="width: fit-content"
          >
            <i class="fa-solid fa-plus mr-2"></i>
            <span>Create a group chat</span>
          </div>

          <ChatFilter></ChatFilter>
          <div
            class="menu-item my-2 p-1 bg-white rounded border border-info shadow"
            v-for="chat in chats"
            :key="chat._id"
          >
            <router-link
              :to="{ name: 'chat-message', params: { chatId: chat._id } }"
            >
              <div v-if="chat.createdBy" class="user">
                <div class="position-relative">
                  <img
                    :src="chat.avatar"
                    alt=""
                    style="width: 50px; height: 50px; object-fit: cover"
                    class="rounded-circle border border-warning"
                  />
                </div>
                <h4 class="text-dark font-weight-bold">{{ chat.name }}</h4>
              </div>
              <div
                v-else
                class="user"
                v-for="member in chat.members"
                :key="member._id"
              >
                <template v-if="member._id !== user._id">
                  <div class="position-relative">
                    <img
                      :src="member.avatar"
                      alt=""
                      style="width: 50px; height: 50px; object-fit: cover"
                      class="rounded-circle border border-info"
                    />
                    <i
                      v-if="chatStore.isUserOnline(member._id)"
                      class="fa-solid fa-circle text-success position-absolute"
                      style="font-size: 0.8rem; top: 2px; right: 2px"
                    ></i>
                  </div>
                  <h4 class="text-dark font-weight-bold">{{ member.name }}</h4>
                </template>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <router-view
        v-if="chatStore.socket"
        :socket="chatStore.socket"
        :eventBus="eventBus"
        @chat-updated="onChatUpdated"
      ></router-view>
    </div>

    <!-- The Modal -->
    <div class="modal" id="modalCreateGroupChat">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title text-center">Create group chat</h4>
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
                  <label for="name" class="form-label font-weight-bold"
                    >Name:
                  </label>
                  <Field
                    type="text"
                    name="name"
                    id="name"
                    class="form-control"
                    placeholder="Type your group chat name"
                    v-model="data.name"
                  />
                  <ErrorMessage
                    name="name"
                    class="error-feedback"
                  ></ErrorMessage>
                </div>
                <div class="mb-4 form-group">
                  <div class="d-flex justify-content-between">
                    <label class="form-label font-weight-bold">Avatar: </label>
                    <label
                      for="avatar-group-chat"
                      class="form-label"
                      style="cursor: pointer"
                    >
                      <a class="nav-link">Chose photo</a>
                    </label>
                    <input
                      hidden
                      type="file"
                      name="avatar-group-chat"
                      id="avatar-group-chat"
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
                      <span
                        v-if="member._id != user._id"
                        class="remove-icon"
                        @click="removeMember(member)"
                      >
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
  </div>
</template>

<script setup>
import ChatFilter from "@/components/chat/ChatFilter.vue";

import userService from "@/services/user.service.js";
import chatService from "@/services/chat.service.js";

import { useChatStore } from "@/stores/chat.js";

import { ref, onBeforeMount, onMounted, provide, onBeforeUnmount } from "vue";
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import $ from "jquery";
import { useRouter } from "vue-router";
import mitt from "mitt";

// Tạo event bus
const eventBus = mitt();
const $toast = useToast();
const router = useRouter();
const user = ref({});
const chats = ref([]);
const chatStore = useChatStore(); // Lấy socket từ Pinia store
const avatar = ref(null);
const formDataAvatar = ref(null);
const loading = ref(false);
const data = ref({
  name: "",
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
});

function onAvatarChange(e) {
  formDataAvatar.value = new FormData();
  formDataAvatar.value.append("avatar-group-chat", e.target.files[0]);
  avatar.value = URL.createObjectURL(e.target.files[0]);
}

// Hàm xử lý sự kiện chat-updated để cập nhật chat trong danh sách
function onChatUpdated({ id, changes }) {
  const chat = chats.value.find((chat) => chat._id === id);
  if (chat) {
    Object.assign(chat, changes); // Cập nhật chat với các thay đổi từ `changes`
  }
}

async function onSubmit() {
  if (formDataAvatar.value === null) {
    $toast.error("You must upload avatar image for your group chat!", {
      position: "top-right",
    });
    return;
  }

  if (data.value.members.length < 2) {
    $toast.error("Group chat must have at least 2 members.", {
      position: "top-right",
    });
    return;
  }

  const result = await Swal.fire({
    title: "Confirmation",
    text: "Are you sure you want to add this group chat?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;
  loading.value = true;

  data.value.members = data.value.members.map((member) => member._id);

  const res = await chatService.createGroupChat(data.value);
  if (res.status !== "success") {
    $toast.error("An error occurred! Please try again later.", {
      position: "top-right",
    });
    loading.value = false;
    return;
  } else {
    const resAvatar = await chatService.uploadAvatar(
      res.data.chat._id,
      formDataAvatar.value
    );

    if (resAvatar.status === "success") {
      $toast.success("Create group chat successfully!", {
        position: "top-right",
      });

      $("#modalCreateGroupChat").modal("hide");
      await refreshUsers();
      formDataAvatar.value = null;
      avatar.value = null;
      loading.value = false;
    }
  }
}

async function getFriends() {
  hide.value = false;
  const filter = {};

  if (name.value.trim()) filter.name = name.value.trim();
  const response = await userService.getAllFriends(user.value._id, filter);

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

// Fetch user and chat data
async function refreshUsers() {
  try {
    const response = await userService.getMe();
    if (response.status !== "success") {
      throw new Error(
        response.message || "An error occurred, please try again later."
      );
    }

    const res = await chatService.getAllUserChats(response.data.user._id);
    user.value = response.data.user;
    chats.value = res.data.chats;
    data.value.members = [
      {
        _id: user.value._id,
        name: "You",
        avatar: user.value.avatar,
        role: user.value.role,
      },
    ];
  } catch (error) {
    await Swal.fire({
      icon: "error",
      title: "Failed",
      text: error.message,
    });
    router.push({ name: "home-page" });
  }
}

// Fetch data before component mounts
onBeforeMount(refreshUsers);

onMounted(() => {
  chatStore.socket.on("receive-message", (message) => {
    eventBus.emit("new-message", message);
  });
});

provide("user", user);
</script>

<style>
@import "./style/chat.css";
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
