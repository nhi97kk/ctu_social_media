<template>
  <div class="d-flex flex-start flex-column p-2">
    <h4 class="text-color">Joined groups</h4>
    <div class="row">
      <div v-if="groups.length == 0" class="text-color text-center py-3">
        <span>No groups available...</span>
      </div>
      <div
        v-else
        v-for="group in groups"
        :key="group._id"
        class="col-6 d-flex flex-column"
      >
        <div
          class="d-flex align-items-center rounded-lg bg-white p-2 shadow border border-info"
        >
          <div>
            <img
              :src="group.avatar"
              alt=""
              style="width: 150px; height: 150px; object-fit: cover"
              class="rounded-circle shadow border border-info"
            />
          </div>
          <div class="d-flex flex-column ml-4">
            <h4 class="btn-hover">{{ group.name }}</h4>
            <span
              ><i class="fa-solid fa-users-rectangle text-success mr-2"></i>
              {{ group.members.length }} Member</span
            >

            <div class="d-flex">
              <button
                @click="
                  $router.push({ name: 'group', params: { id: group._id } })
                "
                class="btn btn-success d-flex align-items-center fit-content mr-2"
              >
                <span>View</span>
                <i class="fa-solid fa-eye ml-2"></i>
              </button>
              <button
                @click="leaveGroup(group._id)"
                class="btn btn-danger d-flex align-items-center fit-content"
              >
                <span>Leave</span>
                <i class="fa-solid fa-right-from-bracket ml-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import groupService from "@/services/group.service.js";

import { ref, onBeforeMount, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

const $toast = useToast();
const user = inject("user");
const groups = ref([]);
const loading = ref(false);
const route = useRoute();
const router = useRouter();

async function leaveGroup(groupId, userId) {
  const result = await Swal.fire({
    title: "Comfirm",
    text: "Are you sure to leave this group?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  if (!result.isConfirmed) return;

  await groupService.leave(groupId);

  $toast.success(`Leave group successfully`, {
    position: "top-right",
  });
  await refresh();
}

async function refresh() {
  const response = await groupService.getJoinedGroups();

  if (response.status !== "success") {
    $toast.error("Error occur! Try again later...", {
      position: "top-right",
    });
    router.push({ name: "home-page" });
    return;
  }

  groups.value = response.data.groups;
}

onBeforeMount(async () => {
  await refresh();
});
</script>
