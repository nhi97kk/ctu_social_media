<template>
  <!-- loader -->
  <loader v-if="loader"></loader>

  <div v-else>
    <div class="container mt-3">
      <router-link :to="{ name: 'group-list' }">
        <i class="fa-solid fa-arrow-left-long"></i> All Groups
      </router-link>
    </div>

    <ReportContent
      :hide="group.hide"
      :targetId="group._id"
      :targetModel="'Group'"
      @restore="submitRestore"
      @hide="submitHide"
    ></ReportContent>

    <div class="container px-5 py-3">
      <legend class="form-title">Group Detail</legend>

      <div
        class="d-flex flex-column justify-content-center align-items-strech my-3 border border-info p-2 rounded"
      >
        <div
          class="d-flex flex-column justify-content-center align-items-center"
        >
          <img
            class="w-75 rounded shadow"
            style="height: 300px; object-fit: cover"
            :src="group.coverImage"
            alt="Group image"
          />

          <img
            class="mt-2 shadow rounded-circle"
            style="height: 150px; width: 150px; object-fit: cover"
            :src="group.avatar"
            alt="Group image"
          />
        </div>
        <div
          class="ms-2 pe-3 me-auto d-flex justify-content-between flex-column"
        >
          <div class="email">
            <span class="fw-bold">Group Name: </span>{{ group.name }}
          </div>
          <div class="fullname">
            <span class="fw-bold">Description: </span>
            {{ group.desc }}
          </div>

          <div class="">
            Group of
            <span
              class="fw-bold btn-hover"
              @click="
                $router.push({
                  name: 'user-edit',
                  params: { userId: group.owner._id },
                })
              "
            >
              {{ group.owner.name }}
              <i class="fa-solid fa-arrow-up-right-from-square text-primary"></i
            ></span>

            <h6 class="text-secondary">
              Status:
              <span
                :class="{
                  'bg-success': group.status === 'approved',
                  'bg-danger': group.status === 'rejected',
                  'bg-warning': group.status === 'pending',
                }"
                class="p-1 text-white rounded"
                >{{ group.status }}</span
              >
            </h6>

            <div v-if="group.status === 'pending'" class="me-3 my-2">
              <button
                @click="approveGroup(group._id)"
                class="btn btn-sm btn-success me-2"
              >
                Approve
              </button>
              <button
                @click="rejectGroup(group._id)"
                class="btn btn-sm btn-warning"
              >
                Reject
              </button>
            </div>
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
import groupService from '@/services/group.service';

import { ref, onBeforeMount, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { useToast } from 'vue-toast-notification';

const $toast = useToast();
const router = useRouter();
const route = useRoute();
const group = ref({});
const loader = ref(true);

async function approveGroup(groupId) {
  const res = await groupService.updateApprovedGroup(groupId);
  if (res.status == 'success') {
    group.value.status = 'approved';
  } else {
    $toast.error(res.message || 'An error occurred! Please try again later.', {
      position: 'top-right',
    });
  }
}

async function rejectGroup(groupId) {
  const res = await groupService.updateRejectedGroup(groupId);
  if (res.status == 'success') {
    group.value.status = 'rejected';
  } else {
    $toast.error(res.message || 'An error occurred! Please try again later.', {
      position: 'top-right',
    });
  }
}

async function submitHide() {
  const result = await Swal.fire({
    title: 'Move to Trash',
    text: 'Are you sure you want to remove this group to Trash?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });

  if (!result.isConfirmed) return;

  const response = await groupService.hideGroup(group.value._id);
  if (response.status === 'success') {
    $toast.success(`The group have been moved!`, {
      position: 'top-right',
    });

    group.value.hide = true;
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
    text: 'Are you sure you want to restore this group?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });

  if (!result.isConfirmed) return;

  const response = await groupService.restoreGroup(group.value._id);
  if (response.status === 'success') {
    $toast.success(`The group have been restored!`, {
      position: 'top-right',
    });

    group.value.hide = false;
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
  const response = await groupService.getGroup(route.params.groupId);

  if (response.status === 'success') {
    group.value = response.data.group;
  } else {
    $toast.error('An error occurred! Please try again later.', {
      position: 'top-right',
    });

    router.push({ name: 'group-list' });
  }
  loader.value = false;
});
</script>

<style scoped></style>

