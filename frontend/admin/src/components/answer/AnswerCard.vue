<template>
  <div>
    <div
      v-bind:id="!answer.hideActions ? 'answer-' + answer._id : null"
      class="p-2 border border-success rounded mb-1 position-relative"
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
      <div class="d-flex justify-content-between" v-if="!answer?.hideActions">
        <div></div>
        <div>
          <button disabled class="btn btn-outline-dark me-3">
            <i class="fa-regular fa-thumbs-up me-2"></i>
            {{ answer.likes.length }}
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
        :depth="depth + 1"
        :class="depth < 3 ? 'ms-4' : ''"
      />
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const $toast = useToast();
const props = defineProps(['answer', 'parentAnswerUserName', 'depth']);
const { answer, parentAnswerUserName } = props;

function timeAgo(date) {
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
}

function scrollToAnswer() {
  const answerElement = document.getElementById('answer-' + answer._id);
  if (answerElement) {
    answerElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    $toast.error('Could not find the answer!', { position: 'top-right' });
  }
}
</script>
