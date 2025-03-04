<template>
  <div class="posts w-75 mb-3" v-if="posts.length > 0">
    <PostCard v-for="post in posts" :post="post" :key="post._id" />
  </div>
  <div v-else class="text-center mt-4">No posts available...</div>
</template>

<script setup>
import PostCard from "@/components/PostCard.vue";
import Loader from "@/components/Loader.vue";

import postService from "@/services/post.service";

import { ref, onBeforeMount, computed, provide } from "vue";
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import $ from "jquery";

const $toast = useToast();
const posts = ref([]);
const router = useRouter();
const loading = ref(false);
const loader = ref(true);

async function refresh() {
  const res = await postService.getAllGroupsPosts();

  posts.value = res.data.posts;
  loader.value = false;
}

onBeforeMount(async () => {
  await refresh();
});
</script>
