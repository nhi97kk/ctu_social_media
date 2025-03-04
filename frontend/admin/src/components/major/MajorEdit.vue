<template>
  <div>
    <div class="container mt-3">
      <router-link :to="{ name: 'major-list' }">
        <i class="fa-solid fa-arrow-left-long"></i> All Majors
      </router-link>
    </div>
    <div class="container px-5 py-3">
      <Form
        class="form border border-secondary rounded p-3"
        @submit="onSubmit"
        :validation-schema="majorFormSchema"
      >
        <legend class="form-title">Edit Major</legend>

        <div class="mb-3 form-group">
          <label for="name" class="form-label">Major Name: </label>
          <Field
            type="text"
            name="name"
            id="name"
            class="form-control"
            v-model="major.name"
          />
          <ErrorMessage name="name" class="error-feedback"></ErrorMessage>
        </div>
        <div class="mb-3 form-group">
          <label for="college" class="form-label">College/School: </label>
          <Field
            type="text"
            name="college"
            id="college"
            class="form-control"
            v-model="major.college"
          />
          <ErrorMessage name="college" class="error-feedback"></ErrorMessage>
        </div>

        <div class="mb-3 form-group">
          <button
            class="btn btn-warning btn-md text-white"
            type="submit"
            :disabled="loading"
          >
            Update
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
              v-if="loading"
            ></span>
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup>
import '@/assets/css/form.css';
import { ref, onBeforeMount } from 'vue';
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import majorService from '@/services/major.service';
import Swal from 'sweetalert2';
import { useToast } from 'vue-toast-notification';

const $toast = useToast();
const router = useRouter();
const route = useRoute();
const loading = ref(false);
const isUpdated = ref(false);
const major = ref({
  name: '',
  college: '',
});

const majorFormSchema = yup.object({
  name: yup
    .string()
    .required('Major name is required')
    .min(5, 'Major name must be at least 5 characters long')
    .max(200, 'Major name must not exceed 200 characters'),
  college: yup
    .string()
    .required('College/School is required')
    .min(5, 'College/School must be at least 5 characters long')
    .max(200, 'College/School must not exceed 200 characters'),
});

async function onSubmit() {
  const result = await Swal.fire({
    title: 'Confirmation',
    text: 'Are you sure you want to edit this major?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Continue editing',
    reverseButtons: false,
  });

  if (!result.isConfirmed) return;

  loading.value = true;

  // Update
  const response = await majorService.updateMajor(
    route.params.majorId,
    major.value,
  );

  if (response.status === 'success') {
    $toast.success(`Major updated successfully!`, {
      position: 'top-right',
    });
    isUpdated.value = true;
    router.push({ name: 'major-list' });
  } else {
    $toast.error('An error occurred! Please try again later.', {
      position: 'top-right',
    });
  }
  loading.value = false;
}

onBeforeMount(async () => {
  const response = await majorService.getMajor(route.params.majorId);

  if (response.status === 'success') {
    major.value = response.data.major;
  } else {
    $toast.error('An error occurred! Please try again later.', {
      position: 'top-right',
    });
    isUpdated.value = true;
    router.push({ name: 'major-list' });
  }
});

onBeforeRouteLeave(async () => {
  if (isUpdated.value) return true;
  const result = await Swal.fire({
    title: 'Confirmation',
    text: 'Your changes are not saved. Are you sure you want to leave this page?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Continue editing',
    reverseButtons: false,
  });

  return result.isConfirmed;
});
</script>

<style scoped>
.form {
  max-width: 1000px;
  margin: 0 auto;
}
.description {
  font-size: 14px;
  height: 200px;
}
</style>

