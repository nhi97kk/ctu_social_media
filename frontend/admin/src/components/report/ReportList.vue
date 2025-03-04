<template>
  <!-- loader -->
  <loader v-if="loader"></loader>

  <div v-else class="px-4">
    <ReportFilter></ReportFilter>
    <DataTable
      class="table table-hover table-striped table-bordered"
      width="100%"
      :options="{
        paging: false, // Tắt phân trang
        lengthChange: false, // Tắt show entries
        info: false, // Tắt thông tin phân trang (entries)
        columnDefs: [
          { orderable: false, targets: [5] }, // Tắt sắp xếp cho cột thứ 3 (Post)
        ],
      }"
    >
      <thead class="table-success">
        <tr>
          <th>Content</th>
          <th>Model</th>
          <th>Created By</th>
          <th>Created At</th>
          <th>Status</th>
          <th style="text-align: center">Option</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="report in reports" :key="report._id">
          <td>{{ report.message }}</td>

          <td>
            <span class="fw-bold">{{ report.targetModel }}</span>
          </td>
          <td>
            <span
              class="fw-bold btn-hover"
              @click="
                $router.push({
                  name: 'user-detail',
                  params: { userId: report.actor._id },
                })
              "
            >
              {{ report.actor.name }}
              <i class="fa-solid fa-arrow-up-right-from-square text-primary"></i
            ></span>
          </td>
          <td>{{ timeAgo(report.createdAt) }}</td>
          <td>
            <span
              :class="{
                'text-danger': report.status === 'pending',
                'text-success': report.status === 'resolved',
                'text-warning': report.status === 'rejected',
              }"
              class="text-capitalize fw-bold"
            >
              {{ report.status }}
            </span>
          </td>
          <td style="text-align: center">
            <button
              @click="
                $router.push({
                  name: `${report.targetModel.toLowerCase()}-detail`,
                  params: {
                    [`${report.targetModel.toLowerCase()}Id`]: report.targetId,
                  },
                })
              "
              class="btn btn-primary"
            >
              View
            </button>

            <button
              v-if="!report.hide"
              class="btn btn-danger ms-2"
              @click="submitHide(report)"
            >
              Move to Trash
            </button>
            <button
              v-else
              class="btn btn-secondary ms-2"
              @click="submitRestore(report)"
            >
              Restore
            </button>
          </td>
        </tr>
      </tbody>
    </DataTable>
  </div>
</template>

<script setup>
import ReportFilter from '@/components/report/ReportFilter.vue';
import Loader from '@/components/partials/Loader.vue';

import reportService from '@/services/report.service.js';

import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';
import Swal from 'sweetalert2';

DataTable.use(DataTablesCore);

const $toast = useToast();
const loader = ref(true);
const route = useRoute();
const router = useRouter();
const reports = ref([]);

// Hàm tính khoảng cách thời gian theo múi giờ Việt Nam
function timeAgo(date) {
  // Múi giờ Việt Nam
  const timeZone = 'Asia/Ho_Chi_Minh';
  // Chuyển đổi thời gian từ UTC về múi giờ Việt Nam
  const vietnamTime = utcToZonedTime(new Date(date), timeZone);
  // Format ngày, tháng, năm, giờ, phút, giây
  return format(vietnamTime, 'dd/MM/yyyy HH:mm:ss');
}

async function submitHide(report) {
  const result = await Swal.fire({
    title: 'Move to Trash',
    text: 'Are you sure you want to remove this report to Trash?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });

  if (!result.isConfirmed) return;

  const response = await reportService.hideReport(report._id);
  if (response.status === 'success') {
    $toast.success(`The report have been moved!`, {
      position: 'top-right',
    });

    router.push({
      name: 'report-list',
      query: {
        hide: false,
      },
    });
  } else {
    $toast.error(
      response.message || 'An error occurred! Please try again later.',
      {
        position: 'top-right',
      },
    );
  }
}

async function submitRestore(report) {
  const result = await Swal.fire({
    title: 'Restore',
    text: 'Are you sure you want to restore this report?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  });

  if (!result.isConfirmed) return;

  const response = await reportService.restoreReport(report._id);
  if (response.status === 'success') {
    $toast.success(`The report have been restored!`, {
      position: 'top-right',
    });

    router.push({
      name: 'report-list',
      query: {
        hide: false,
      },
    });
  } else {
    $toast.error(
      response.message || 'An error occurred! Please try again later.',
      {
        position: 'top-right',
      },
    );
  }
}

// Hàm fetch sản phẩm theo query
async function fetchReports() {
  loader.value = true;

  // Gọi service để lấy danh sách sản phẩm
  const response = await reportService.getAllReports(route.query);

  if (response.status === 'success') {
    reports.value = response.data.reports;
  } else {
    $toast.error(response.message || 'Failed to load reports');
  }
  loader.value = false;
}

// Khởi tạo dữ liệu khi component được mount
onMounted(fetchReports);

// Theo dõi sự thay đổi của query để tự động cập nhật danh sách sản phẩm
watch(() => route.query, fetchReports);
</script>

<style scoped></style>

