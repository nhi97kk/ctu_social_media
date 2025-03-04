<template>
  <div class="d-flex flex-start flex-column p-2">
    <h4 class="text-color">Suggest groups</h4>
    <div class="row">
      <div v-if="groups.length == 0" class="text-color text-center py-3">
        <span>No groups available...</span>
      </div>
      <div v-else v-for="group in groups" :key="group._id" class="col-6 p-2">
        <div
          class="d-flex flex-column align-items-center rounded-lg bg-white p-2 shadow border border-info"
        >
          <img
            :src="group.coverImage"
            alt=""
            class="w-100 shadow border border-info"
            style="height: 200px; object-fit: cover"
          />
          <div class="d-flex align-items-center mt-2 w-100">
            <div>
              <img
                :src="group.avatar"
                alt=""
                style="width: 100px; height: 100px; object-fit: cover"
                class="rounded-circle shadow"
              />
            </div>
            <div class="d-flex flex-column ml-4">
              <h4
                class="btn-hover"
                @click="
                  $router.push({ name: 'group', params: { id: group._id } })
                "
              >
                {{ group.name }}
              </h4>
              <span
                ><i class="fa-solid fa-users-rectangle text-success mr-2"></i>
                {{ group.members.length }} Member</span
              >
              <button
                v-if="group.requests.includes(user._id)"
                @click="sendRequest(group)"
                class="btn btn-warning d-flex align-items-center my-1 fit-content"
              >
                <i class="fa-regular fa-clock mr-2"></i>
                <span>Request pending</span>
              </button>
              <button
                v-else
                class="btn btn-info d-flex align-items-center my-1 fit-content"
                @click="sendRequest(group)"
              >
                <i class="fa-solid fa-arrow-up-right-from-square mr-2"></i>
                <span>Send request</span>
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
const user = inject("user");
const groups = ref([]);
const loading = ref(false);
const route = useRoute();
const router = useRouter();

async function sendRequest(group) {
  const res = await groupService.sendRequest(group._id);
  if (res.status === "success") {
    group.requests = res.data;
  } else {
    $toast.error("An error occurred! Please try again later.", {
      position: "top-right",
    });
  }
}

async function refresh() {
  const response = await groupService.getSuggestGroups();

  if (response.status !== "success") {
    $toast.error("Error occur! Try again later...", {
      position: "top-right",
    });
    router.push({ name: "home-page" });
    return;
  }

  groups.value = response.data.groups;
}

onBeforeMount(async () => {
  await refresh();
});
</script>
