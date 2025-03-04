<template>
  <div style="flex: 1">
    <button
      class="w-100 btn d-flex align-items-center rounded-lg p-2 shadow border border-info"
      style="background-color: #fff; flex: 1"
      data-toggle="modal"
      data-target="#myModaltoSearchForum"
    >
      <i class="fa-solid fa-magnifying-glass mr-2"></i>
      <input
        type="text"
        placeholder="Search the community...."
        class="border-none"
        style="border: none; flex: 1"
      />
    </button>
  </div>

  <!-- The Modal -->
  <div class="modal" id="myModaltoSearchForum">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title text-center">Search for Questions...</h4>
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
                placeholder="Search by question title"
                v-model="title"
                @keyup.enter="onSubmit"
              />

              <button class="btn btn-md btn-success ml-3" @click="onSubmit">
                Search
              </button>
            </div>
            <hr />
            <div class="row">
              <div v-if="questions.length == 0" class="w-100 text-center py-3">
                <span>No questions available...</span>
              </div>

              <question-card
                @click="$('#myModaltoSearchForum').modal('hide')"
                v-for="question in questions"
                :question="question"
                :key="question._id"
              ></question-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import QuestionCard from "@/components/forum/QuestionCard.vue";

import questionService from "@/services/question.service.js";

import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import $ from "jquery";

const route = useRoute();
const router = useRouter();
const questions = ref([]);
const title = ref("");

// Hàm fetch sản phẩm theo query
async function onSubmit() {
  const filter = {};

  if (title.value.trim()) filter.title = title.value.trim();

  // Gọi service để lấy danh sách sản phẩm
  const response = await questionService.search(filter);

  if (response.status === "success") {
    questions.value = response.data.questions;
  } else {
    questions.value = [];
  }
}
</script>
