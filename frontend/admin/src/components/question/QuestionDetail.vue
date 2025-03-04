<template>
  <!-- loader -->
  <loader v-if="loader"></loader>

  <!-- content  -->
  <div v-else>
    <div class="container">
      <div class="container my-3">
        <router-link :to="{ name: 'question-list' }">
          <i class="fa-solid fa-arrow-left-long"></i> All Questions
        </router-link>
      </div>

      <ReportContent
        :hide="question.hide"
        :targetId="question._id"
        :targetModel="'Question'"
        @restore="submitRestore"
        @hide="submitHide"
      ></ReportContent>

      <!-- present discussion -->
      <div class="border boder-info p-2 rounded mb-4">
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
            <div class="ms-3">
              <p class="text-success font-weight-bold m-0">
                {{ question.createdBy.name }}
              </p>
              <p class="text-secondary m-0" style="text-transform: capitalize">
                {{ question.createdBy.role }}
              </p>
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
          class="rounded bg-success text-white p-2 mb-3"
        >
          Solved! Go to the solution.
        </div>
        <div class="d-flex justify-content-between">
          <span class="text-secondary"
            ><i class="fa-regular fa-eye text-success"></i>
            {{ question.views }} Views</span
          >
          <div>
            <button disabled class="btn btn-outline-dark me-3">
              <i class="fa-regular fa-thumbs-up me-2"></i>
              {{ question.likes.length }}
            </button>
          </div>
        </div>
        <hr />
        <answer-content :question="question"></answer-content>
      </div>
    </div>
  </div>
</template>
<script setup>
import Loader from '@/components/partials/Loader.vue';
import AnswerContent from '@/components/answer/AnswerContent.vue';
import ReportContent from '@/components/report/ReportContent.vue';

import questionService from '@/services/question.service.js';

import { ref, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { useToast } from 'vue-toast-notification';

const $toast = useToast();
const route = useRoute();
const router = useRouter();
const question = ref(null);
const loader = ref(true);

async function submitHide() {
  const result = await Swal.fire({
    title: 'Move to Trash',
    text: 'Are you sure you want to remove this question to Trash?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });

  if (!result.isConfirmed) return;

  const response = await questionService.hideQuestion(question.value._id);
  if (response.status === 'success') {
    $toast.success(`The question have been moved!`, {
      position: 'top-right',
    });

    question.value.hide = true;
  } else {
    $toast.error(
      response.message || 'An error occurred! Please try again later.',
      {
        position: 'top-right',
      },
    );
  }
}

async function submitRestore() {
  const result = await Swal.fire({
    title: 'Restore',
    text: 'Are you sure you want to restore this question?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });

  if (!result.isConfirmed) return;

  const response = await questionService.restoreQuestion(question.value._id);
  if (response.status === 'success') {
    $toast.success(`The question have been restored!`, {
      position: 'top-right',
    });

    question.value.hide = false;
  } else {
    $toast.error(
      response.message || 'An error occurred! Please try again later.',
      {
        position: 'top-right',
      },
    );
  }
}

async function refresh() {
  const response = await questionService.getQuestion(route.params.questionId);

  if (response.status !== 'success') {
    $toast.error(res.message || 'Error occurred! Please try again later...', {
      position: 'top-right',
    });
    router.push({ name: 'question-list' });
    return;
  } else {
    question.value = response.data.question;
  }

  loader.value = false;
}

onBeforeMount(async () => {
  await refresh();
});

function timeAgo(date) {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
}
</script>

