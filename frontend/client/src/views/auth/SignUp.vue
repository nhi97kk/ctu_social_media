<template>
  <div class="Auth">
    <!-- Left side -->
    <div class="a-left">
      <img src="../../assets/img/icons/logo-ctu.png" alt="" />
      <div class="Webname">
        <h1>Social Media</h1>
        <h6>Explore the ideas throughout the world</h6>
      </div>
    </div>
    <!-- Right side -->
    <div class="a-right">
      <Form
        class="infoForm authForm shadow-lg border border-info"
        @submit="onSubmit"
        :validation-schema="userFormSchema"
      >
        <h3>Sign Up</h3>
        <div class="d-flex flex-column align-items-start mb-3">
          <Field
            type="text"
            name="email"
            id="email"
            class="infoInput w-100"
            v-model="user.email"
            placeholder="Email"
          />
          <ErrorMessage name="email" class="error-feedback"></ErrorMessage>
        </div>

        <div class="d-flex justify-content-between align-items-start">
          <div class="d-flex flex-column align-items-start mb-3 w-45">
            <Field
              type="password"
              name="password"
              id="password"
              class="infoInput w-100"
              v-model="user.password"
              placeholder="Password"
            />
            <ErrorMessage name="password" class="error-feedback"></ErrorMessage>
          </div>
          <div class="d-flex flex-column align-items-start mb-3 w-45">
            <Field
              type="password"
              name="confirmPassword"
              id="confirm-password"
              class="infoInput w-100 pe-5"
              v-model="user.confirmPassword"
              placeholder="Password Confirm"
            />

            <ErrorMessage
              name="confirmPassword"
              class="error-feedback"
            ></ErrorMessage>
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-start">
          <div class="d-flex flex-column align-items-start mb-3 w-45">
            <Field
              type="text"
              name="name"
              id="name"
              class="infoInput w-100"
              v-model="user.name"
              placeholder="User Name"
            />
            <ErrorMessage name="name" class="error-feedback"></ErrorMessage>
          </div>

          <div class="d-flex flex-column align-items-start mb-3 w-45">
            <Field
              as="select"
              name="gender"
              id="gender"
              class="infoInput w-100"
              v-model="user.gender"
            >
              <option value="" selected>-- Gender --</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Field>
            <ErrorMessage name="gender" class="error-feedback"></ErrorMessage>
          </div>
        </div>

        <div class="d-flex flex-column align-items-start mb-3">
          <!-- <label for="major" class="form-label">Major: </label> -->
          <Field
            as="select"
            name="major"
            id="major"
            class="infoInput w-100"
            v-model="user.major"
          >
            <option value="">-- Major --</option>
            <option v-for="major in majors" :value="major._id">
              {{ major.name }} ({{ major.college }})
            </option>
          </Field>

          <ErrorMessage name="major" class="error-feedback"></ErrorMessage>
        </div>

        <div class="text-center mb-3">
          <router-link to="/login">
            <span style="font-size: 13px; cursor: pointer; color: blue"
              >Have an account? Sign In.</span
            >
          </router-link>
        </div>
        <div class="d-flex flex-column align-items-start">
          <button
            class="btn btn-outline-dark btn-md button infoButton"
            type="submit"
            :disabled="loading"
          >
            Sign Up
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
import { ref, onBeforeMount } from "vue";
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useRouter } from "vue-router";
import majorService from "@/services/major.service";
import userService from "@/services/user.service";
import { useUserStore } from "@/stores/user";
import Swal from "sweetalert2";

const router = useRouter();
const loading = ref(false);
const majors = ref({});
const user = ref({
  email: "",
  password: "",
  name: "",
  major: "",
  gender: "",
  confirmPassword: "",
});
const store = useUserStore();

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
    .max("20", "User name be more than 20 characters long!"),
  password: yup
    .string()
    .trim()
    .required("Password is required!")
    .min("8", "Password must be at least 8 characters long!")
    .max("16", "Password cannot be more than 16 characters long!"),
  major: yup.string().required("Major is required!"),
  gender: yup.string().required("Gender is required!"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords do not match!"),
});

async function onSubmit() {
  loading.value = true;

  const response = await userService.register(user.value);

  if (response.status === "success") {
    await Swal.fire({
      title: "Success",
      text: response.message,
      icon: "success",
    });
    router.push({ name: "login-page" });
  } else {
    await Swal.fire({
      title: "Fail",
      text: response.message,
      icon: "error",
    });
  }

  loading.value = false;
}

// Same as JS run before Onload event (When onload occur: use onMouted)
// Mặc dù hook này được dùng để lấy dữ liệu cho việc render lần đầu, nhưng nhờ tính reactivity của Vue nên nếu dữ liệu DB thay đổi sẽ tự động cập nhật lại options sau render
onBeforeMount(async () => {
  if (store.isAuth) router.push({ name: "home-page" });

  const response = await majorService.getAllMajors();

  if (response.status === "success") {
    majors.value = response.data.majors;
  }
});
</script>

<style scoped>
@import "../style/auth.css";
</style>
