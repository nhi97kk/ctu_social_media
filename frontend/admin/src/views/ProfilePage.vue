<template>
  <div class="profile my-5">
    <Form class="form" :validation-schema="userFormSchema">
      <legend class="form-title">Admin Information</legend>

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
        <label for="name" class="form-label">Name: </label>
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
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </Field>
        <ErrorMessage name="gender" class="error-feedback"></ErrorMessage>
      </div>

      <div class="mb-3 form-group">
        <div class="d-flex justify-content-between">
          <label class="form-label font-weight-bold">Avatar: </label>
          <label for="avatar" class="form-label" style="cursor: pointer">
            <a class="text-primary">Chose new avatar</a>
          </label>

          <input
            hidden
            type="file"
            name="avatar"
            id="avatar"
            class="form-control"
            multiple
            accept="image/*"
            @change="onAvatarChange"
          />
        </div>

        <div class="d-flex justify-content-center">
          <img
            class="rounded-circle"
            style="width: 120px; height: 120px; object-fit: cover"
            :src="avatar ? avatar : user.avatar"
            alt="Avatar"
          />
        </div>
      </div>

      <div class="mb-3 form-group">
        <div class="d-flex justify-content-between">
          <label class="form-label font-weight-bold">Cover image: </label>
          <label for="cover" class="form-label" style="cursor: pointer">
            <a class="text-primary">Chose new cover image</a>
          </label>

          <input
            hidden
            type="file"
            name="cover"
            id="cover"
            class="form-control"
            multiple
            accept="image/*"
            @change="onCoverChange"
          />
        </div>
        <div class="d-flex justify-content-center">
          <img
            class="img-fluid rounded"
            style="max-height: 200px; object-fit: cover; width: 70%"
            :src="cover ? cover : user.coverImage"
            alt="Cover image"
          />
        </div>
      </div>

      <div class="mb-3 form-group text-center">
        <button
          class="btn btn-warning btn-md text-white"
          :disabled="loading"
          @click="onSubmit"
        >
          {{ canChange ? 'Save' : 'Update' }}
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
            v-if="loading"
          ></span>
        </button>
        <button
          type="button"
          class="btn btn-outline-danger btn-md ms-3"
          @click="onCancel"
          v-if="canChange"
        >
          Cancel
        </button>
      </div>
    </Form>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onBeforeMount } from 'vue';
import userService from '@/services/user.service.js';
import majorService from '@/services/major.service';
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { useToast } from 'vue-toast-notification';

const $toast = useToast();
const router = useRouter();
const loading = ref(false);
const canChange = ref(false);
const majors = ref({});
const user = ref({
  email: '',
  password: '',
  name: '',
  major: '',
  gender: '',
  active: true,
});
const avatar = ref(null);
const cover = ref(null);
const formDataAvatar = ref(null);
const formDataCover = ref(null);

function onAvatarChange(e) {
  formDataAvatar.value = new FormData();
  formDataAvatar.value.append('avatar-user', e.target.files[0]);
  avatar.value = URL.createObjectURL(e.target.files[0]);
}

function onCoverChange(e) {
  formDataCover.value = new FormData();
  formDataCover.value.append('cover-user', e.target.files[0]);
  cover.value = URL.createObjectURL(e.target.files[0]);
}

const userFormSchema = yup.object({
  email: yup.string().required('Email is requied!').email('Invalid email!'),
  name: yup.string().required('Name is requied!'),
  password: yup.string().min('8', 'Password must have at least 8 letters.'),
  major: yup.string().required('Major is requied!'),
  gender: yup.string().required('Gender is requied!'),
  active: yup.boolean('Invalid active!'),
});

async function onChangeImage() {
  if (formDataAvatar.value != null) {
    try {
      const res = await userService.uploadAvatar(
        user.value._id,
        formDataAvatar.value,
      );
      if (res.status === 'success') {
        $toast.success('Upload avatar success!', {
          position: 'top-right',
        });
      }
    } catch (error) {
      $toast.error('Occur error! Try again later.', {
        position: 'top-right',
      });
    }
  }

  if (formDataCover.value != null) {
    try {
      const res = await userService.uploadCover(
        user.value._id,
        formDataCover.value,
      );
      if (res.status === 'success') {
        $toast.success('Upload cover image success!', {
          position: 'top-right',
        });
      }
    } catch (error) {
      $toast.error('Occur error! Try again later.', {
        position: 'top-right',
      });
    }
  }

  avatar.value = null;
  cover.value = null;
}

async function onSubmit(e) {
  e.preventDefault();

  if (!canChange.value) {
    canChange.value = true;
    return;
  }

  const result = await Swal.fire({
    title: 'Confirmation',
    text: 'Are you sure you want to update your information.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'Continue editing',
    reverseButtons: false,
  });

  if (!result.isConfirmed) {
    return;
  }

  loading.value = true;

  const response = await userService.updateMe(user.value);

  if (response.status !== 'success') {
    $toast.error('An error occurred! Please try again later.', {
      position: 'top-right',
    });
    return;
  }

  const res = await onChangeImage();
  await refreshData();
  $toast.success(`Information updated successfully!`, {
    position: 'top-right',
  });

  loading.value = false;
  canChange.value = false;
}

async function onCancel() {
  const result = await Swal.fire({
    title: 'Are you sure you want to cancel?',
    text: 'Any changes will not be applied.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Cancel',
    cancelButtonText: 'Continue editing',
    reverseButtons: false,
  });

  if (result.isConfirmed) {
    await refreshData();
    canChange.value = false;
  }
}

async function refreshData() {
  const response = await userService.getMe();

  if (response.status !== 'success') {
    $toast.error('An error occurred! Please try again later.', {
      position: 'top-right',
    });
    router.push({ name: 'home-page' });
    return;
  }

  user.value = response.data.user;

  user.value.major = response.data.user.major._id;

  const responsee = await majorService.getAllMajors();

  if (responsee.status === 'success') {
    majors.value = responsee.data.majors;
  }
}

onBeforeMount(async () => {
  refreshData();
});
</script>

<style scoped>
input:disabled,
select:disabled {
  background-color: #fff;
  border-radius: 0;
  border: 1px solid #fff;
  padding-left: 25px;
  transition: all 0.3s ease-in-out;
}

.profile {
  border: 1px solid #ccc;
  margin: auto;
  max-width: 600px;
  padding: 10px;
}
</style>

