<template>
  <div class="d-flex flex-start flex-column p-2">
    <h4 class="text-color">Suggested users</h4>
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
              <span class="text-secondary" style="text-transform: capitalize">
                {{ user.role }}
              </span>
              <span
                ><i class="fa-solid fa-book-open-reader text-success mr-2"></i>
                {{ user.major.name }}
              </span>
              <div class="d-flex align-items-center justify-content-between">
                <button
                  v-if="user.requests.includes(me._id)"
                  @click="sendRequest(user._id)"
                  class="btn btn-warning d-flex align-items-center my-1 fit-content text-white"
                >
                  <i class="fa-regular fa-clock mr-2"></i>
                  <span>Request pending</span>
                </button>
                <button
                  v-else
                  class="btn btn-info d-flex align-items-center my-1 fit-content"
                  @click="sendRequest(user._id)"
                >
                  <i class="fa-solid fa-arrow-up-right-from-square mr-2"></i>
                  <span>Send request</span>
                </button>
                <div
                  class="ml-1 btn-hover rounded-circle bg-warning d-flex justify-content-center align-items-center"
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
import { useRoute, useRouter } from "vue-router";
import userService from "@/services/user.service.js";
import chatService from "@/services/chat.service.js";

const me = inject("user");
const users = ref([]);
const route = useRoute();
const router = useRouter();

async function sendRequest(userId) {
  await userService.addFriend(userId);
  await refresh();
}

async function chat(userId) {
  const res = await chatService.create({ members: [userId, me._value._id] });
  if (res.status == "success") {
    const id = res.data.existingChat
      ? res.data.existingChat._id
      : res.data.chat._id;
    router.push({ name: "chat-message", params: { chatId: id } });
  }
}

async function refresh() {
  const response = await userService.getAllOthers();

  if (response.status === "success") {
    users.value = response.data.otherUsers;
  } else {
    users.value = [];
  }
}

onBeforeMount(async () => {
  await refresh();
});
</script>
