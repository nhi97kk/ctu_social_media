<template>
  <div
    class="col-3 d-flex mb-4"
    @click="
      $router.push({ name: 'forum-topic', params: { topicId: topic._id } })
    "
  >
    <div
      class="shadow border border-info d-flex flex-column bg-white rounded-lg btn-hover justify-content-between p-3 w-100"
    >
      <div>
        <h2 class="text-info"><i class="fa-regular fa-message"></i></h2>
        <h4 class="line-min text-info" style="-webkit-line-clamp: 2">
          {{ topic.name }}
        </h4>
        <p class="line-min text-secondary" style="-webkit-line-clamp: 3">
          {{ topic.desc }}
        </p>
      </div>
      <div class="d-flex justify-content-between">
        <span
          ><i class="fa-regular fa-message"></i>
          {{ topic.questions.length }}</span
        >
        <span
          ><i class="fa-regular fa-clock"></i>
          {{ timeAgo(topic.createdAt) }}</span
        >
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps(["topic"]);
const { topic } = props;

function timeAgo(date) {
  const options = { month: "short", day: "numeric", year: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
}
</script>
