<template>
  <div v-if="!loader" class="ChatBox-container border border-info shadow">
    <!-- Chat header -->
    <div v-if="chat.createdBy" class="d-flex justify-content-between py-1 px-4">
      <div class="d-flex align-items-center">
        <img
          :src="chat.avatar"
          alt="Group chat avatar"
          class="rounded-circle border border-warning mr-2"
          style="width: 50px; height: 50px; object-fit: cover"
        />
        <span class="font-weight-bold">{{ chat.name }}</span>
      </div>
      <button
        v-if="user._id === chat.createdBy._id"
        data-toggle="modal"
        data-target="#modalEditGroupChat"
        class="btn btn-warning"
      >
        <i class="fa-solid fa-pen-to-square"></i>
      </button>
    </div>
    <div v-else v-for="member in chat.members" :key="member._id">
      <div
        v-if="member._id !== user._id"
        class="d-flex align-items-center p-1 ml-4"
      >
        <img
          :src="member.avatar"
          alt="Group chat avatar"
          class="rounded-circle border border-info mr-2"
          style="width: 50px; height: 50px; object-fit: cover"
        />
        <div class="d-flex flex-column">
          <span class="font-weight-bold">{{ member.name }}</span>
          <span class="text-secondary" style="text-transform: capitalize">{{
            member.role
          }}</span>
        </div>
      </div>
    </div>
    <hr class="my-1" />
    <!-- Chat body -->
    <div
      class="chat-body list"
      ref="chatBody"
      style="height: 64vh; overflow-y: scroll"
    >
      <p v-if="messages.length === 0">No messages available...</p>
      <div
        v-else
        v-for="message in messages"
        :key="message._id"
        class="d-flex"
        style="gap: 0.5rem; max-width: 75%"
        :class="{ own: message.user._id === user._id }"
      >
        <img
          :src="message.user.avatar"
          class="border border-info rounded-circle"
          style="width: 40px; height: 40px; object-fit: cover"
        />
        <div
          class="d-flex flex-column"
          style="align-items: start"
          :class="{ 'message-own': message.user._id === user._id }"
        >
          <div
            style=""
            class="rounded-lg shadow p-2 mb-1 border border-secondary"
          >
            <span>{{ message.message }}</span>
          </div>

          <timeago
            class="text-dark"
            style="font-size: 12px; color: white"
            :datetime="message.createdAt"
          />
        </div>
      </div>
    </div>

    <!-- Chat sender -->
    <div class="chat-sender w-100 position-relative">
      <!-- Icon emoji -->
      <div @click="toggleEmojiPicker" class="emoji-icon btn-hover">
        <i class="fa-solid fa-smile"></i>
      </div>

      <!-- Emoji picker, chỉ hiển thị khi showEmojiPicker là true -->
      <EmojiPicker v-if="showEmojiPicker" @select="addEmoji" :native="true" />

      <input
        type="text"
        class="p-1"
        v-model="data.message"
        @keyup.enter="createMessage"
      />
      <div @click="createMessage" class="btn-hover">
        <i class="fa-solid fa-paper-plane"></i>
      </div>
    </div>

    <!-- The Modal -->
    <div v-if="chat.createdBy" class="modal" id="modalEditGroupChat">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title text-center">Edit group chat</h4>
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
                :validation-schema="groupCFormSchema"
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
                    v-model="dataGC.name"
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
                    v-if="dataGC.members.length > 0"
                    class="row border border-info rounded"
                  >
                    <h5 class="col-12">Members</h5>
                    <div
                      v-for="member in dataGC.members"
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
  <div v-else class="spinner-border text-muted"></div>
</template>

<script setup>
import userService from "@/services/user.service.js";
import chatService from "@/services/chat.service.js";
import messageService from "@/services/message.service.js";

import {
  ref,
  nextTick,
  onBeforeMount,
  watch,
  onMounted,
  defineProps,
  inject,
  defineEmits,
} from "vue";
import { useRoute } from "vue-router";
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import Swal from "sweetalert2";
import { useToast } from "vue-toast-notification";
import $ from "jquery";

const $toast = useToast();
const props = defineProps(["socket", "eventBus"]);
const { socket, eventBus } = props;
const route = useRoute();
const user = inject("user");
const messages = ref([]);
const chat = ref(null);
const data = ref({
  message: "",
  chat: "",
});
const loader = ref(true);
const avatar = ref(null);
const formDataAvatar = ref(null);
const loading = ref(false);
const dataGC = ref({
  name: "",
  members: [],
});
const friends = ref([]);
const loadFriends = ref(true);
const hide = ref(true);
const emit = defineEmits(["chat-updated"]);
const chatBody = ref(null);

const groupCFormSchema = yup.object({
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

// Hàm để cập nhật tên hoặc avatar của chat
function updateChat(id, property, value) {
  emit("chat-updated", {
    id: id, // Gửi ID của chat
    changes: {
      [property]: value, // Chỉ gửi thuộc tính đã thay đổi
    },
  });
}

async function onSubmit() {
  if (dataGC.value.members.length < 2) {
    $toast.error("Group chat must have at least 2 members.", {
      position: "top-right",
    });
    return;
  }

  loading.value = true;

  $("#modalEditGroupChat").modal("hide");
  dataGC.value.members = dataGC.value.members.map((member) => member._id);

  const res = await chatService.update(chat.value._id, dataGC.value); // Change to group service
  if (res.status !== "success") {
    $toast.error("An error occurred! Please try again later.", {
      position: "top-right",
    });
    loading.value = false;
    return;
  } else {
    updateChat(chat.value._id, "name", res.data.chat.name);
  }

  if (formDataAvatar.value != null) {
    const resAvatar = await chatService.uploadAvatar(
      chat.value._id,
      formDataAvatar.value
    );
    if (resAvatar.status !== "success") {
      $toast.error("An error occurred! Please try again later.", {
        position: "top-right",
      });
    } else {
      updateChat(chat.value._id, "avatar", resAvatar.data.chat.avatar);
    }
  }

  $toast.success("Group chat edited successfully!", {
    position: "top-right",
  });
  await refresh();
  formDataAvatar.value = null;
  loading.value = false;
}

async function getFriends() {
  hide.value = false;
  const response = await userService.getAllFriends(user._value._id);

  if (response.status !== "success") {
    $toast.error(
      response.message || "An error occurred! Please try again later.",
      {
        position: "top-right",
      }
    );

    return;
  }

  // Lọc các friends có _id khác với _id của các member trong members.value
  friends.value = response.data.friends.filter(
    (friend) =>
      !dataGC.value.members.some((member) => member._id === friend._id)
  );

  loadFriends.value = false;
}

// Thêm bạn vào members bằng ID và loại khỏi danh sách friends
const addMember = (newMem) => {
  dataGC.value.members.push(newMem);
  friends.value = friends.value.filter((friend) => friend._id !== newMem._id);
};

const removeMember = (mem) => {
  friends.value.push(mem);
  dataGC.value.members = dataGC.value.members.filter(
    (member) => member._id !== mem._id
  );
};

// Trạng thái hiển thị bảng emoji
const showEmojiPicker = ref(false);

// Hàm bật/tắt bảng emoji
function toggleEmojiPicker() {
  showEmojiPicker.value = !showEmojiPicker.value;
}

// Hàm thêm emoji vào tin nhắn
function addEmoji(emoji) {
  data.value.message += emoji.i;
}

// Scroll to the bottom of the chat when there are new messages
const scrollToBottom = () => {
  nextTick(() => {
    if (chatBody.value) {
      const chatContainer = chatBody.value;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  });
};

// Tạo tin nhắn mới
async function createMessage() {
  if (data.value.message.trim()) {
    const response = await messageService.create(data.value);
    if (response.status === "success") {
      const messageToSend = response.data.message;
      socket.emit("send-message", messageToSend);
      messages.value.push(messageToSend);
      data.value.message = ""; // Clear the input
      scrollToBottom();
    } else {
      $toast.error(
        response.message || "An error occurred! Please try again later.",
        {
          position: "top-right",
        }
      );
    }
  }
}

async function refresh() {
  loader.value = true;
  const response = await chatService.get(route.params.chatId);
  if (response.status === "success") {
    chat.value = response.data.chat;
    data.value.chat = route.params.chatId;
    dataGC.value.name = chat.value.name;
    dataGC.value.members = chat.value.members;
    avatar.value = chat.value.avatar;
    friends.value = [];

    const res = await messageService.getAllMessagesChats(route.params.chatId);
    if (res.status === "success") {
      messages.value = res.data.messages;
    }
  } else {
    $toast.error(
      response.message || "An error occurred! Please try again later.",
      {
        position: "top-right",
      }
    );
  }
  loader.value = false;
}

// Nghe tin nhắn mới từ server
function listenForMessages() {
  eventBus.on("new-message", (message) => {
    messages.value.push(message);
    scrollToBottom();
  });
}

watch(messages, () => {
  scrollToBottom();
});

// Thiết lập socket khi component được mount
onMounted(() => {
  listenForMessages(); // Nghe tin nhắn mới từ server
  scrollToBottom();
});

// Cập nhật khi chatId thay đổi
onBeforeMount(async () => {
  await refresh();
});

watch(
  () => route.params.chatId,
  async () => {
    await refresh();
  }
);
</script>

<style scoped>
.v3-emoji-picker {
  position: absolute;
  top: -310px;
  left: 10px;
  height: 300px;
}
</style>
