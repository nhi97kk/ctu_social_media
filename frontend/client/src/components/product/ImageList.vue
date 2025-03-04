<template>
  <div class="image-list list d-flex">
    <image-item
      class="image-item"
      v-for="(image, index) in images"
      :key="index"
      :image="image"
      :can-remove="canRemove"
      @remove="removeImage(index)"
    ></image-item>
  </div>
</template>

<script setup>
import ImageItem from "@/components/product/ImageItem.vue";

const props = defineProps({
  images: Array, // Danh sách các hình ảnh URL hoặc file tạm
  canRemove: Boolean, // Quyền xóa ảnh
});
const emits = defineEmits(["remove"]);

function removeImage(index) {
  emits("remove", index);
}
</script>

<style scoped>
.image-list {
  overflow-x: scroll;
  overflow-y: hidden;
  height: 200px;
}
</style>
