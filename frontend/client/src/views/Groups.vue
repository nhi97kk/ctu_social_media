<template>
  <div class="row mr-0" style="margin-top: 4rem">
    <div class="col-3">
      <div class="p-2">
        <div class="p-2 mb-2">
          <h4 class="text-color">Groups</h4>
          <div
            data-toggle="modal"
            data-target="#myModaltoSearchGroup"
            class="d-flex align-items-center rounded-lg p-2 shadow border border-info"
            style="background-color: #fff"
          >
            <i class="fa-solid fa-magnifying-glass mr-2"></i>
            <input
              type="text"
              placeholder="Find a group"
              class="border-none"
              style="border: none; background-color: transparent; flex: 1"
            />
          </div>
        </div>

        <!-- Khu vực "Your feed" -->
        <div
          @click="selectGroup('feed')"
          :class="[
            'rounded-lg shadow border border-info p-2 mb-2 text-white btn-hover',
            selectedGroup === 'feed' ? 'bg-warning' : 'bg-secondary',
          ]"
        >
          <div class="w-100 d-flex align-items-center">
            <div class="icon-group mr-3">
              <i class="fa-solid fa-newspaper text-info"></i>
            </div>
            <span>Your feed</span>
          </div>
        </div>

        <!-- Khu vực "Joined groups" -->
        <div
          @click="selectGroup('joined')"
          :class="[
            'rounded-lg shadow border border-info p-2 mb-2 text-white btn-hover',
            selectedGroup === 'joined' ? 'bg-warning' : 'bg-secondary',
          ]"
        >
          <div class="w-100 d-flex align-items-center">
            <div class="icon-group mr-3">
              <i class="fa-solid fa-users-rectangle text-danger"></i>
            </div>
            <span>Joined groups</span>
          </div>
        </div>

        <!-- Khu vực "Suggest groups" -->
        <div
          @click="selectGroup('suggest')"
          :class="[
            'rounded-lg shadow border border-info p-2 mb-2 text-white btn-hover',
            selectedGroup === 'suggest' ? 'bg-warning' : 'bg-secondary',
          ]"
        >
          <div class="w-100 d-flex align-items-center">
            <div class="icon-group mr-3">
              <i class="fa-regular fa-compass text-warning"></i>
            </div>
            <span>Suggest groups</span>
          </div>
        </div>

        <!-- Khu vực "Your groups" -->
        <div
          @click="selectGroup('your')"
          :class="[
            'rounded-lg shadow border border-info p-2 mb-2 text-white btn-hover',
            selectedGroup === 'your' ? 'bg-warning' : 'bg-secondary',
          ]"
        >
          <div class="w-100 d-flex align-items-center">
            <div class="icon-group mr-3">
              <i class="fa-solid fa-users-gear text-success"></i>
            </div>
            <span>Your groups</span>
          </div>
        </div>
      </div>
    </div>

    <div class="col-9 group-body rounded-lg list" style="overflow-y: scroll">
      <router-view></router-view>
    </div>

    <!-- The Modal -->
    <div class="modal" id="myModaltoSearchGroup">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title text-center">Search for Groups...</h4>
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
                  placeholder="Search by group name"
                  v-model="name"
                  @keyup.enter="onSubmit"
                />

                <button class="btn btn-md btn-success ml-3" @click="onSubmit">
                  Search
                </button>
              </div>
              <hr />
              <div class="row">
                <div v-if="groups.length == 0" class="w-100 text-center py-3">
                  <span>No groups available...</span>
                </div>
                <div
                  v-else
                  v-for="group in groups"
                  :key="group._id"
                  class="col-6 p-2 d-flex"
                >
                  <div
                    class="w-100 justify-content-between d-flex flex-column align-items-center rounded-lg bg-white p-2 shadow border border-info"
                  >
                    <div>
                      <img
                        :src="group.avatar"
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
                        {{ group.name }}
                      </h5>
                      <span
                        ><i
                          class="fa-solid fa-users-rectangle text-success mr-2"
                        ></i>
                        {{ group.members.length }} Member</span
                      >
                      <div class="actions-container mt-3">
                        <button
                          @click="
                            $('#myModaltoSearchGroup').modal('hide');
                            $router.push({
                              name: 'group',
                              params: { id: group._id },
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
import groupService from "@/services/group.service.js";

import { ref, onBeforeMount, provide } from "vue";
import { useRouter } from "vue-router"; // Sử dụng useRouter
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import $ from "jquery";

const $toast = useToast();
const user = ref({});
const loader = ref(true);
const selectedGroup = ref("feed");
const router = useRouter(); // Lấy đối tượng router
const groups = ref([]);
const name = ref("");

// Hàm điều hướng
const selectGroup = (groupName) => {
  selectedGroup.value = groupName;
  if (groupName === "feed") {
    router.push({ name: "group-feed" });
  } else if (groupName === "joined") {
    router.push({ name: "group-joined" });
  } else if (groupName === "suggest") {
    router.push({ name: "group-suggest" });
  } else if (groupName === "your") {
    router.push({ name: "group-your" });
  }
};

// Hàm fetch sản phẩm theo query
async function onSubmit() {
  const filter = {};

  if (name.value.trim()) filter.name = name.value.trim();
  else return;

  // Gọi service để lấy danh sách sản phẩm
  const response = await groupService.search(filter);

  if (response.status === "success") {
    groups.value = response.data.groups;
  } else {
    groups.value = [];
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
.icon-group {
  height: 45px;
  width: 45px;
  border-radius: 50%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--lighter);
}

.group-body {
  height: calc(100vh - 4rem);
  background-color: var(--accent);
}
</style>
