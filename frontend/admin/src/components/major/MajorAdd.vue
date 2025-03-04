<template>
  <div>
    <div class="container mt-3">
      <router-link :to="{ name: 'major-list' }">
        <i class="fa-solid fa-arrow-left-long"></i> All Majors
      </router-link>
    </div>
    <div class="container p-5">
      <Form
        class="form border border-secondary rounded p-3"
        @submit="onSubmit"
        :validation-schema="majorFormSchema"
      >
        <legend class="form-title">Add major</legend>
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
            class="btn btn-success btn-md"
            type="submit"
            :disabled="loading"
          >
            Add
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
import { ref } from 'vue';
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import majorService from '@/services/major.service';
import Swal from 'sweetalert2';
import { useToast } from 'vue-toast-notification';

const $toast = useToast();
const router = useRouter();
const loading = ref(false);
const isAdd = ref(false);
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
    text: 'Are you sure you want to add this major?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
  });

  if (!result.isConfirmed) return;

  loading.value = true;

  // Create major
  const response = await majorService.createMajor(major.value);

  if (response.status === 'success') {
    isAdd.value = true;

    $toast.success(`Major added successfully!`, {
      position: 'top-right',
    });
    router.push({ name: 'major-list' });
  } else {
    $toast.error('An error occurred! Please try again later.', {
      position: 'top-right',
    });
  }
  loading.value = false;
}

onBeforeRouteLeave(async () => {
  if (isAdd.value) return true;
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

