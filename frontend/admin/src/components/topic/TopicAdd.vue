<template>
  <div>
    <div class="container mt-3">
      <router-link :to="{ name: 'topic-list' }">
        <i class="fa-solid fa-arrow-left-long"></i> Back
      </router-link>
    </div>
    <div class="container p-5">
      <Form
        class="form border border-secondary p-3 rounded"
        @submit="onSubmit"
        :validation-schema="topicFormSchema"
      >
        <legend class="form-title">Add Topic</legend>
        <div class="mb-3 form-group">
          <label for="name" class="form-label">Name: </label>
          <Field
            type="text"
            name="name"
            id="name"
            class="form-control"
            v-model="topic.name"
          />
          <ErrorMessage name="name" class="error-feedback"></ErrorMessage>
        </div>
        <div class="mb-3 form-group">
          <label for="desc" class="form-label">Description: </label>
          <Field
            type="text"
            name="desc"
            id="desc"
            class="form-control"
            v-model="topic.desc"
          />
          <ErrorMessage name="desc" class="error-feedback"></ErrorMessage>
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
import topicService from '@/services/topic.service';
import Swal from 'sweetalert2';
import { useToast } from 'vue-toast-notification';

const $toast = useToast();
const router = useRouter();
const loading = ref(false);
const isAdd = ref(false);
const topic = ref({
  name: '',
  desc: '',
});

const topicFormSchema = yup.object({
  name: yup
    .string()
    .required('Topic name is required')
    .min(5, 'Topic name must be at least 5 characters long')
    .max(200, 'Topic name must not exceed 200 characters'),
  desc: yup
    .string()
    .required('Topic description is required')
    .min(5, 'Topic description must be at least 5 characters long')
    .max(200, 'Topic description must not exceed 200 characters'),
});

async function onSubmit() {
  const result = await Swal.fire({
    title: 'Confirmation',
    text: 'Are you sure you want to add this topic?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
  });

  if (!result.isConfirmed) return;

  loading.value = true;

  // Create topic
  const response = await topicService.createTopic(topic.value);

  if (response.status === 'success') {
    isAdd.value = true;

    $toast.success(`Topic added successfully!`, {
      position: 'top-right',
    });
    router.push({ name: 'topic-list' });
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

