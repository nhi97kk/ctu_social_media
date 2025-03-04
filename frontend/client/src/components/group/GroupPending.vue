<template>
  <div class="d-flex flex-start flex-column p-2">
    <h4>Join Requests ({{ users.length }})</h4>
    <div class="row">
      <div v-if="users.length == 0" class="text-center my-3">
        No join requests available...
      </div>
      <div
        v-else
        v-for="req in users"
        :key="req._id"
        class="col-4 d-flex flex-column p-2"
      >
        <div
          class="d-flex align-items-center rounded-lg bg-white p-2 shadow border border-info"
        >
          <div>
            <img
              :src="req.avatar"
              alt=""
              style="width: 90px; height: 90px; object-fit: cover"
              class="rounded-circle shadow-lg"
            />
          </div>
          <div class="d-flex flex-column ml-4">
            <h5 class="btn-hover">{{ req.name }}</h5>
            <div class="d-flex">
              <button
                @click="
                  $router.push({ name: 'profile', params: { id: req._id } })
                "
                class="btn btn-success d-flex align-items-center fit-content mr-2"
              >
                <span>View</span>
              </button>
              <button
                @click="accept(group._id, req._id)"
                class="btn btn-success d-flex align-items-center fit-content"
              >
                <i class="fa-solid fa-check"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import groupService from "@/services/group.service.js";

import { ref, onBeforeMount, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

const $toast = useToast();
const route = useRoute();
const router = useRouter();
const user = inject("user");
const group = inject("group");
const users = ref([]);
const loading = ref(false);

async function accept(groupId, userId) {
  await groupService.accept(groupId, userId);
  await refresh();
}

async function refresh() {
  const response = await groupService.getGroupJoinRequests(group._value._id);

  if (response.status !== "success") {
    $toast.error("Error occur! Try again later...", {
      position: "top-right",
    });
    router.push({ name: "home-page" });
    return;
  }

  users.value = response.data.users;
}

onBeforeMount(async () => {
  await refresh();
});
</script>
