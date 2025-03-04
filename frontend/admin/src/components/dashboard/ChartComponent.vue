<template>
  <div class="border border-dark shadow rounded p-1" style="height: 300px">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Chart } from 'chart.js/auto';
import { defineProps } from 'vue';

// Khai báo các props cho component
const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
  chartType: {
    type: String,
    default: 'bar',
  },
});

const canvas = ref(null);
let chartInstance = null;

onMounted(() => {
  if (canvas.value) {
    // Khởi tạo biểu đồ Chart.js với dữ liệu từ props
    chartInstance = new Chart(canvas.value, {
      type: props.chartType,
      data: props.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
});

// Cleanup chart instance khi component bị hủy
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>
