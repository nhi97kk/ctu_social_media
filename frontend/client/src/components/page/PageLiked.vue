<template>
  <div class="d-flex flex-start flex-column p-2">
    <h4 class="text-color">Your followed pages</h4>
    <div class="row">
      <div v-if="pages.length == 0" class="text-color text-center py-3">
        <span>No pages available...</span>
      </div>
      <div
        v-else
        v-for="page in pages"
        :key="page._id"
        class="col-6 flex-column p-2"
      >
        <div
          class="d-flex align-items-center rounded-lg bg-white p-2 shadow border border-info"
        >
          <div>
            <img
              :src="page.avatar"
              alt=""
              style="width: 150px; height: 150px; object-fit: cover"
              class="rounded-circle shadow border border-info"
            />
          </div>
          <div class="d-flex flex-column ml-4" style="flex: 1">
            <h4 class="btn-hover">{{ page.name }}</h4>
            <span
              ><i class="fa-solid fa-calendar-check text-primary mr-2"></i>
              {{ page.followers.length }} Follow</span
            >
            <div class="d-flex">
              <button
                @click="
                  $router.push({ name: 'page', params: { id: page._id } })
                "
                class="btn btn-outline-success d-flex align-items-center my-3 fit-content mr-2"
              >
                <i class="fa-solid fa-eye mr-2"></i>
                <span>View page</span>
              </button>
              <button
                @click="handleFollow(page._id)"
                class="btn btn-outline-danger d-flex align-items-center my-3 fit-content"
              >
                <i class="fa-regular fa-thumbs-down mr-2"></i>
                <span>Unfollow</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import pageService from "@/services/page.service.js";

import { ref, onBeforeMount, inject } from "vue";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

const $toast = useToast();
const user = inject("user");
const pages = ref([]);
const loading = ref(false);

async function handleFollow(pageId) {
  await pageService.follow(pageId);
  await refresh();
}

async function refresh() {
  const response = await pageService.getFollowedPages(user._value._id);

  if (response.status !== "success") {
    $toast.error("Error occur! Try again later...", {
      position: "top-right",
    });
    router.push({ name: "home-page" });
    return;
  }

  pages.value = response.data.pages;
}

onBeforeMount(async () => {
  await refresh();
});
</script>
