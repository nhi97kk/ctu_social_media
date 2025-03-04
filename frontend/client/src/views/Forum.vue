<template>
  <!-- loader -->
  <loader v-if="loader"></loader>

  <!-- content  -->
  <div v-else>
    <div class="container py-1" style="margin-top: 4rem">
      <h2 class="w-100 text-info text-center">Discussion Academic</h2>
      <h3 class="text-secondary text-center font-italic font-weight-light">
        Topics about your knowledge
      </h3>
      <div class="p-2 mb-2 d-flex">
        <ForumFilter></ForumFilter>
        <button
          v-show="user.role == 'teacher'"
          class="btn btn-success ml-3 text-white shadow border border-white"
          data-toggle="modal"
          data-target="#myModal"
        >
          Create Topic
        </button>
      </div>

      <!-- list topic -->
      <div class="row">
        <p v-if="topics.length == 0" class="my-3 text-white text-center w-100">
          No topic available...
        </p>
        <topic-card
          v-else
          v-for="topic in topics"
          :topic="topic"
          :key="topic._id"
        ></topic-card>
      </div>

      <!-- present discussion -->
      <div class="bg-white p-2 rounded mb-4 shadow border border-secondary">
        <!-- filter option  -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2>Recent Discussions</h2>
          <div class="d-flex">
            <div class="dropdown" key="2">
              <button
                type="button"
                class="btn btn-outline-dark dropdown-toggle"
                data-toggle="dropdown"
              >
                Sort By
              </button>
              <div class="dropdown-menu">
                <a class="dropdown-item" href="#" @click="addSort('recent')"
                  >Most Recent</a
                >
                <a class="dropdown-item" href="#" @click="addSort('likes')"
                  >Most Likes</a
                >
                <a class="dropdown-item" href="#" @click="addSort('views')"
                  >Most views</a
                >
              </div>
            </div>
          </div>
        </div>

        <topic-content :topic="null" :sort="sort"></topic-content>
      </div>
    </div>
    <div class="modal" id="myModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title text-center">Create New Topic</h4>
            <button type="button" class="close" data-dismiss="modal">
              &times;
            </button>
          </div>

          <!-- Modal Body -->
          <div class="container px-5 py-3">
            <Form
              class="form"
              @submit="onSubmit"
              :validation-schema="topicFormSchema"
            >
              <!-- Topic Name -->
              <div class="mb-3 form-group">
                <label for="name" class="form-label">Topic name: </label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  class="form-control"
                  v-model="data.name"
                />
                <ErrorMessage name="name" class="error-feedback"></ErrorMessage>
              </div>

              <!-- Descs -->
              <div class="mb-3 form-group">
                <label for="desc" class="form-label">Topic description: </label>
                <Field
                  type="text"
                  name="desc"
                  id="desc"
                  class="form-control"
                  v-model="data.desc"
                />
                <ErrorMessage name="desc" class="error-feedback"></ErrorMessage>
              </div>

              <!-- Submit Button -->
              <div class="mb-3 form-group">
                <button
                  class="btn btn-warning text-white"
                  type="submit"
                  :disabled="loading"
                >
                  Create Topic
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
      </div>
    </div>
  </div>
</template>
<script setup>
import Loader from "@/components/Loader.vue";
import TopicCard from "@/components/forum/TopicCard.vue";
import TopicContent from "@/components/forum/TopicContent.vue";
import ForumFilter from "@/components/forum/ForumFilter.vue";

import userService from "@/services/user.service.js";
import topicService from "@/services/topic.service.js";

import { ref, onBeforeMount, provide } from "vue";
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toast-notification";
import $ from "jquery";

const $toast = useToast();
const route = useRoute();
const router = useRouter();
const user = ref({});
const topics = ref([]);
const loader = ref(true);
const data = ref({
  name: "",
  desc: "",
});
const loading = ref(false);
const sort = ref("recent");

function addSort(newSort) {
  sort.value = newSort;
}
// Schema validation
const topicFormSchema = yup.object({
  name: yup.string().trim().required("Topic name is required.").min(5).max(200),
  desc: yup
    .string()
    .trim()
    .required("Topic description is required.")
    .min(5)
    .max(200),
});

async function onSubmit() {
  const result = await Swal.fire({
    title: "Cofirm",
    text: "Are you sure to add this topic?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Cofirm",
    cancelButtonText: "Cancle",
  });

  if (!result.isConfirmed) return;

  loading.value = true;

  const res = await topicService.createTopic(data.value);

  if (res.status !== "success") {
    $toast.error(res.message || "Error occur! Try again later...", {
      position: "top-right",
    });
    loading.value = false;
    return;
  } else {
    $toast.success("Create topic successfully!", {
      position: "top-right",
    });

    await refresh();
    // Reset modal data
    data.value.desc = "";
    data.value.name = "";
    $("#myModal").modal("hide");
  }

  loading.value = false;
}

async function refresh() {
  const res = await userService.getMe();

  if (res.status !== "success") {
    $toast.error(res.message || "Error occurred! Please try again later...", {
      position: "top-right",
    });
    router.push({ name: "home-page" });
    return;
  } else {
    user.value = res.data.user;
  }

  const response = await topicService.getAllTopics();
  if (response.status == "success") {
    topics.value = response.data.topics;
  }

  loader.value = false;
}

onBeforeMount(async () => {
  await refresh();
});

provide("user", user);
</script>
