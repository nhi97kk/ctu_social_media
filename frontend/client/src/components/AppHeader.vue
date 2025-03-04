<template>
  <!--navbar-->
  <nav>
    <!--logo and search-->
    <div class="left-side position-absolute" style="left: 1.5rem">
      <div class="logo mr-2">
        <img src="../assets/img/icons/logo-ctu.png" alt="" />
      </div>

      <post-filter></post-filter>
    </div>

    <!--tab icons-->
    <div class="tabs">
      <!-- Tab Home -->
      <router-link to="/" custom v-slot="{ isActive, navigate }">
        <div @click="navigate" class="tab-icon">
          <div :class="['icon', isActive ? 'text-warning' : '']">
            <i class="fa-solid fa-house"></i>
          </div>
        </div>
      </router-link>

      <!-- Tab Pages -->
      <router-link to="/pages" custom v-slot="{ isActive, navigate }">
        <div @click="navigate" class="tab-icon">
          <div :class="['icon', isActive ? 'text-warning' : '']">
            <i class="fa-solid fa-flag"></i>
          </div>
        </div>
      </router-link>

      <!-- Tab Groups -->
      <router-link to="/groups" custom v-slot="{ isActive, navigate }">
        <div @click="navigate" class="tab-icon">
          <div :class="['icon', isActive ? 'text-warning' : '']">
            <i class="fa-solid fa-users"></i>
          </div>
        </div>
      </router-link>

      <!-- Tab Products -->
      <router-link to="/products" custom v-slot="{ isActive, navigate }">
        <div @click="navigate" class="tab-icon">
          <div :class="['icon', isActive ? 'text-warning' : '']">
            <i class="fa-solid fa-store"></i>
          </div>
        </div>
      </router-link>

      <!-- Tab Robot -->
      <router-link to="/chatbot" custom v-slot="{ isActive, navigate }">
        <div @click="navigate" class="tab-icon">
          <div :class="['icon', isActive ? 'text-warning' : '']">
            <i class="fa-solid fa-robot"></i>
          </div>
        </div>
      </router-link>

      <!-- Tab Forum -->
      <router-link to="/forum" custom v-slot="{ isActive, navigate }">
        <div @click="navigate" class="tab-icon">
          <div style="width: fit-content" class="icon">
            <img
              style="width: 32px; padding: 0.1rem"
              class="rounded bg-white"
              :src="isActive ? activeIcon : inactiveIcon"
              alt="Forum Icon"
            />
          </div>
        </div>
      </router-link>
    </div>

    <!--right side-->
    <div class="right-side position-absolute" style="right: 1.5rem">
      <!--icons-->
      <div class="user-icons">
        <div class="icon" @click="$router.push('/chat')">
          <img src=" ../assets/img/icons/messenger.svg" alt="" />
        </div>

        <div class="icon" @click="toggleLightMode">
          <i
            class="fa-regular"
            :class="isLightMode ? 'fa-sun text-warning' : 'fa-moon text-white'"
          ></i>
        </div>

        <div class="icon icon-logout" v-if="store.isAuth" @click="logout">
          <i class="fa-solid fa-right-from-bracket text-white"></i>
        </div>
      </div>
    </div>
  </nav>
</template>
<script setup>
import PostFilter from "./post/PostFilter.vue";

import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/user.js";
// import userService from "@/services/user.service";
import { useRouter } from "vue-router";
// import Swal from "sweetalert2";
// Sử dụng import để nạp hình ảnh
const activeIcon = new URL(
  "../assets/img/icons/forum-discussion.png",
  import.meta.url
).href;
const inactiveIcon = new URL("../assets/img/icons/forum.png", import.meta.url)
  .href;
const store = useUserStore();
const router = useRouter();
const isLightMode = ref(false);

function toggleLightMode() {
  isLightMode.value = !isLightMode.value;

  // Thêm hoặc xóa class `Light-mode` trên <body>
  document.body.classList.toggle("light-mode", isLightMode.value);

  // Lưu trạng thái vào Local Storage để duy trì sau khi tải lại trang
  localStorage.setItem("LightMode", isLightMode.value ? "enabled" : "disabled");
}

// Khởi tạo: Đọc trạng thái từ Local Storage
onMounted(() => {
  document.body.classList.add("list");
  const savedMode = localStorage.getItem("LightMode");
  if (savedMode === "enabled") {
    isLightMode.value = true;
    document.body.classList.add("light-mode");
  }
});

async function logout() {
  await store.logout();
  router.go(router.currentRoute);
}
</script>
<style scoped></style>
