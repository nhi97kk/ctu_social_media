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
        style="width: 300px"
        class="infoForm authForm shadow-lg border border-info"
        @submit="handleSubmit"
        :validation-schema="userFormSchema"
      >
        <h3>Log In</h3>

        <div class="d-flex flex-column align-items-start mb-3">
          <Field
            type="email"
            placeholder="Email"
            class="infoInput w-100"
            name="email"
            v-model="user.email"
          />
          <ErrorMessage name="email" class="error-feedback"></ErrorMessage>
        </div>
        <div class="d-flex flex-column align-items-start mb-3">
          <Field
            type="password"
            placeholder="Password"
            class="infoInput w-100"
            name="password"
            v-model="user.password"
          />
          <ErrorMessage name="password" class="error-feedback"></ErrorMessage>
        </div>
        <div class="text-center mb-3">
          <router-link to="/signup">
            <span style="font-size: 13px; cursor: pointer; color: blue"
              >Not have an account? Sign Up.</span
            >
          </router-link>
        </div>
        <button
          class="btn btn-outline-dark btn-md button infoButton"
          type="submit"
          :disabled="loading"
        >
          {{ loading ? "Loading..." : "Log In" }}
        </button>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/user";
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useRouter } from "vue-router";
import { ref, onBeforeMount } from "vue";

const loading = ref(false);
const store = useUserStore();
const router = useRouter();
const user = ref({
  email: "",
  password: "",
});

const userFormSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required!")
    .email("Invalid email format!"),
  password: yup
    .string()
    .trim()
    .required("Password is required!")
    .min("8", "Password must be at least 8 characters long!")
    .max("16", "Password cannot be more than 16 characters long!"),
});

async function handleSubmit() {
  loading.value = true;
  await store.login(user.value);

  if (store.isAuth) router.push({ name: "home-page" });
  loading.value = false;
}

onBeforeMount(() => {
  if (store.isAuth) router.push({ name: "home-page" });
});
</script>

<style scoped>
@import "../style/auth.css";
</style>
