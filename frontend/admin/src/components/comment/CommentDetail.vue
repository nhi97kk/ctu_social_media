<template>
  <!-- loader -->
  <loader v-if="loader"></loader>

  <div v-else class="container">
    <div class="w-100 my-3">
      <router-link :to="{ name: 'comment-list' }">
        <i class="fa-solid fa-arrow-left-long"></i> All Comments
      </router-link>
    </div>

    <ReportContent
      :hide="comment.hide"
      :targetId="comment._id"
      :targetModel="'Comment'"
      @restore="submitRestore"
      @hide="submitHide"
    ></ReportContent>

    <div class="d-flex flex-column p-2 border border-info rounded">
      <h5>Comment Detail</h5>
      <div class="my-2 d-flex align-items-start">
        <img
          :src="comment.user.avatar"
          alt=""
          class="rounded-circle me-2 border border-info"
          style="width: 60px; height: 60px; object-fit: cover"
        />
        <div class="d-flex flex-column">
          <span class="fw-bold">{{ comment.user.name }}</span>
          <span class="p-2 rounded border border-secondary">{{
            comment.desc
          }}</span>
          <span
            ><i class="fa-regular fa-thumbs-up"></i>
            {{ comment.likes.length }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import Loader from '@/components/partials/Loader.vue';
import ReportContent from '@/components/report/ReportContent.vue';

import commentService from '@/services/comment.service';

import { ref, onBeforeMount, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { useToast } from 'vue-toast-notification';
import { formatDistanceToNow } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

const $toast = useToast();
const router = useRouter();
const route = useRoute();
const loader = ref(true);
const comment = ref(null);

async function submitHide() {
  const result = await Swal.fire({
    title: 'Move to Trash',
    text: 'Are you sure you want to remove this comment to Trash?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });

  if (!result.isConfirmed) return;

  const response = await commentService.hideComment(comment.value._id);
  if (response.status === 'success') {
    $toast.success(`The comment have been moved!`, {
      position: 'top-right',
    });

    comment.value.hide = true;
  } else {
    $toast.error(
      response.message || 'An error occurred! Please try again later.',
      {
        position: 'top-right',
      },
    );
  }
}

async function submitRestore() {
  const result = await Swal.fire({
    title: 'Restore',
    text: 'Are you sure you want to restore this comment?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });

  if (!result.isConfirmed) return;

  const response = await commentService.restoreComment(comment.value._id);
  if (response.status === 'success') {
    $toast.success(`The comment have been restored!`, {
      position: 'top-right',
    });

    comment.value.hide = false;
  } else {
    $toast.error(
      response.message || 'An error occurred! Please try again later.',
      {
        position: 'top-right',
      },
    );
  }
}

onBeforeMount(async () => {
  const response = await commentService.getComment(route.params.commentId);

  if (response.status === 'success') {
    comment.value = response.data.comment;
  } else {
    $toast.error(
      response.message || 'An error occurred! Please try again later.',
      {
        position: 'top-right',
      },
    );

    router.push({ name: 'comment-list' });
  }

  loader.value = false;
});
</script>
<style scoped></style>

