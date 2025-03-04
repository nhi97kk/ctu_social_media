<template>
  <!-- loader -->
  <loader v-if="loader"></loader>

  <div v-else class="container">
    <div class="w-100 my-3">
      <router-link :to="{ name: 'answer-list' }">
        <i class="fa-solid fa-arrow-left-long"></i> All Answers
      </router-link>
    </div>

    <ReportContent
      :hide="answer.hide"
      :targetId="answer._id"
      :targetModel="'Answer'"
      @restore="submitRestore"
      @hide="submitHide"
    ></ReportContent>

    <div class="p-2 border border-success rounded mb-1 position-relative">
      <div class="d-flex justify-content-between align-items-center mt-4">
        <div class="d-flex align-items-center">
          <img
            :src="answer.createdBy.avatar"
            class="rounded-circle border border-info"
            style="width: 80px; height: 80px; object-fit: cover"
            alt="Avatar"
          />
          <div class="ms-3">
            <p class="text-success font-weight-bold m-0">
              {{ answer.createdBy.name }}
            </p>
            <p class="text-secondary m-0" style="text-transform: capitalize">
              {{ answer.createdBy.role }}
            </p>
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
      <div class="d-flex justify-content-between">
        <div></div>
        <div>
          <button disabled class="btn btn-outline-dark me-3">
            <i class="fa-regular fa-thumbs-up me-2"></i>
            {{ answer.likes.length }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Loader from '@/components/partials/Loader.vue';
import ReportContent from '@/components/report/ReportContent.vue';

import answerService from '@/services/answer.service';

import { ref, onBeforeMount, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { useToast } from 'vue-toast-notification';

const $toast = useToast();
const router = useRouter();
const route = useRoute();
const loader = ref(true);
const answer = ref(null);

function timeAgo(date) {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
}

async function submitHide() {
  const result = await Swal.fire({
    title: 'Move to Trash',
    text: 'Are you sure you want to remove this answer to Trash?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });

  if (!result.isConfirmed) return;

  const response = await answerService.hideAnswer(answer.value._id);
  if (response.status === 'success') {
    $toast.success(`The answer have been moved!`, {
      position: 'top-right',
    });

    answer.value.hide = true;
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
    text: 'Are you sure you want to restore this answer?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });

  if (!result.isConfirmed) return;

  const response = await answerService.restoreAnswer(answer.value._id);
  if (response.status === 'success') {
    $toast.success(`The answer have been restored!`, {
      position: 'top-right',
    });

    answer.value.hide = false;
  } else {
    $toast.error(
      response.message || 'An error occurred! Please try again later.',
      {
        position: 'top-right',
      },
    );
  }
}

onBeforeMount(async () => {
  const response = await answerService.getAnswer(route.params.answerId);

  if (response.status === 'success') {
    answer.value = response.data.answer;
  } else {
    $toast.error(
      response.message || 'An error occurred! Please try again later.',
      {
        position: 'top-right',
      },
    );

    router.push({ name: 'answer-list' });
  }

  loader.value = false;
});
</script>
<style scoped></style>

