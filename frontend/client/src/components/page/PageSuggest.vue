<template>
  <div class="d-flex flex-start flex-column p-2">
    <h4 class="text-color">Suggest pages</h4>
    <div class="row">
      <div v-if="pages.length == 0" class="text-color text-center py-3">
        <span>Not have any page other...</span>
      </div>
      <div
        v-else
        v-for="page in pages"
        :key="page._id"
        class="col-6 p-2 d-flex"
      >
        <div
          class="w-100 d-flex flex-column align-items-center rounded-lg bg-white p-2 shadow border border-info"
        >
          <img
            :src="page.coverImage"
            alt=""
            class="w-100"
            style="height: 200px; object-fit: cover"
          />
          <div class="d-flex align-items-center mt-2 w-100">
            <div>
              <img
                :src="page.avatar"
                alt=""
                style="width: 100px; height: 100px; object-fit: cover"
                class="rounded-circle shadow border border-info"
              />
            </div>
            <div class="d-flex flex-column ml-4">
              <h4
                class="btn-hover"
                @click="
                  $router.push({ name: 'page', params: { id: page._id } })
                "
              >
                {{ page.name }}
              </h4>
              <span
                ><i class="fa-solid fa-calendar-check text-primary mr-2"></i>
                {{ page.followers.length }} Follow</span
              >
              <button
                @click="handleFollow(page._id)"
                class="btn btn-info d-flex align-items-center my-1 fit-content"
              >
                <i class="fa-solid fa-thumbs-up mr-2"></i>
                <span>Follow page</span>
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
  const response = await pageService.getSuggestPages(user._value._id);

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
