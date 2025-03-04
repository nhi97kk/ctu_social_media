<template>
  <div class="profile rounded" style="margin-top: 4rem; height: 90vh">
    <Form class="form" :validation-schema="userFormSchema">
      <legend class="form-title text-center">Update your profile</legend>

      <div class="mb-3 form-group">
        <label for="email" class="form-label">
          <i class="fa-regular fa-envelope mr-2 text-success"></i>
          Email:
        </label>
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
        <label for="name" class="form-label">
          <i class="fa-solid fa-signature mr-2 text-info"></i>
          User Name:
        </label>
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
        <label for="major" class="form-label">
          <i class="fa-solid fa-book-open-reader mr-2 text-info"></i>
          Major:
        </label>
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
        <label for="gender" class="form-label">
          <i class="fa-solid fa-venus-mars mr-2 text-danger"></i>
          Gender:
        </label>
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
        <label for="name" class="form-label">
          <i class="fa-solid fa-signature mr-2 text-info"></i>
          Password:
        </label>
        <div class="d-flex justify-content-between">
          <div>
            <Field
              type="password"
              name="oldPassword"
              id="oldPassword"
              class="form-control"
              placeholder="Current password"
              v-model="oldPassword"
            />
          </div>
          <div>
            <Field
              type="password"
              name="password"
              id="password"
              class="form-control"
              placeholder="New password"
              v-model="password"
            />
          </div>
          <button
            :disabled="!(password.trim() && oldPassword.trim())"
            @click="changPass"
            class="btn btn-outline-danger shadow"
          >
            Change
          </button>
        </div>
      </div>

      <div class="mb-3 form-group d-flex justify-content-between">
        <button
          class="btn btn-success text-white border border-white shadow"
          @click="() => $router.push({ name: 'me-page' })"
        >
          Back
        </button>
        <button
          class="btn btn-warning text-white border border-white shadow"
          :disabled="loading"
          @click="onSubmit"
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
</template>

<script setup>
import userService from "@/services/user.service.js";
import majorService from "@/services/major.service";

import { useRouter } from "vue-router";
import { ref, onBeforeMount } from "vue";
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import Swal from "sweetalert2";
import { useToast } from "vue-toast-notification";

const $toast = useToast();
const router = useRouter();
const loading = ref(false);
const majors = ref({});
const user = ref({
  email: "",
  name: "",
  major: "",
  gender: "",
});

const oldPassword = ref("");
const password = ref("");
const confirmPassword = ref("");

async function changPass(e) {
  // Ngừng sự kiện mặc định nếu có
  e.preventDefault();
  if (!(oldPassword.value.trim() || password.value.trim())) {
    return;
  }

  const result = await Swal.fire({
    title: "Confirmation",
    text: "Are you sure you want to update your password?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Continue editing",
    reverseButtons: false,
  });

  if (!result.isConfirmed) {
    return;
  }

  confirmPassword.value = password.value;
  const response = await userService.updatePass({
    oldPassword: oldPassword.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
  });

  if (response.status !== "success") {
    $toast.error(
      response.message || "An error occurred! Please try again later.",
      {
        position: "top-right",
      }
    );
    return;
  }

  $toast.success(`Update password successfully.`, {
    position: "top-right",
  });
  oldPassword.value = "";
  password.value = "";
}

const userFormSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required!")
    .email("Invalid email format!"),
  name: yup
    .string()
    .trim()
    .required("User name is required!")
    .max("20", "User name must be less than 20 letters."),
  major: yup.string().required("Major is required!"),
  gender: yup.string().required("Gender is required!"),
});

async function onSubmit(e) {
  // Ngừng sự kiện mặc định nếu có
  e.preventDefault();

  const result = await Swal.fire({
    title: "Confirmation",
    text: "Are you sure you want to update your information?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Continue editing",
    reverseButtons: false,
  });

  if (!result.isConfirmed) {
    return;
  }

  loading.value = true;

  const response = await userService.updateMe(user.value);

  if (response.status !== "success") {
    $toast.error(
      response.message || "An error occurred! Please try again later.",
      {
        position: "top-right",
      }
    );
    loading.value = false;

    return;
  }

  $toast.success(`Update information successfully.`, {
    position: "top-right",
  });

  loading.value = false;
  router.push({ name: "me-page" });
}

async function refreshData() {
  const response = await userService.getMe();

  if (response.status !== "success") {
    $toast.error("An error occurred! Please try again later.", {
      position: "top-right",
    });
    router.push({ name: "me-page" });
    return;
  }

  user.value = response.data.user;
  // console.log(user.value);

  user.value.major = response.data.user.major._id;

  const responsee = await majorService.getAllMajors();

  if (responsee.status === "success") {
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
  background-color: white;
  color: black;
  margin: auto;
  max-width: 600px;
  padding: 10px;
}
label {
  font-weight: bold;
}
.error-feedback {
  color: red;
}
</style>
