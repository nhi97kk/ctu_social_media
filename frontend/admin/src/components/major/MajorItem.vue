<template>
  <li class="">
    <div
      class="major-item list-group-item d-flex justify-content-between align-items-strech mt-3"
    >
      <div class="ms-2 pe-3 me-auto d-flex justify-content-between flex-column">
        <div class="email">
          <span class="fw-bold">Major Name: </span>
          {{ major.name }}
        </div>
        <div class="email">
          <span class="fw-bold">College/School: </span>
          {{ major.college }}
        </div>
      </div>

      <div class="d-flex flex-column justify-content-center">
        <router-link
          :to="{
            name: 'major-edit',
            params: { majorId: major._id },
          }"
          class="badge bg-warning rounded-pill item-edit p-2"
        >
          Edit <i class="fa-solid fa-pen-to-square"></i>
        </router-link>
      </div>
    </div>
  </li>
</template>

<script setup>
const props = defineProps(['major']);
</script>

<style scoped>
.major-item {
  background-color: #f6f6f6;
  padding: 10px;
  transition: all 0.3s;
}
.major-item:hover {
  transition: all 0.3s;
  background-color: #ccc;
}

.item-edit {
  /* font-size: 13px; */
  transition: all 0.3s;
  color: rgb(52, 52, 52);
}

.item-edit:hover {
  cursor: pointer;
  opacity: 0.6;
}
</style>

