<template>
  <!-- loader -->
  <loader v-if="loader"></loader>

  <div v-else>
    <div class="container mt-3">
      <router-link :to="{ name: 'page-list' }">
        <i class="fa-solid fa-arrow-left-long"></i> All Pages
      </router-link>
    </div>

    <ReportContent
      :hide="page.hide"
      :targetId="page._id"
      :targetModel="'Page'"
      @restore="submitRestore"
      @hide="submitHide"
    ></ReportContent>

    <div class="container px-5 py-3">
      <legend class="form-title">Page Detail</legend>

      <div
        class="d-flex flex-column justify-content-center align-items-strech my-3 border border-info p-2 rounded"
      >
        <div
          class="d-flex flex-column justify-content-center align-items-center"
        >
          <img
            class="w-75 rounded shadow"
            style="height: 300px; object-fit: cover"
            :src="page.coverImage"
            alt="Page image"
          />

          <img
            class="mt-2 shadow rounded-circle"
            style="height: 150px; width: 150px; object-fit: cover"
            :src="page.avatar"
            alt="Page image"
          />
        </div>
        <div
          class="ms-2 pe-3 me-auto d-flex justify-content-between flex-column"
        >
          <div class="email">
            <span class="fw-bold">Page Name: </span>{{ page.name }}
          </div>
          <div class="fullname">
            <span class="fw-bold">Description: </span>
            {{ page.desc }}
          </div>

          <div class="">
            Page of
            <span
              class="fw-bold btn-hover"
              @click="
                $router.push({
                  name: 'user-edit',
                  params: { userId: page.owner._id },
                })
              "
            >
              {{ page.owner.name }}
              <i class="fa-solid fa-arrow-up-right-from-square text-primary"></i
            ></span>
          </div>

          <h6 class="text-secondary">
            Status:
            <span
              :class="{
                'bg-success': page.status === 'approved',
                'bg-danger': page.status === 'rejected',
                'bg-warning': page.status === 'pending',
              }"
              class="p-1 text-white rounded"
              >{{ page.status }}</span
            >
          </h6>

          <div v-if="page.status === 'pending'" class="me-3 my-2">
            <button
              @click="approvePage(page._id)"
              class="btn btn-sm btn-success me-2"
            >
              Approve
            </button>
            <button
              @click="rejectPage(page._id)"
              class="btn btn-sm btn-warning"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Loader from '@/components/partials/Loader.vue';
import ReportContent from '@/components/report/ReportContent.vue';

import '@/assets/css/form.css';
import pageService from '@/services/page.service';

import { ref, onBeforeMount, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { useToast } from 'vue-toast-notification';

const $toast = useToast();
const router = useRouter();
const route = useRoute();
const page = ref({});
const loader = ref(true);

async function approvePage(pageId) {
  const res = await pageService.updateApprovedPage(pageId);
  if (res.status == 'success') {
    page.value.status = 'approved';
  } else {
    $toast.error(res.message || 'An error occurred! Please try again later.', {
      position: 'top-right',
    });
  }
}

async function rejectPage(pageId) {
  const res = await pageService.updateRejectedPage(pageId);
  if (res.status == 'success') {
    page.value.status = 'rejected';
  } else {
    $toast.error(res.message || 'An error occurred! Please try again later.', {
      position: 'top-right',
    });
  }
}

async function submitHide() {
  const result = await Swal.fire({
    title: 'Move to Trash',
    text: 'Are you sure you want to remove this page to Trash?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });

  if (!result.isConfirmed) return;

  const response = await pageService.hidePage(page.value._id);
  if (response.status === 'success') {
    $toast.success(`The page have been moved!`, {
      position: 'top-right',
    });

    page.value.hide = true;
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
    text: 'Are you sure you want to restore this page?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });

  if (!result.isConfirmed) return;

  const response = await pageService.restorePage(page.value._id);
  if (response.status === 'success') {
    $toast.success(`The page have been restored!`, {
      position: 'top-right',
    });

    page.value.hide = false;
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
  loader.value = true;
  const response = await pageService.getPage(route.params.pageId);

  if (response.status === 'success') {
    page.value = response.data.page;
  } else {
    $toast.error('An error occurred! Please try again later.', {
      position: 'top-right',
    });

    router.push({ name: 'page-list' });
  }
  loader.value = false;
});
</script>

<style scoped></style>

