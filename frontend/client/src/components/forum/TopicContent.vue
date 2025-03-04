<template>
  <div>
    <!-- navs -->
    <ul class="nav nav-tabs">
      <li class="nav-item" @click="loadQuestions('Recent')">
        <a class="nav-link" :class="{ active: currentFilter === 'Recent' }"
          >Recent</a
        >
      </li>
      <li class="nav-item" @click="loadQuestions('Unanswered')">
        <a class="nav-link" :class="{ active: currentFilter === 'Unanswered' }"
          >Unanswered</a
        >
      </li>
      <li class="nav-item" @click="loadQuestions('Unsolved')">
        <a class="nav-link" :class="{ active: currentFilter === 'Unsolved' }"
          >Unsolved</a
        >
      </li>
      <li class="nav-item" @click="loadQuestions('Solved')">
        <a class="nav-link" :class="{ active: currentFilter === 'Solved' }"
          >Solved</a
        >
      </li>
      <li class="nav-item" @click="loadQuestions('YourQuestion')">
        <a
          class="nav-link"
          :class="{ active: currentFilter === 'YourQuestion' }"
          >Your Question</a
        >
      </li>
    </ul>

    <!-- discussion content -->
    <div class="row mt-2">
      <p v-if="questions.length === 0 && !loading" class="ml-4">
        No questions available...
      </p>
      <question-card
        v-else
        v-for="question in questions"
        :question="question"
        :key="question._id"
      ></question-card>
    </div>
  </div>
</template>

<script setup>
import QuestionCard from "@/components/forum/QuestionCard.vue";
import questionService from "@/services/question.service.js";
import { ref, onMounted, inject, watch } from "vue";

const props = defineProps(["topic", "sort"]);
const { topic } = props;
const questions = ref([]);
const loading = ref(false);
const currentFilter = ref("Recent");

async function loadQuestions(filter) {
  loading.value = true;
  currentFilter.value = filter;

  const filterParams = { filter: currentFilter.value, sort: props.sort };
  const response =
    topic != null
      ? await questionService.getQuestionsByTopic(topic._id, filterParams)
      : await questionService.getAllQuestions(filterParams);

  if (response.status === "success") {
    questions.value = response.data.questions;
  } else {
    questions.value = [];
  }

  loading.value = false;
}

onMounted(() => {
  loadQuestions(currentFilter.value);
});

// Watch để theo dõi sự thay đổi của filters
watch(
  () => props.sort,
  () => {
    loadQuestions(currentFilter.value);
  },
  { immediate: true }
);
</script>
