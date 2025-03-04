<template>
  <!-- loader -->
  <loader v-if="loader"></loader>

  <div v-else>
    <div class="container mt-3">
      <router-link :to="{ name: 'user-list' }">
        <i class="fa-solid fa-arrow-left-long"></i> All Users
      </router-link>
    </div>

    <ReportContent
      :hide="true"
      :targetId="user._id"
      :targetModel="'User'"
      @retore=""
      @hide=""
    ></ReportContent>

    <div class="container px-5 py-3">
      <Form class="form" @submit="onSubmit" :validation-schema="userFormSchema">
        <legend class="form-title">Account Detail</legend>

        <div
          class="d-flex flex-column justify-content-center align-items-strech my-3 border border-info p-2 rounded"
        >
          <div
            class="d-flex flex-column justify-content-center align-items-center"
          >
            <img
              class="w-75 rounded shadow"
              style="height: 200px; object-fit: cover"
              :src="user.coverImage"
              alt="Ảnh người dùng"
            />

            <img
              class="item-image mt-2 shadow"
              :src="user.avatar"
              alt="Ảnh người dùng"
            />
          </div>
          <div
            class="ms-2 pe-3 me-auto d-flex justify-content-between flex-column"
          >
            <div class="email">
              <span class="fw-bold">Email:</span>
              {{ user.email }}
            </div>
            <div class="fullname">
              <span class="fw-bold">User Name:</span>
              {{ user.name ? user.name : '-' }}
            </div>
            <div class="telephone">
              <span class="fw-bold">Major:</span>
              {{
                user?.major.name
                  ? user.major.name + '(' + user.major.college + ')'
                  : '-'
              }}
            </div>
            <div class="">
              <span class="fw-bold">Gender:</span>
              {{ user.gender || '-' }}
            </div>
          </div>
        </div>

        <div class="mb-3 form-group">
          <label for="role" class="form-label">Role: </label>
          <Field
            as="select"
            name="role"
            id="role"
            class="form-control"
            v-model="user.role"
          >
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="user">User</option>
          </Field>
          <ErrorMessage name="role" class="error-feedback"></ErrorMessage>
        </div>
        <div class="mb-3 form-group">
          <Field v-slot="{ field }" name="active" type="checkbox">
            <label>
              Active:
              <input type="checkbox" name="active" v-model="user.active" />
            </label>
          </Field>
          <ErrorMessage name="is-active" class="error-feedback"></ErrorMessage>
        </div>

        <div class="mb-3 form-group">
          <button
            class="btn btn-outline-dark btn-md"
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
import Loader from '@/components/partials/Loader.vue';
import ReportContent from '@/components/report/ReportContent.vue';

import '@/assets/css/form.css';
import userService from '@/services/user.service';

import { ref, onBeforeMount, computed } from 'vue';
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import Swal from 'sweetalert2';
import { useToast } from 'vue-toast-notification';

const $toast = useToast();
const router = useRouter();
const route = useRoute();
const loading = ref(false);
const isUpdated = ref(false);
const user = ref({});
const loader = ref(true);

const userFormSchema = yup.object({
  role: yup.string().required('Role is required'),
  active: yup.boolean('Invalid active status'),
});

async function onSubmit() {
  const result = await Swal.fire({
    title: 'Confirmation',
    text: 'Are you sure you want to update this user?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Continue Editing',
    reverseButtons: false,
  });

  if (!result.isConfirmed) return;

  loading.value = true;

  // Update user
  const response = await userService.updateUser(
    route.params.userId,
    user.value,
  );

  if (response.status === 'success') {
    $toast.success('User edited successfully!', {
      position: 'top-right',
    });
    isUpdated.value = true;
    router.push({ name: 'user-list' });
  } else {
    $toast.error('An error occurred! Please try again later.', {
      position: 'top-right',
    });
  }

  loading.value = false;
}

onBeforeMount(async () => {
  loader.value = true;
  const response = await userService.getUser(route.params.userId);

  if (response.status === 'success') {
    user.value = response.data.user;
  } else {
    $toast.error('An error occurred! Please try again later.', {
      position: 'top-right',
    });

    isUpdated.value = true;
    router.push({ name: 'user-list' });
  }
  loader.value = false;
});

onBeforeRouteLeave(async () => {
  if (isUpdated.value) return true;
  const result = await Swal.fire({
    title: 'Confirmation',
    text: 'Your changes have not been saved. Are you sure you want to leave this page?',
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
  max-width: 800px;
  margin: 0 auto;
}
.description {
  font-size: 14px;
  height: 200px;
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
}
</style>

