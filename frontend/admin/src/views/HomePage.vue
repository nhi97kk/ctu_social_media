<template>
  <!-- loader -->
  <loader v-if="loader"></loader>

  <!-- content  -->
  <div v-else class="mx-2">
    <!-- total content  -->
    <div class="row my-2 w-100">
      <!-- user  -->
      <div :key="1" class="col-3">
        <div class="p-3 d-flex bg-dark rounded">
          <div class="p-3 bg-info text-white rounded me-4">
            <i class="fa-solid fa-user"></i>
          </div>
          <div class="d-flex flex-column justify-content-between text-white">
            <h6 class="m-0">Users</h6>
            <h6 class="m-0">{{ user.totalUsers }}</h6>
          </div>
        </div>
      </div>

      <!-- post  -->
      <div :key="2" class="col-3">
        <div class="p-3 d-flex bg-dark rounded">
          <div class="p-3 bg-success text-white rounded me-4">
            <i class="fa-solid fa-calendar"></i>
          </div>
          <div class="d-flex flex-column justify-content-between text-white">
            <h6 class="m-0">Posts</h6>
            <h6 class="m-0">{{ post.totalPosts }}</h6>
          </div>
        </div>
      </div>

      <!-- product  -->
      <div :key="6" class="col-3">
        <div class="p-3 d-flex bg-dark rounded">
          <div class="p-3 bg-primary text-white rounded me-4">
            <i class="fa-solid fa-question"></i>
          </div>
          <div class="d-flex flex-column justify-content-between text-white">
            <h6 class="m-0">Question</h6>
            <h6 class="m-0">{{ question.totalQuestions }}</h6>
          </div>
        </div>
      </div>

      <!-- report  -->
      <div :key="9" class="col-3">
        <div class="p-3 d-flex bg-dark rounded">
          <div class="p-3 bg-danger text-white rounded me-4">
            <i class="fa-solid fa-circle-exclamation"></i>
          </div>
          <div class="d-flex flex-column justify-content-between text-white">
            <h6 class="m-0">Reports</h6>
            <h6 class="m-0">10</h6>
          </div>
        </div>
      </div>
    </div>

    <!-- user chart  -->
    <div :key="user" class="border boder-info w-100 rounded p-2 my-1">
      <h4 class="text-center">User Statistics</h4>
      <div class="row w-100">
        <div class="col-4">
          <ChartComponent
            class="mx-3"
            v-if="userGenderData"
            :chartData="userGenderData"
            chartType="pie"
          />
        </div>
        <div class="col-8">
          <ChartComponent
            class="mx-3"
            v-if="roleDistributionData"
            :chartData="roleDistributionData"
            chartType="bar"
          />
        </div>
      </div>
    </div>

    <!-- post chart  -->
    <div :key="post" class="border boder-info w-100 rounded p-2 my-1">
      <h4 class="text-center">Post Statistics</h4>

      <div class="row w-100">
        <div class="col-4">
          <ChartComponent
            v-if="postStatusData"
            :chartData="postStatusData"
            chartType="bar"
          />
        </div>

        <!-- Posts Created Per Day Chart -->
        <div class="col-8">
          <ChartComponent
            v-if="postsPerDayData"
            :chartData="postsPerDayData"
            chartType="line"
          />
        </div>
      </div>
    </div>

    <!-- product chart  -->
    <div :key="product" class="border boder-info w-100 rounded p-2 my-1">
      <h4 class="text-center">Product Statistics</h4>
      <div class="row w-100">
        <div class="col-4">
          <ChartComponent
            v-if="productStatusData"
            :chartData="productStatusData"
            chartType="bar"
          />
        </div>

        <!-- Products Created Per Day Chart -->
        <div class="col-8">
          <ChartComponent
            v-if="productsPerDayData"
            :chartData="productsPerDayData"
            chartType="line"
          />
        </div>
      </div>
    </div>

    <!-- question chart  -->
    <div :key="question" class="border boder-info w-100 rounded p-2 my-1">
      <h4 class="text-center">Question Statistics</h4>
      <div class="row w-100">
        <div class="col-4">
          <ChartComponent
            v-if="questionStatusData"
            :chartData="questionStatusData"
            chartType="pie"
          />
        </div>

        <!-- questions Created Per Day Chart -->
        <div class="col-8">
          <ChartComponent
            v-if="questionsPerDayData"
            :chartData="questionsPerDayData"
            chartType="line"
          />
        </div>
      </div>
    </div>

    <!-- report chart  -->
    <div :key="report" class="border boder-info w-100 rounded p-2 my-1">
      <h4 class="text-center">Report Statistics</h4>
      <div class="row w-100">
        <div class="col-4">
          <ChartComponent
            v-if="reportStatusData"
            :chartData="reportStatusData"
            chartType="bar"
          />
        </div>

        <!-- reports Created Per Day Chart -->
        <div class="col-8">
          <ChartComponent
            v-if="reportsPerDayData"
            :chartData="reportsPerDayData"
            chartType="line"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import ChartComponent from '@/components/dashboard/ChartComponent.vue';
import Loader from '@/components/partials/Loader.vue';

import userService from '@/services/user.service.js';
import postService from '@/services/post.service.js';
import productService from '@/services/product.service.js';
import questionService from '@/services/question.service.js';
import reportService from '@/services/report.service.js';

import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toast-notification';

const $toast = useToast();
const loader = ref(true);

const user = ref(null);
const userGenderData = ref(null);
const roleDistributionData = ref(null);

const post = ref(null);
const postStatusData = ref(null);
const postsPerDayData = ref(null);

const product = ref(null);
const productStatusData = ref(null);
const productsPerDayData = ref(null);

const question = ref(null);
const questionStatusData = ref(null);
const questionsPerDayData = ref(null);

const report = ref(null);
const reportStatusData = ref(null);
const reportsPerDayData = ref(null);

onMounted(async () => {
  const userRes = await userService.getUserStatistics();
  const postRes = await postService.getPostStatistics();
  const productRes = await productService.getProductStatistics();
  const questionRes = await questionService.getQuestionStatistics();
  const reportRes = await reportService.getReportStatistics();

  if (userRes.status === 'success') {
    user.value = userRes.data;

    // Dữ liệu cho biểu đồ phân phối giới tính người dùng
    userGenderData.value = {
      labels: user.value.genderDistribution.map((g) => g._id),
      datasets: [
        {
          label: 'User Gender Distribution',
          data: user.value.genderDistribution.map((g) => g.count),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    };

    // Dữ liệu cho biểu đồ cột đôi với trạng thái active và role
    const activeRoles = user.value.roleDistribution.reduce((acc, item) => {
      const role = item.role;
      const active = item.active ? 'Active' : 'Inactive';

      // Khởi tạo cấu trúc cho mỗi role và trạng thái active
      if (!acc[role]) {
        acc[role] = { Active: 0, Inactive: 0 };
      }
      acc[role][active] = item.count;

      return acc;
    }, {});

    // Biến đổi dữ liệu thành cấu trúc phù hợp cho biểu đồ cột đôi
    roleDistributionData.value = {
      labels: Object.keys(activeRoles),
      datasets: [
        {
          label: 'Active',
          data: Object.values(activeRoles).map((role) => role.Active),
          backgroundColor: '#36A2EB',
        },
        {
          label: 'Inactive',
          data: Object.values(activeRoles).map((role) => role.Inactive),
          backgroundColor: '#FF6384',
        },
      ],
    };
  }

  if (postRes.status === 'success') {
    post.value = postRes.data;

    // Dữ liệu cho biểu đồ trạng thái bài viết
    postStatusData.value = {
      labels: post.value.postStatusDistribution.map((p) => p._id),
      datasets: [
        {
          label: 'Post Distribution',
          data: post.value.postStatusDistribution.map((p) => p.count),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    };

    postsPerDayData.value = {
      labels: post.value.postsPerDay.map((p) => p.date), // Lấy các ngày theo dạng 'MM/DD'
      datasets: [
        {
          label: 'Posts per Day',
          data: post.value.postsPerDay.map((p) => p.count), // Lấy số lượng bài viết
          backgroundColor: '#36A2EB',
        },
      ],
    };
  }

  if (productRes.status === 'success') {
    product.value = productRes.data;

    // Dữ liệu cho biểu đồ trạng thái bài viết
    productStatusData.value = {
      labels: product.value.productStatusDistribution.map((p) => p._id),
      datasets: [
        {
          label: 'Product Distribution',
          data: product.value.productStatusDistribution.map((p) => p.count),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    };

    productsPerDayData.value = {
      labels: product.value.productsPerDay.map((p) => p.date), // Lấy các ngày theo dạng 'MM/DD'
      datasets: [
        {
          label: 'Products per Day',
          data: product.value.productsPerDay.map((p) => p.count), // Lấy số lượng bài viết
          backgroundColor: '#36A2EB',
        },
      ],
    };
  }

  if (questionRes.status === 'success') {
    question.value = questionRes.data;

    // Dữ liệu cho biểu đồ trạng thái bài viết
    questionStatusData.value = {
      labels: question.value.questionStatusDistribution.map((p) => p._id),
      datasets: [
        {
          label: 'Question Distribution',
          data: question.value.questionStatusDistribution.map((p) => p.count),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    };

    questionsPerDayData.value = {
      labels: question.value.questionsPerDay.map((p) => p.date), // Lấy các ngày theo dạng 'MM/DD'
      datasets: [
        {
          label: 'Questions per Day',
          data: question.value.questionsPerDay.map((p) => p.count), // Lấy số lượng bài viết
          backgroundColor: '#36A2EB',
        },
      ],
    };
  }

  if (reportRes.status === 'success') {
    report.value = reportRes.data;

    // Dữ liệu cho biểu đồ trạng thái bài viết
    reportStatusData.value = {
      labels: report.value.reportStatusDistribution.map((p) => p._id),
      datasets: [
        {
          label: 'Report Distribution',
          data: report.value.reportStatusDistribution.map((p) => p.count),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    };

    reportsPerDayData.value = {
      labels: report.value.reportsPerDay.map((p) => p.date), // Lấy các ngày theo dạng 'MM/DD'
      datasets: [
        {
          label: 'Reports per Day',
          data: report.value.reportsPerDay.map((p) => p.count), // Lấy số lượng bài viết
          backgroundColor: '#36A2EB',
        },
      ],
    };
  }
  loader.value = false;
});
</script>

