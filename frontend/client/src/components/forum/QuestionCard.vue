<template>
  <div
    class="col-12 d-flex mb-2"
    @click="
      $router.push({
        name: 'forum-question',
        params: { questionId: question._id },
      })
    "
  >
    <div class="w-100 d-flex p-4 bg-white rounded border border-info">
      <img
        :src="question.createdBy.avatar"
        class="rounded-circle border border-info"
        style="width: 50px; height: 50px; object-fit: cover"
        alt="Avatar"
      />
      <div class="d-flex flex-column ml-4 btn-hover" style="flex: 1">
        <div class="d-flex justify-content-between">
          <p class="text-success m-0">{{ question.topic.name }}</p>
          <span
            v-show="question.isSolved"
            class="bg-success text-white p-1 rounded-lg"
          >
            <i class="fa-solid fa-circle-check"></i> Solved
          </span>
        </div>
        <p class="font-weight-bold line-min m-0" style="-webkit-line-clamp: 1">
          {{ question.title }}
        </p>
        <p class="text-secondary line-min" style="-webkit-line-clamp: 2">
          {{ question.body }}
        </p>
        <div class="d-flex justify-content-between">
          <div class="d-flex align-items-center">
            <div class="bg-secondary rounded-lg p-1 mr-2">
              By
              <span class="font-weight-bold">{{
                question.createdBy.name
              }}</span>
            </div>
            <span class="text-secondary"
              ><i class="fa-regular fa-calendar"></i>
              {{ timeAgo(question.createdAt) }}</span
            >
          </div>
          <div>
            <span class="mr-3"
              ><i class="fa-regular fa-eye"></i> {{ question.views }}</span
            >
            <span class="mr-3"
              ><i class="fa-regular fa-thumbs-up"></i>
              {{ question.likes.length }}</span
            >
            <span
              ><i class="fa-regular fa-message"></i>
              {{ question.answers.length }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps(["question"]);
const { question } = props;

function timeAgo(date) {
  const options = { month: "short", day: "numeric", year: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
}
</script>
