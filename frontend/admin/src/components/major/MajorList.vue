<template>
  <div class="container page">
    <div class="row">
      <h2 class="p-3 col-6">All Majors</h2>
      <div class="col-6 d-flex justify-content-end align-items-center">
        <router-link :to="{ name: 'major-add' }" class="btn btn-success"
          >Add Major</router-link
        >
      </div>
    </div>
    <major-search @search-major="refreshMajors"></major-search>
    <ul class="list-group list-group-numbered">
      <div v-for="major in majors" :key="major._id">
        <major-item :major="major"></major-item>
      </div>
    </ul>
    <div v-if="majors.length === 0" class="text-center mt-5">
      <h3>No majors available...</h3>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import majorService from '@/services/major.service.js';
import MajorItem from '@/components/major/MajorItem.vue';
import MajorSearch from '@/components/major/MajorSearch.vue';

const route = useRoute();
const majors = ref([]);

async function refreshMajors() {
  const response =
    route.query.name !== undefined
      ? await majorService.searchMajors(route.query.name)
      : await majorService.getAllMajors();

  if (response.status === 'success') {
    majors.value = response.data.majors;
  } else {
    majors.value = [];
  }
}

onBeforeMount(async () => {
  await refreshMajors();
});
</script>

<style scoped>
.page {
  max-width: 1000px;
}
</style>

