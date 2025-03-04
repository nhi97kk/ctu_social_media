<template>
  <main>
    <app-header v-show="store.isAuth"></app-header>
    <router-view class="main-section"></router-view>
  </main>
</template>

<script setup>
import AppHeader from "@/components/AppHeader.vue";
import { useUserStore } from "@/stores/user";
import { watch } from "vue";

const store = useUserStore();

// Theo dõi sự thay đổi của trạng thái isAuth
watch(
  () => store.isAuth,
  (isAuth) => {
    if (isAuth) {
      store.getMe(); // Gọi getMe khi người dùng đã xác thực
    }
  },
  { immediate: true } // Thực thi ngay lập tức khi component được tạo
);
</script>
