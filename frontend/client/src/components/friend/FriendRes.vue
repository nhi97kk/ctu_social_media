<template>
  <div class="d-flex flex-start flex-column p-2">
    <h4 class="text-color">Users who sent requests</h4>
    <div class="row">
      <div v-if="users.length == 0" class="text-center py-3">
        <span class="text-color">No users available...</span>
      </div>
      <div v-else v-for="user in users" :key="user._id" class="col-3 p-2">
        <div
          class="d-flex flex-column align-items-center rounded-lg bg-white p-2 border border-info shadow"
        >
          <img
            :src="user.avatar"
            alt=""
            class="w-100 shadow"
            style="height: 200px; object-fit: cover"
          />
          <div class="d-flex align-items-center mt-2 w-100">
            <div class="d-flex flex-column">
              <h5
                class="btn-hover m-0"
                @click="
                  $router.push({ name: 'profile', params: { id: user._id } })
                "
              >
                {{ user.name }}
                <i
                  :class="{
                    'fa-solid text-danger fa-venus': user.gender === 'female',
                    'fa-solid text-danger fa-mars': user.gender === 'male',
                    'fa-solid text-danger fa-genderless':
                      user.gender === 'other',
                  }"
                ></i>
              </h5>
              <span class="text-secondary">
                {{ user.role }}
              </span>
              <span
                ><i class="fa-solid fa-book-open-reader text-success mr-2"></i>
                {{ user.major.name }}
              </span>
              <div class="d-flex align-items-center justify-content-between">
                <button
                  class="btn btn-success d-flex align-items-center my-1 fit-content"
                  @click="confirm(user._id)"
                >
                  <i class="fa-solid fa-check mr-2"></i>
                  <span>Confirm</span>
                </button>
                <div
                  class="ml-3 btn-hover rounded-circle bg-warning d-flex justify-content-center align-items-center"
                  style="width: 40px; height: 40px"
                  @click="chat(user._id)"
                >
                  <img
                    class="rounded-circle"
                    style="object-fit: cover; width: 60%"
                    src="../../assets/img/icons/messenger.svg"
                    alt=""
                  />
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
import { ref, onBeforeMount, inject } from "vue";
import { useRouter } from "vue-router";

import userService from "@/services/user.service.js";
import chatService from "@/services/chat.service.js";

const router = useRouter();
const me = inject("user");
const users = ref([]);

async function chat(userId) {
  const res = await chatService.create({ members: [userId, me._value._id] });
  if (res.status == "success") {
    const id = res.data.existingChat
      ? res.data.existingChat._id
      : res.data.chat._id;
    router.push({ name: "chat-message", params: { chatId: id } });
  }
}

async function confirm(userId) {
  await userService.acceptRequest(userId);
  await refresh();
}

async function refresh() {
  const response = await userService.getAllRequests();

  if (response.status === "success") {
    users.value = response.data.requests;
  } else {
    users.value = [];
  }
}

onBeforeMount(async () => {
  await refresh();
});
</script>
