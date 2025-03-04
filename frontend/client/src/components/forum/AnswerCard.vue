<template>
  <div>
    <div
      v-if="!answer.hide"
      v-bind:id="!answer.hideActions ? 'answer-' + answer._id : null"
      class="p-2 border border-success rounded-lg mb-1 position-relative"
      :class="{
        'mt-3': !parentAnswerUserName,
      }"
    >
      <span
        v-if="parentAnswerUserName"
        class="text-success position-absolute"
        style="top: 0; left: 1rem"
        ><i class="fa-solid fa-arrow-right"></i> In response to
        <span class="font-weight-bold">{{ parentAnswerUserName }}</span></span
      >
      <div class="d-flex justify-content-between align-items-center mt-4">
        <div class="d-flex align-items-center">
          <img
            :src="answer.createdBy.avatar"
            class="rounded-circle border border-info"
            style="width: 80px; height: 80px; object-fit: cover"
            alt="Avatar"
          />
          <div class="ml-3">
            <p class="text-success font-weight-bold m-0">
              {{ answer.createdBy.name }}
            </p>
            <p class="text-secondary m-0" style="text-transform: capitalize">
              {{ answer.createdBy.role }}
            </p>
            <!-- <div>
              <span class="mr-3 text-success"
                ><i class="fa-regular fa-message"></i>
                {{ answer.createdBy?.allAnswersCount ?? "0" }}</span
              >
              <span class="mr-3 text-success"
                ><i class="fa-regular fa-square-check"></i>
                {{ answer.createdBy?.allSolutionCount ?? "0" }}</span
              >
              <span class="text-success"
                ><i class="fa-regular fa-thumbs-up"></i>
                {{ answer.createdBy?.allLikedAnswers ?? "0" }}</span
              >
            </div> -->
          </div>
        </div>
        <span class="text-secondary"
          ><i class="fa-regular fa-calendar text-success"></i>
          {{ timeAgo(answer.createdAt) }}</span
        >
      </div>
      <hr />
      <div
        v-if="answer.isSolution"
        class="p-2 border my-2 rounded"
        style="background-color: #fbf7ed"
      >
        This is an accepted solution.
      </div>
      <p>
        {{ answer.content }}
      </p>
      <img v-for="img in answer.images" :src="img" alt="" class="w-75 my-2" />
      <hr />
      <div class="d-flex justify-content-between" v-if="!answer?.hideActions">
        <div>
          <button
            v-if="author && !answer.isSolution"
            class="btn btn-outline-success"
            :disabled="loading"
            @click="acceptAnswer(answer._id)"
          >
            Accept as Solution
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              v-if="loading"
            ></span>
          </button>
        </div>
        <div>
          <button
            class="btn btn-outline-dark mr-3"
            :class="{ 'text-success': answer.likes.includes(user._id) }"
            @click="handleLike"
          >
            <i class="fa-regular fa-thumbs-up mr-2"></i>
            {{ answer.likes.length }}
          </button>
          <button
            class="btn btn-outline-dark mr-3"
            data-toggle="modal"
            data-target="#myModal"
            @click="replyToAnswer"
          >
            Reply
          </button>
          <button
            v-if="user._id != answer.createdBy._id"
            @click="submitReport"
            class="btn btn-outline-dark"
          >
            Report
          </button>
        </div>
      </div>
      <button
        class="btn btn-success text-white"
        v-if="answer?.hideActions"
        @click="scrollToAnswer"
      >
        Go to the solution.
      </button>
    </div>

    <!-- Recursive replies -->
    <div v-if="answer.replies.length > 0">
      <AnswerCard
        v-for="reply in answer.replies"
        :key="reply._id"
        :answer="reply"
        :parentAnswerUserName="answer.createdBy.name"
        :emitter="emitter"
        :depth="depth + 1"
        :class="depth < 3 ? 'ml-4' : ''"
      />
    </div>
  </div>
</template>
<script setup>
import answerService from "@/services/answer.service.js";
import reportService from "@/services/report.service.js";

import { defineProps, defineEmits, watch, inject, ref } from "vue";
import { useToast } from "vue-toast-notification";
import Swal from "sweetalert2";

const $toast = useToast();
const author = inject("author");
const user = inject("user");
const props = defineProps([
  "answer",
  "parentAnswerUserName",
  "emitter",
  "depth",
]);
const { answer, parentAnswerUserName, emitter } = props;
const loading = ref(false);
const report = ref({
  message: "",
  targetId: answer._id,
  targetModel: "Answer",
});

function timeAgo(date) {
  const options = { month: "short", day: "numeric", year: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
}

function replyToAnswer() {
  emitter.emit("reply", answer._id); // Emit ID qua mitt
}

watch(
  () => answer.replies,
  () => {},
  { deep: true }
);

async function acceptAnswer(answerId) {
  loading.value = true;
  const response = await answerService.acceptAnswer(answerId);

  if (response.status !== "success") {
    $toast.error(res.message || "Error occurred! Please try again later...", {
      position: "top-right",
    });
    return;
  } else {
    answer.isSolution = true;
    emitter.emit("accept", answer);
  }

  loading.value = false;
}

async function handleLike() {
  const response = await answerService.likeAnswer(answer._id);
  if (response.status !== "success") {
    $toast.error(
      response.message || "Error occurred! Please try again later...",
      {
        position: "top-right",
      }
    );
    return;
  } else {
    answer.likes = response.data;
  }
}

function scrollToAnswer() {
  const answerElement = document.getElementById("answer-" + answer._id);
  if (answerElement) {
    answerElement.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    $toast.error("Could not find the answer!", { position: "top-right" });
  }
}

//
async function submitReport() {
  const result = await Swal.fire({
    title: "Report Answer",
    input: "textarea",
    inputLabel: "Report Details",
    inputPlaceholder: "Provide details for this report...",
    confirmButtonText: "Submit Report",
    cancelButtonText: "Cancel",
    showCancelButton: true,
    preConfirm: (inputValue) => {
      if (inputValue.trim().length === 0) {
        Swal.showValidationMessage("Report details cannot be empty.");
      } else if (inputValue.length > 500) {
        Swal.showValidationMessage(
          "Report details must be 500 characters or less."
        );
      } else {
        report.value.message = inputValue; // Gán lại chuỗi gốc nếu thỏa mãn điều kiện
      }
    },
  });

  if (!result.isConfirmed) return;

  const response = await reportService.createReport(report.value);
  if (response.status === "success") {
    $toast.success(`You reported the answer of ${answer.createdBy.name}`, {
      position: "top-right",
    });
  } else {
    $toast.error(
      response.message || "An error occurred! Please try again later.",
      {
        position: "top-right",
      }
    );
  }
}
</script>
