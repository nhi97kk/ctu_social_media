<template>
  <div class="shortcuts shortcuts-2 p-3 rounded-lg border border-info shadow">
    <div class="second-col first-col">
      <div class="menu-item">
        <h6 class="title">Your pages</h6>
      </div>

      <div v-for="page in pages" :key="page._id" class="menu-item">
        <div
          v-if="page.status == 'approved'"
          @click="
            $router.push({
              name: 'page',
              params: { id: page._id },
            })
          "
          class="item-row btn-hover"
        >
          <div class="icon border-success border">
            <img :src="page.avatar" alt="" />
          </div>
          <h4>{{ page.name }}</h4>
        </div>
      </div>
    </div>
    <div class="second-col w-100">
      <div class="online">
        <h6 class="title">contact</h6>

        <div v-for="friend in friends" :key="friend._id">
          <div
            class="btn-hover menu-item my-1 p-1 bg-white rounded shadow"
            v-if="chatStore.isUserOnline(friend._id)"
            @click="chat(friend._id)"
          >
            <div class="user">
              <div class="position-relative">
                <img
                  :src="friend.avatar"
                  alt=""
                  style="width: 50px; height: 50px; object-fit: cover"
                  class="rounded-circle border border-info"
                />
                <i
                  class="fa-solid fa-circle text-success position-absolute"
                  style="font-size: 0.8rem; top: 2px; right: 2px"
                ></i>
              </div>
              <h4 class="text-dark font-weight-bold">{{ friend.name }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import userService from "@/services/user.service.js";
import pageService from "@/services/page.service.js";
import chatService from "@/services/chat.service.js";

import { useChatStore } from "@/stores/chat.js";

import { ref, inject, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const chatStore = useChatStore();
const router = useRouter();

const friends = ref([]);
const pages = ref([]);
const user = inject("user");

async function getFriends() {
  const response = await userService.getAllFriends(user._value._id);

  if (response.status == "success") {
    friends.value = response.data.friends;
  }
}

async function getPages() {
  const response = await pageService.getAllUserPages(user._value._id);

  if (response.status == "success") {
    pages.value = response.data.pages;
  }
}

async function chat(userId) {
  const res = await chatService.create({ members: [userId, user._value._id] });
  if (res.status == "success") {
    const id = res.data.existingChat
      ? res.data.existingChat._id
      : res.data.chat._id;
    router.push({ name: "chat-message", params: { chatId: id } });
  }
}

onMounted(() => {
  getFriends();
  getPages();
});
</script>
<style scoped></style>
