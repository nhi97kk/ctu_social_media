<template>
  <div v-if="loader">
    <!-- accepted answers content  -->
    <h2>Accepted Solution ({{ solutions.length }})</h2>
    <div class="my-2">
      <p v-if="solutions.length == 0" class="w-100 text-center">
        No answers available...
      </p>
      <AnswerCard
        v-else
        v-for="answer in solutions"
        :answer="answer"
        :key="answer._id"
        :parentAnswerUserName="null"
        :depth="0"
      ></AnswerCard>
    </div>

    <!-- answers content  -->
    <h2 class="mt-4">Replies ({{ countAns }})</h2>
    <div class="my-2">
      <p v-if="replies.length == 0" class="w-100 text-center">
        No answers available...
      </p>

      <AnswerCard
        v-else
        v-for="answer in replies"
        :answer="answer"
        :key="answer._id"
        :parentAnswerUserName="null"
        :depth="0"
      ></AnswerCard>
    </div>
  </div>
</template>
<script setup>
import AnswerCard from '@/components/answer/AnswerCard.vue';

import answerService from '@/services/answer.service.js';

import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  defineEmits,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import $ from 'jquery';

const $toast = useToast();
const router = useRouter();
const props = defineProps(['question']);
const { question } = props;
const solutions = ref([]);
const replies = ref([]);
const countAns = ref(0);
const loader = ref(false);

async function refresh() {
  const repliesRes = await answerService.getAnswersByQuestion(question._id);
  const solutionsRes = await answerService.getSolutions(question._id);

  if (solutionsRes.status !== 'success' || repliesRes.status !== 'success') {
    $toast.error('Error occurred when load answers!', {
      position: 'top-right',
    });
    router.push({ name: 'home-page' });
    return;
  } else {
    solutions.value = solutionsRes.data.answers;
    replies.value = repliesRes.data.answers;
    countAns.value = repliesRes.data.countAns;
  }

  loader.value = true;
}

onBeforeMount(async () => {
  await refresh();
});
</script>
