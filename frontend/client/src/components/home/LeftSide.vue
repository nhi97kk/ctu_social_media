<template>
  <div class="shortcuts p-3 rounded-lg border border-info shadow" v-if="user">
    <div class="first-col">
      <router-link :to="{ name: 'me-page' }">
        <div class="menu-item">
          <div class="user">
            <div class="profile">
              <img :src="user.avatar" alt="" />
            </div>
            <h4>{{ user?.name }}</h4>
          </div>
        </div>
      </router-link>

      <div class="menu-item" @click="$router.push('/friends')">
        <div class="item-row">
          <div class="icon">
            <i class="fa-solid fa-user-group"></i>
          </div>
          <h4>Friends</h4>
        </div>
      </div>
    </div>
    <div class="second-col">
      <h6 class="title">Your groups</h6>
      <div v-for="group in groups" :key="group._id" class="menu-item">
        <div
          v-if="group.status == 'approved'"
          class="item-row btn-hover"
          @click="
            $router.push({
              name: 'group',
              params: { id: group._id },
            })
          "
        >
          <div class="icon border border-success">
            <img :src="group.avatar" alt="" />
          </div>
          <h4>{{ group.name }}</h4>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import groupService from "@/services/group.service.js";

import { ref, inject, onMounted } from "vue";

const groups = ref([]);
const user = inject("user");

async function getGroups() {
  const response = await groupService.getAllUserGroups(user._value._id);

  if (response.status == "success") {
    groups.value = response.data.groups;
  }
}

onMounted(() => {
  getGroups();
});
</script>
<style scoped></style>
