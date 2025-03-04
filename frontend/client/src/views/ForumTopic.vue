<template>
  <!-- loader -->
  <loader v-if="loader"></loader>

  <!-- content  -->
  <div v-else>
    <div class="container py-2" style="margin-top: 4rem; min-height: 90vh">
      <!-- present discussion -->
      <div class="bg-white p-2 rounded mb-4 shadow border border-secondary">
        <ul class="breadcrumb">
          <li class="breadcrumb-item">
            <a href="#" @click="$router.push({ name: 'forum' })"
              >Discussion Academic</a
            >
          </li>
          <li class="breadcrumb-item active">{{ topic.name }}</li>
        </ul>

        <!-- filter option  -->
        <div class="d-flex justify-content-between align-items-center">
          <h2>{{ topic.name }}</h2>
          <div class="d-flex">
            <button
              class="btn btn-success text-white mr-3"
              data-toggle="modal"
              data-target="#myModal"
            >
              Ask a question
            </button>
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
                <!-- <a class="dropdown-item" href="#" @click="addSort('likes')"
                  >Most Likes</a
                > -->
                <a class="dropdown-item" href="#" @click="addSort('views')"
                  >Most views</a
                >
              </div>
            </div>
          </div>
        </div>
        <p class="text-secondary mb-4 w-75">{{ topic.desc }}</p>

        <topic-content :topic="topic" :sort="sort"></topic-content>
      </div>
    </div>
    <!-- modal -->
    <div class="modal" id="myModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title text-center">Ask a question</h4>
            <button type="button" class="close" data-dismiss="modal">
              &times;
            </button>
          </div>

          <!-- Modal Body -->
          <div class="container px-5 py-3">
            <Form
              class="form"
              @submit="onSubmit"
              :validation-schema="questionFormSchema"
            >
              <!-- question title -->
              <div class="mb-3 form-group">
                <label for="title" class="form-label">Title: </label>
                <Field
                  type="text"
                  name="title"
                  id="title"
                  class="form-control"
                  v-model="question.title"
                />
                <ErrorMessage
                  name="title"
                  class="error-feedback"
                ></ErrorMessage>
              </div>

              <!-- Body -->
              <div class="mb-3 form-group">
                <label for="body" class="form-label">Body: </label>
                <Field
                  type="text"
                  name="body"
                  id="body"
                  class="form-control"
                  v-model="question.body"
                />
                <ErrorMessage name="body" class="error-feedback"></ErrorMessage>
              </div>

              <!-- Image List -->
              <div class="mb-3 form-group">
                <label class="form-label">Images: </label>
                <ImageList
                  :images="images"
                  @remove="removeImage"
                  :can-remove="true"
                />
              </div>

              <!-- Upload Images -->
              <div class="mb-3 form-group">
                <label
                  for="images"
                  class="form-label text-primary font-weight-bold p-1 border border-primary rounded btn-hover"
                  >Add Image
                </label>
                <input
                  hidden
                  type="file"
                  name="images"
                  id="images"
                  class="form-control"
                  multiple
                  accept="image/*"
                  @change="onImagesChange"
                />
              </div>

              <!-- Submit Button -->
              <div class="mb-3 form-group">
                <button
                  class="btn btn-warning text-white"
                  type="submit"
                  :disabled="loading"
                >
                  Create
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
import ImageList from "@/components/product/ImageList.vue";
import TopicContent from "@/components/forum/TopicContent.vue";

import userService from "@/services/user.service.js";
import topicService from "@/services/topic.service.js";
import questionService from "@/services/question.service.js";

import { ref, onBeforeMount, provide } from "vue";
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import $ from "jquery";

const $toast = useToast();
const route = useRoute();
const router = useRouter();
const user = ref({});
const topic = ref(null);
const loader = ref(true);
const question = ref({
  title: "",
  body: "",
  topic: "",
});
const images = ref([]);
const loading = ref(false);
const formData = ref(new FormData()); // Để chứa dữ liệu ảnh khi tải lên
const sort = ref("recent");

function addSort(newSort) {
  sort.value = newSort;
}
// Schema validation
const questionFormSchema = yup.object({
  title: yup.string().trim().required("Title is required").min(5).max(100),
  body: yup.string().trim().required("Body is required").min(5).max(500),
});

// Handle image change (preview images before submitting)
function onImagesChange(e) {
  for (let i = 0; i < e.target.files.length; i++) {
    const file = e.target.files[i];
    images.value.push(file); // Add to images array for preview
    formData.value.append("forum", file);
  }
  // Clear input file sau khi thêm hình ảnh
  e.target.value = null;
}

// Remove an image
function removeImage(index) {
  images.value.splice(index, 1);
  // Xóa hình ảnh khỏi FormData
  const newFormData = new FormData();
  images.value.forEach((image) => {
    if (typeof image !== "string") {
      newFormData.append("forum", image);
    }
  });
  formData.value = newFormData;
}

// Submit the form to create a new product
async function onSubmit() {
  // Check if images are selected
  if (images.value.length === 0) {
    $toast.error("Please upload at least one image.", {
      position: "top-right",
    });
    return;
  }

  // Prepare form data and submit
  loading.value = true;
  const response = await questionService.createQuestion(question.value);

  if (response.status !== "success") {
    $toast.error("Error occur! Try again later...", {
      position: "top-right",
    });
    loading.value = false;
    return;
  }

  if (response.status === "success") {
    //  Add new image
    await questionService.createQuestionImages(
      response.data.question._id,
      formData.value
    );

    $toast.success("Create question successfully!", {
      position: "top-right",
    });

    // Reset form
    question.value = {
      title: "",
      body: "",
    };
    // Reset modal data
    images.value = []; // Xóa URL ảnh
    formData.value = new FormData(); // Xóa dữ liệu ảnh
    $("#myModal").modal("hide");
  } else {
    $toast.error("Error occur! Try again later...", {
      position: "top-right",
    });
  }

  loading.value = false;
}

async function refresh() {
  const res = await userService.getMe();
  const response = await topicService.getTopic(route.params.topicId);

  if (res.status !== "success" || response.status !== "success") {
    $toast.error(res.message || "Error occurred! Please try again later...", {
      position: "top-right",
    });
    router.push({ name: "home-page" });
    return;
  } else {
    user.value = res.data.user;
    topic.value = response.data.topic;
    question.value.topic = topic.value._id;
  }

  loader.value = false;
}

onBeforeMount(async () => {
  await refresh();
});

provide("user", user);
</script>
