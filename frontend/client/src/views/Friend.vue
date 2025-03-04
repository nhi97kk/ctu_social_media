<template>
  <div>
    <div class="wrapper list" style="height: 90vh; overflow-y: scroll">
      <div class="shortcuts p-2 rounded-lg border border-info shadow">
        <div class="first-col">
          <div
            class="input-group mb-4 rounded"
            data-toggle="modal"
            data-target="#myModaltoSearch"
          >
            <input
              type="text"
              disabled
              class="form-control"
              placeholder="Search"
            />
            <div class="input-group-append">
              <button class="btn btn-success" type="submit">Go</button>
            </div>
          </div>
          <router-link :to="{ name: 'friend-friend' }">
            <div class="menu-item">
              <div class="item-row">
                <div class="icon icon-friend">
                  <i class="fa-solid fa-user-group"></i>
                </div>
                <h4>Friends</h4>
              </div>
            </div>
          </router-link>

          <router-link :to="{ name: 'friend-res' }">
            <div class="menu-item">
              <div class="item-row">
                <div class="icon icon-friend">
                  <i class="fa-solid fa-user-clock"></i>
                </div>
                <h4>Requests</h4>
              </div>
            </div>
          </router-link>

          <router-link :to="{ name: 'friend-all' }">
            <div class="menu-item">
              <div class="item-row">
                <div class="icon icon-friend">
                  <i class="fa-solid fa-user-plus"></i>
                </div>
                <h4>Add Friend</h4>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <div class="w-100 mx-4" style="">
        <router-view v-if="user"></router-view>
      </div>
    </div>

    <!-- The Modal -->
    <div class="modal" id="myModaltoSearch">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title text-center">Search for Users...</h4>
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
                  class="form-control"
                  placeholder="Search by email"
                  v-model="email"
                  @keyup.enter="onSubmit"
                />
                <input
                  type="search"
                  class="form-control ml-3"
                  placeholder="Search by name"
                  v-model="name"
                  @keyup.enter="onSubmit"
                />

                <button class="btn btn-md btn-success ml-3" @click="onSubmit">
                  Search
                </button>
              </div>
              <hr />
              <div class="row">
                <div v-if="users.length == 0" class="w-100 text-center py-3">
                  <span>No users available...</span>
                </div>
                <div
                  v-else
                  v-for="user in users"
                  :key="user._id"
                  class="col-3 p-2 d-flex"
                >
                  <div
                    class="w-100 d-flex flex-column align-items-center rounded-lg bg-white p-2 border border-info shadow"
                  >
                    <img
                      :src="user.avatar"
                      alt=""
                      class="w-100 shadow"
                      style="height: 150px; object-fit: cover"
                    />
                    <div class="d-flex align-items-center mt-2 w-100">
                      <div class="d-flex flex-column">
                        <h5
                          class="btn-hover m-0"
                          @click="
                            $('#myModaltoSearch').modal('hide');
                            $router.push({
                              name: 'profile',
                              params: { id: user._id },
                            });
                          "
                        >
                          {{ user.name }}
                          <i
                            :class="{
                              'fa-solid text-danger fa-venus':
                                user.gender === 'female',
                              'fa-solid text-danger fa-mars':
                                user.gender === 'male',
                              'fa-solid text-danger fa-genderless':
                                user.gender === 'other',
                            }"
                          ></i>
                        </h5>
                        <span
                          class="text-secondary"
                          style="text-transform: capitalize"
                        >
                          {{ user.role }}
                        </span>
                        <span
                          ><i
                            class="fa-solid fa-book-open-reader text-success mr-2"
                          ></i>
                          {{ user.major.name }}
                        </span>
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

import { ref, onBeforeMount, provide } from "vue";
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import $ from "jquery";

const $toast = useToast();
const route = useRoute();
const router = useRouter();
const user = ref(null);
const users = ref([]);
const loader = ref(true);
const email = ref("");
const name = ref("");

async function refresh() {
  const res = await userService.getMe();

  if (res.status !== "success") {
    $toast.error(res.message || "Error occurred! Please try again later...", {
      position: "top-right",
    });
    router.push({ name: "home-page" });
    return;
  } else {
    user.value = res.data.user;
    loader.value = false;
  }
}

onBeforeMount(async () => {
  await refresh();
});

// Hàm fetch sản phẩm theo query
async function onSubmit() {
  const filter = {};

  if (email.value.trim()) filter.email = email.value.trim();
  if (name.value.trim()) filter.name = name.value.trim();

  // Gọi service để lấy danh sách sản phẩm
  const response = await userService.search(filter);

  if (response.status === "success") {
    users.value = response.data.users;
  } else {
    users.value = [];
  }
}

provide("user", user);
</script>
<style>
@import "./style/friend.css";
</style>
