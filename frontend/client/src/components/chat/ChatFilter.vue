<template>
  <button
    data-toggle="modal"
    data-target="#myModaltoSearchChat"
    class="d-flex align-items-center rounded-lg p-2 border border-info shadow"
    style="background-color: #fff"
  >
    <i class="fa-solid fa-magnifying-glass mr-2"></i>
    <input
      type="text"
      placeholder="Find a chat"
      class="border-none"
      style="border: none; background-color: transparent; flex: 1"
    />
  </button>

  <!-- The Modal -->
  <div class="modal list" id="myModaltoSearchChat">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title text-center">Search for Chats...</h4>
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
                placeholder="Search by name of chat"
                v-model="name"
                @keyup.enter="onSubmit"
              />

              <button class="btn btn-md btn-success ml-3" @click="onSubmit">
                Search
              </button>
            </div>
            <hr />
            <div class="row">
              <div v-if="chats.length == 0" class="w-100 text-center py-3">
                <span>No chats available...</span>
              </div>
              <div v-else class="w-100 text-center py-3">
                <span>{{ chats.length }} results found.</span>
              </div>

              <div class="col-4 p-2" v-for="chat in chats" :key="chat._id">
                <div
                  @click="
                    $('#myModaltoSearchChat').modal('hide');
                    $router.push({
                      name: 'chat-message',
                      params: { chatId: chat._id },
                    });
                  "
                  class="btn-hover menu-item my-2 p-1 bg-white rounded border border-info shadow"
                >
                  <div v-if="chat.createdBy" class="user">
                    <div class="position-relative">
                      <img
                        :src="chat.avatar"
                        alt=""
                        style="width: 50px; height: 50px; object-fit: cover"
                        class="rounded-circle border border-warning"
                      />
                    </div>
                    <h4 class="text-dark font-weight-bold">{{ chat.name }}</h4>
                  </div>
                  <div
                    v-else
                    class="user"
                    v-for="member in chat.members"
                    :key="member._id"
                  >
                    <template v-if="member._id !== user._id">
                      <div class="position-relative">
                        <img
                          :src="member.avatar"
                          alt=""
                          style="width: 50px; height: 50px; object-fit: cover"
                          class="rounded-circle border border-info"
                        />
                      </div>
                      <h4 class="text-dark font-weight-bold">
                        {{ member.name }}
                      </h4>
                    </template>
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
import chatService from "@/services/chat.service.js";

import { ref, onBeforeMount, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import $ from "jquery";

const route = useRoute();
const router = useRouter();
const user = inject("user");
const chats = ref([]);
const name = ref("");

// Hàm fetch sản phẩm theo query
async function onSubmit() {
  const filter = {};

  if (name.value.trim()) filter.name = name.value.trim();
  else return;

  // Gọi service để lấy danh sách sản phẩm
  const response = await chatService.search(filter);

  if (response.status === "success") {
    chats.value = response.data.chats;
  } else {
    chats.value = [];
  }
}
</script>
