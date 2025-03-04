<template>
  <!-- loader -->
  <loader v-if="loader"></loader>

  <div v-else class="row mr-0" style="margin-top: 4rem">
    <div class="col-3">
      <div class="p-2">
        <div class="p-2 mb-2">
          <h4 class="text-color">Pages</h4>
          <div
            data-toggle="modal"
            data-target="#myModaltoSearchPage"
            class="d-flex align-items-center rounded-lg p-2 border border-info shadow"
            style="background-color: #fff"
          >
            <i class="fa-solid fa-magnifying-glass mr-2"></i>
            <input
              type="text"
              placeholder="Find a page"
              class="border-none"
              style="border: none; background-color: transparent; flex: 1"
            />
          </div>
        </div>

        <!-- Khu vực "Your feed" -->
        <div
          @click="selectPage('feed')"
          :class="[
            'rounded-lg p-2 border border-info shadow mb-2 text-white btn-hover',
            selectedPage === 'feed' ? 'bg-warning' : 'bg-secondary',
          ]"
        >
          <div class="w-100 d-flex align-items-center">
            <div class="icon-page mr-3">
              <i class="fa-solid fa-newspaper text-info"></i>
            </div>
            <span>Your feed</span>
          </div>
        </div>

        <!-- Khu vực "Liked pages" -->
        <div
          @click="selectPage('liked')"
          :class="[
            'rounded-lg p-2 border border-info shadow mb-2 text-white btn-hover',
            selectedPage === 'liked' ? 'bg-warning' : 'bg-secondary',
          ]"
        >
          <div class="w-100 d-flex align-items-center">
            <div class="icon-page mr-3">
              <i class="fa-solid fa-font-awesome text-danger"></i>
            </div>
            <span>Followed pages</span>
          </div>
        </div>

        <!-- Khu vực "Suggest pages" -->
        <div
          @click="selectPage('suggest')"
          :class="[
            'rounded-lg p-2 border border-info shadow mb-2 text-white btn-hover',
            selectedPage === 'suggest' ? 'bg-warning' : 'bg-secondary',
          ]"
        >
          <div class="w-100 d-flex align-items-center">
            <div class="icon-page mr-3">
              <i class="fa-regular fa-compass text-warning"></i>
            </div>
            <span>Suggest pages</span>
          </div>
        </div>

        <!-- Khu vực "Your pages" -->
        <div
          @click="selectPage('your')"
          :class="[
            'border border-info shadow rounded-lg p-2 mb-2 text-white btn-hover',
            selectedPage === 'your' ? 'bg-warning' : 'bg-secondary',
          ]"
        >
          <div class="w-100 d-flex align-items-center">
            <div class="icon-page mr-3">
              <i class="fa-solid fa-house-flag text-success"></i>
            </div>
            <span>Your pages</span>
          </div>
        </div>
      </div>
    </div>

    <div class="col-9 page-body rounded-lg list" style="overflow-y: scroll">
      <router-view></router-view>
    </div>

    <!-- The Modal -->
    <div class="modal" id="myModaltoSearchPage">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title text-center">Search for Pages...</h4>
            <button type="button" class="close" data-dismiss="modal">
              &times;
            </button>
          </div>

          <!-- Modal body -->
          <div class="view view-post-container smaller-margin">
            <div class="view-post p-4">
              <div class="d-flex jusitfy-content-center align-items-center">
                <input
                  type="search"
                  class="form-control ml-3"
                  placeholder="Search by page name"
                  v-model="name"
                  @keyup.enter="onSubmit"
                />

                <button class="btn btn-md btn-success ml-3" @click="onSubmit">
                  Search
                </button>
              </div>
              <hr />
              <div class="row">
                <div v-if="pages.length == 0" class="w-100 text-center py-3">
                  <span>No pages available...</span>
                </div>
                <div
                  v-else
                  v-for="page in pages"
                  :key="page._id"
                  class="col-6 p-2 d-flex"
                >
                  <div
                    class="w-100 justify-content-between d-flex flex-column align-items-center rounded-lg bg-white p-2 shadow border border-info"
                  >
                    <div>
                      <img
                        :src="page.avatar"
                        alt=""
                        style="width: 150px; height: 150px; object-fit: cover"
                        class="rounded-circle shadow border border-info"
                      />
                    </div>
                    <div
                      class="w-100 align-items-center justify-content-between d-flex flex-column"
                      style="flex: 1"
                    >
                      <h5 class="btn-hover mt-2 text-center">
                        {{ page.name }}
                      </h5>
                      <span
                        ><i
                          class="fa-solid fa-calendar-check text-primary mr-2"
                        ></i>
                        {{ page.followers.length }} Follow</span
                      >
                      <div class="actions-container mt-3">
                        <button
                          @click="
                            $('#myModaltoSearchPage').modal('hide');
                            $router.push({
                              name: 'page',
                              params: { id: page._id },
                            });
                          "
                          class="btn btn-primary w-100"
                        >
                          View More
                          <i
                            class="fa-solid fa-arrow-up-right-from-square text-white"
                          ></i>
                        </button>
                      </div>
                    </div>
                  </div>
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
import Loader from "@/components/Loader.vue";

import userService from "@/services/user.service.js";
import pageService from "@/services/page.service.js";

import { ref, onBeforeMount, provide } from "vue";
import { useRouter } from "vue-router"; // Sử dụng useRouter
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import $ from "jquery";

const $toast = useToast();
const user = ref({});
const loader = ref(true);
const pages = ref([]);
const name = ref("");
const selectedPage = ref("feed");
const router = useRouter(); // Lấy đối tượng router

// Hàm điều hướng
const selectPage = (pageName) => {
  selectedPage.value = pageName;
  if (pageName === "feed") {
    router.push({ name: "page-feed" });
  } else if (pageName === "liked") {
    router.push({ name: "page-liked" });
  } else if (pageName === "suggest") {
    router.push({ name: "page-suggest" });
  } else if (pageName === "your") {
    router.push({ name: "page-your" });
  }
};

// Hàm fetch sản phẩm theo query
async function onSubmit() {
  const filter = {};

  if (name.value.trim()) filter.name = name.value.trim();
  else return;

  // Gọi service để lấy danh sách sản phẩm
  const response = await pageService.search(filter);

  if (response.status === "success") {
    pages.value = response.data.pages;
  } else {
    pages.value = [];
  }
}

async function refresh() {
  const response = await userService.getMe();

  if (response.status !== "success") {
    $toast.error("Error occur! Try again later...", {
      position: "top-right",
    });
    router.push({ name: "home-page" });
    return;
  }

  user.value = response.data.user;
  loader.value = false;
}

onBeforeMount(async () => {
  await refresh();
});

provide("user", user);
</script>

<style scoped>
.icon-page {
  height: 45px;
  width: 45px;
  border-radius: 50%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--lighter);
}

.page-body {
  height: calc(100vh - 4rem);
  background-color: var(--accent);
}
</style>
