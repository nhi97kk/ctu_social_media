<template>
  <div>
    <div class="container mt-3">
      <router-link :to="{ name: 'user-list' }">
        <i class="fa-solid fa-arrow-left-long"></i> All Users
      </router-link>
    </div>
    <div class="container p-5">
      <Form
        class="form p-3 border border-secondary rounded"
        @submit="onSubmit"
        :validation-schema="userFormSchema"
      >
        <legend class="form-title">New Account</legend>
        <div class="mb-3 form-group">
          <label for="email" class="form-label">Email: </label>
          <Field
            type="text"
            name="email"
            id="email"
            class="form-control"
            v-model="user.email"
          />
          <ErrorMessage name="email" class="error-feedback"></ErrorMessage>
        </div>
        <div class="mb-3 form-group">
          <label for="password" class="form-label">Password: </label>
          <Field
            type="text"
            name="password"
            id="password"
            class="form-control"
            v-model="user.password"
          />
          <ErrorMessage name="password" class="error-feedback"></ErrorMessage>
        </div>
        <div class="mb-3 form-group">
          <label for="name" class="form-label">User Name: </label>
          <Field
            type="text"
            name="name"
            id="name"
            class="form-control"
            v-model="user.name"
          />
          <ErrorMessage name="name" class="error-feedback"></ErrorMessage>
        </div>

        <div class="mb-3 form-group">
          <label for="major" class="form-label">Major: </label>
          <Field
            as="select"
            name="major"
            id="major"
            class="form-control"
            v-model="user.major"
          >
            <option v-for="major in majors" :value="major._id">
              {{ major.name }} ({{ major.college }})
            </option>
          </Field>

          <ErrorMessage name="major" class="error-feedback"></ErrorMessage>
        </div>

        <div class="mb-3 form-group">
          <label for="gender" class="form-label">Gender: </label>
          <Field
            as="select"
            name="gender"
            id="gender"
            class="form-control"
            v-model="user.gender"
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </Field>
          <ErrorMessage name="gender" class="error-feedback"></ErrorMessage>
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
              <input type="checkbox" name="active" v-model="user.active" />
              Active
            </label>
          </Field>
          <ErrorMessage name="is-active" class="error-feedback"></ErrorMessage>
        </div>

        <div class="mb-3 form-group">
          <button
            class="btn btn-success btn-md w-100"
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
import userService from '@/services/user.service';
import majorService from '@/services/major.service';

import '@/assets/css/form.css';

import { ref, onBeforeMount } from 'vue';
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import Swal from 'sweetalert2';
import { useToast } from 'vue-toast-notification';

const $toast = useToast();
const router = useRouter();
const isAdd = ref(false);
const loading = ref(false);
const majors = ref({});
const user = ref({
  email: '',
  password: '',
  name: '',
  major: '',
  gender: '',
  role: 'user',
  active: true,
});

const userFormSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  name: yup
    .string()
    .required('Name is required')
    .max('20', 'User name be more than 20 characters long!'),
  password: yup.string().min(8, 'Password must be at least 8 characters long'),
  major: yup.string().required('Major is required'),
  gender: yup.string().required('Gender is required'),
  role: yup.string().required('Role is required'),
  active: yup.boolean('Invalid active status'),
});

async function onSubmit() {
  const result = await Swal.fire({
    title: 'Confirmation',
    text: 'Are you sure you want to add this account?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Continue editing',
    reverseButtons: false,
  });

  if (!result.isConfirmed) {
    return;
  }

  loading.value = true;
  user.value.confirmPassword = user.value.password;

  // Update user
  const response = await userService.createUser(user.value);

  if (response.status === 'User added successfully!') {
    $toast.success(`success!`, {
      position: 'top-right',
    });
    isAdd.value = true;
    router.push({ name: 'user-list' });
  } else {
    $toast.error(
      response.message || 'An error occurred! Please try again later.',
      {
        position: 'top-right',
      },
    );
  }

  loading.value = false;
}

onBeforeMount(async () => {
  const response = await majorService.getAllMajors();

  if (response.status === 'success') {
    majors.value = response.data.majors;
  }
});

onBeforeRouteLeave(async () => {
  if (isAdd.value) return true;
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
</style>

