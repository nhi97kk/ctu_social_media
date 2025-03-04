<template>
  <!-- loader -->
  <loader v-if="loader"></loader>

  <!-- content  -->
  <div v-else>
    <div class="container py-2" style="margin-top: 4rem">
      <!-- present discussion -->
      <div class="bg-white p-2 rounded mb-2 shadow border border-secondary">
        <ul class="breadcrumb">
          <li class="breadcrumb-item">
            <a href="#" @click="$router.push({ name: 'forum' })"
              >Discussion Academic</a
            >
          </li>
          <li class="breadcrumb-item">
            <a
              href="#"
              @click="
                $router.push({
                  name: 'forum-topic',
                  params: { topicId: question.topic._id },
                })
              "
              >{{ question.topic.name }}</a
            >
          </li>
          <li class="breadcrumb-item active">{{ question.title }}</li>
        </ul>

        <h3 class="mb-3">{{ question.title }}</h3>

        <!-- question content  -->
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <img
              :src="question.createdBy.avatar"
              class="rounded-circle border border-info"
              style="width: 80px; height: 80px; object-fit: cover"
              alt="Avatar"
            />
            <div class="ml-3">
              <p class="text-success font-weight-bold m-0">
                {{ question.createdBy.name }}
              </p>
              <p class="text-secondary m-0" style="text-transform: capitalize">
                {{ question.createdBy.role }}
              </p>
              <!-- <div>
                <span class="mr-3 text-success"
                  ><i class="fa-regular fa-message"></i>
                  {{ question.createdBy?.allAnswersCount ?? "0" }}</span
                >
                <span class="mr-3 text-success"
                  ><i class="fa-regular fa-square-check"></i>
                  {{ question.createdBy?.allSolutionCount ?? "0" }}</span
                >
                <span class="text-success"
                  ><i class="fa-regular fa-thumbs-up"></i>
                  {{ question.createdBy?.allLikedAnswers ?? "0" }}</span
                >
              </div> -->
            </div>
          </div>
          <span class="text-secondary"
            ><i class="fa-regular fa-calendar text-success"></i>
            {{ timeAgo(question.createdAt) }}</span
          >
        </div>
        <br />
        <p>
          {{ question.body }}
        </p>
        <img
          v-for="img in question.images"
          :src="img"
          alt=""
          class="w-75 my-2"
        />
        <hr />
        <div
          v-if="question.isSolved"
          class="rounded-lg bg-success text-white p-2 mb-3 btn-hover"
        >
          Solved! Go to the solution.
        </div>
        <div class="d-flex justify-content-between">
          <span class="text-secondary"
            ><i class="fa-regular fa-eye text-success"></i>
            {{ question.views }} Views</span
          >
          <div>
            <button
              class="btn btn-outline-dark mr-3"
              :class="{ 'text-success': question.likes.includes(user._id) }"
              @click="handleLike"
            >
              <i class="fa-regular fa-thumbs-up mr-2"></i>
              {{ question.likes.length }}
            </button>
            <button
              data-toggle="modal"
              data-target="#myModal"
              class="btn btn-outline-dark mr-3"
            >
              Reply
            </button>
            <button
              v-if="!author"
              @click="submitReport"
              class="btn btn-outline-dark"
            >
              Report
            </button>
          </div>
        </div>
        <hr />
        <answer-content
          :question="question"
          @accept="updateIsSolve"
        ></answer-content>
      </div>
    </div>
  </div>
</template>
<script setup>
import Loader from "@/components/Loader.vue";
import AnswerContent from "@/components/forum/AnswerContent.vue";

import userService from "@/services/user.service.js";
import reportService from "@/services/report.service.js";
import questionService from "@/services/question.service.js";

import { ref, onBeforeMount, provide } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toast-notification";

const $toast = useToast();
const route = useRoute();
const router = useRouter();
const user = ref({});
const author = ref(false);
const question = ref(null);
const loader = ref(true);
const report = ref({
  message: "",
  targetId: null,
  targetModel: "Question",
});

async function handleLike() {
  const response = await questionService.likeQuestion(route.params.questionId);
  if (response.status !== "success") {
    $toast.error(
      response.message || "Error occurred! Please try again later...",
      {
        position: "top-right",
      }
    );
    return;
  } else {
    question.value.likes = response.data;
  }
}

async function refresh() {
  const res = await userService.getMe();
  const response = await questionService.getQuestion(route.params.questionId);

  if (res.status !== "success" || response.status !== "success") {
    $toast.error(res.message || "Error occurred! Please try again later...", {
      position: "top-right",
    });
    router.push({ name: "home-page" });
    return;
  } else {
    user.value = res.data.user;
    question.value = response.data.question;
    report.value.targetId = question.value._id;
    author.value = user.value._id === question.value.createdBy._id;
  }

  loader.value = false;
}

onBeforeMount(async () => {
  await refresh();
});

function timeAgo(date) {
  const options = { month: "short", day: "numeric", year: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
}

function updateIsSolve() {
  question.value.isSolved = true;
}

//
async function submitReport() {
  const result = await Swal.fire({
    title: "Report Question",
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
    $toast.success(
      `You reported the question of ${question.value.createdBy.name}`,
      {
        position: "top-right",
      }
    );
  } else {
    $toast.error(
      response.message || "An error occurred! Please try again later.",
      {
        position: "top-right",
      }
    );
  }
}

provide("user", user);
provide("author", author);
</script>
