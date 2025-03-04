<template>
  <div class="">
    <img :src="imageUrl" alt="Product Image" />
    <span
      class="remove-icon"
      title="Remove Image"
      @click="removeImage"
      v-if="canRemove"
    >
      <i class="fa-solid fa-xmark p-1 rounded-circle border border-danger"></i>
    </span>
  </div>
</template>

<script setup>
import { computed } from "vue";
import Swal from "sweetalert2";

const props = defineProps(["image", "canRemove"]);

const emits = defineEmits(["remove"]);

// Nếu image là File object (khi người dùng upload), chúng ta sẽ tạo URL tạm thời để hiển thị ảnh preview
const imageUrl = computed(() =>
  typeof props.image === "string"
    ? props.image
    : URL.createObjectURL(props.image)
);

async function removeImage() {
  emits("remove");
}
</script>

<style scoped>
div {
  position: relative;
}

div + div {
  margin-left: 20px;
}

img {
  border: 1px solid #ccc;
  height: 180px;
}

.remove-icon {
  position: absolute;
  top: 2px;
  right: 2px;
  color: #ccc;
  background-color: inherit;
  transition: all 0.3s;
  cursor: pointer;
}

.remove-icon:hover {
  color: red;
}
</style>
