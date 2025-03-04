<template>
  <form class="d-flex" @submit.prevent="onSubmit">
    <input
      class="form-control me-2"
      type="search"
      placeholder="Search items..."
      aria-label="Search"
      v-model="search"
    />
    <button class="btn btn-success px-4 ml-2" type="submit">
      <i class="fa-solid fa-magnifying-glass"></i>
    </button>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const emits = defineEmits(["search-product"]);
const search = ref("");

async function onSubmit() {
  await router.push({
    name: "product-list",
    query: { name: search.value.trim() },
  });
  emits("search-product");
}
</script>
