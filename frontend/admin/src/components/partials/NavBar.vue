<template>
  <div class="bg-secondary sticky-top">
    <div class="container py-1">
      <router-link to="/" class="text-white rounded"> Dashboard </router-link>
      <router-link to="/products" class="text-white rounded">
        Market</router-link
      >
      <router-link to="/majors" class="text-white rounded"> Major </router-link>
      <router-link to="/posts" class="text-white rounded"> Post </router-link>
      <router-link to="/comments" class="text-white rounded">
        Comment
      </router-link>
      <router-link to="/pages" class="text-white rounded"> Page </router-link>
      <router-link to="/groups" class="text-white rounded"> Group </router-link>
      <router-link to="/topics" class="text-white rounded"> Topic </router-link>
      <router-link to="/questions" class="text-white rounded">
        Question
      </router-link>
      <router-link to="/answers" class="text-white rounded">
        Answer
      </router-link>
      <router-link to="/reports" class="text-white rounded">
        Report
      </router-link>

      <router-link
        to="/users"
        class="text-white rounded"
        v-show="store.role === 'admin'"
      >
        Account
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';

const store = useUserStore();
</script>

<style scoped>
a {
  text-decoration: none;
  display: inline-block;
  padding: 10px 15px;
  transition: all 0.3s;
}

a:hover {
  opacity: 0.8;
}

.router-link-active {
  background-color: #fff;
  color: #000 !important;
}

.router-link-active:hover {
  opacity: 1;
  cursor: default;
}
</style>

