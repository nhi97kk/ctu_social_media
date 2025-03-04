<template>
  <div v-if="!loading" class="container mt-3 w-100">
    <div
      v-if="reports.length > 0"
      class="d-flex flex-column p-2 border border-danger rounded mb-3"
    >
      <h5>All Reports</h5>
      <div v-for="report in reports" class="my-2 d-flex align-items-start">
        <img
          :src="report.actor.avatar"
          alt=""
          class="rounded-circle me-2 border border-info"
          style="width: 60px; height: 60px; object-fit: cover"
        />
        <div class="d-flex flex-column">
          <span class="fw-bold">{{ report.actor.name }}</span>
          <div class="d-flex">
            <span
              class="fw-bold me-2"
              :class="{
                'text-danger': report.status === 'pending',
                'text-success': report.status === 'resolved',
                'text-warning': report.status === 'rejected',
              }"
              >{{ report.status }}</span
            >
            <div v-if="report.status === 'pending'" class="mb-1">
              <button
                @click="resolveReport(report._id)"
                class="btn btn-sm btn-success me-1"
              >
                Resolve
              </button>
              <button
                @click="rejectReport(report._id)"
                class="btn btn-sm btn-warning"
              >
                Reject
              </button>
            </div>
          </div>
          <span class="p-2 rounded border border-secondary">{{
            report.message
          }}</span>
        </div>
      </div>
    </div>

    <div
      v-if="reports.some((report) => report.status === 'pending')"
      class="my-1"
    >
      <button class="btn btn-success me-2" @click="resolveReports">
        Resolve all Pending Reports
      </button>
      <button class="btn btn-warning" @click="rejectReports">
        Reject all Pending Reports
      </button>
    </div>

    <div v-if="targetModel != 'User'">
      <button
        v-if="props.hide === true"
        class="btn btn-outline-secondary mb-2"
        @click="emit('restore')"
      >
        Restore this {{ targetModel }}
      </button>
      <button
        v-if="reports.length > 0 && props.hide === false"
        class="btn btn-outline-danger mb-2"
        @click="emit('hide')"
      >
        Move this {{ targetModel }} to Trash
      </button>
    </div>
  </div>
</template>
<script setup>
import reportService from '@/services/report.service';

import { ref, onBeforeMount, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { useToast } from 'vue-toast-notification';
import { formatDistanceToNow } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

const emit = defineEmits(['restore', 'hide']);
const props = defineProps(['targetId', 'targetModel', 'hide']);
const { targetId, targetModel } = props;
const $toast = useToast();
const loading = ref(true);
const reports = ref([]);

async function rejectReports() {
  const response = await reportService.rejectReports(targetId, targetModel);
  if (response.status === 'success') {
    // Cập nhật trạng thái của các report trong mảng `reports`
    reports.value.forEach((report) => {
      if (report.status === 'pending') {
        report.status = 'rejected'; // Đổi trạng thái thành 'rejected'
      }
    });

    $toast.success(`Reject all Pending Reports`, {
      position: 'top-right',
    });
  }
}

async function resolveReports() {
  const response = await reportService.resolveReports(targetId, targetModel);
  if (response.status === 'success') {
    // Cập nhật trạng thái của các report trong mảng `reports`
    reports.value.forEach((report) => {
      if (report.status === 'pending') {
        report.status = 'resolved'; // Đổi trạng thái thành 'resolved'
      }
    });

    $toast.success(`Resolve all Pending Reports`, {
      position: 'top-right',
    });
  }
}

async function rejectReport(reportId) {
  const response = await reportService.rejectReport(reportId);
  if (response.status === 'success') {
    // Cập nhật trạng thái của các report trong mảng `reports`
    reports.value.forEach((report) => {
      if (report._id === reportId) {
        report.status = 'rejected';
      }
    });
  }
}

async function resolveReport(reportId) {
  const response = await reportService.resolveReport(reportId);
  if (response.status === 'success') {
    // Cập nhật trạng thái của các report trong mảng `reports`
    reports.value.forEach((report) => {
      if (report._id === reportId) {
        report.status = 'resolved';
      }
    });
  }
}

async function fetchReports() {
  const query = {};
  loading.value = true;

  if (targetId) query.targetId = targetId;
  if (targetModel) query.targetModel = targetModel;

  const response = await reportService.getAllReports(query);

  if (response.status === 'success') {
    reports.value = response.data.reports;
  }
  loading.value = false;
}

onBeforeMount(async () => {
  await fetchReports();
});
</script>
<style scoped></style>
