<template>
  <div class="d-flex flex-start flex-column p-2">
    <div
      data-toggle="modal"
      data-target="#myModaltoCreatePage"
      class="d-flex justify-content-center align-items-center p-2 rounded-lg bg-success text-white my-4 btn-hover"
      style="width: fit-content"
    >
      <i class="fa-solid fa-plus mr-2"></i>
      <span>Create a page</span>
    </div>
    <h4 class="text-color">Your pages</h4>
    <div class="row">
      <div v-if="pages.length == 0" class="text-color text-center py-3">
        <span>You not have any page.</span>
      </div>
      <div
        v-else
        v-for="page in pages"
        :key="page._id"
        class="col-6 d-flex p-2"
      >
        <div
          class="d-flex align-items-center rounded-lg bg-white shadow border border-info p-2"
        >
          <div>
            <img
              :src="page.avatar"
              alt=""
              style="width: 150px; height: 150px; object-fit: cover"
              class="rounded-circle shadow border border-info"
            />
          </div>
          <div class="d-flex flex-column ml-4">
            <h4 class="btn-hover">{{ page.name }}</h4>
            <span
              ><i class="fa-solid fa-calendar-check text-primary mr-2"></i>
              {{ page.followers.length }} Follow</span
            >

            <div class="d-flex">
              <button
                v-if="page.status === 'approved'"
                @click="
                  $router.push({ name: 'page', params: { id: page._id } })
                "
                class="btn btn-info d-flex align-items-center my-3 fit-content mr-3"
              >
                <i class="fa-solid fa-user-tie mr-2"></i>
                <span>Go to Page</span>
              </button>
              <span
                v-else
                class="p-2 rounded-lg text-white my-3 mr-2"
                :class="page.status === 'pending' ? 'bg-danger' : 'bg-warning'"
                >{{ page.status }}</span
              >

              <button
                @click="submitDelete(page._id)"
                class="btn btn-outline-danger d-flex align-items-center my-3 fit-content"
              >
                <i class="fa-solid fa-trash mr-2"></i>
                <span>Delete Page</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- The Modal -->
  <div class="modal" id="myModaltoCreatePage">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title text-center">Create page</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="view view-post-container smaller-margin">
          <div class="view-post p-4">
            <Form
              class="form"
              @submit="onSubmit"
              :validation-schema="pageFormSchema"
            >
              <div class="mb-3 form-group">
                <label for="name" class="form-label">Page name: </label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  class="form-control"
                  placeholder="Type your page name"
                  v-model="data.name"
                />
                <ErrorMessage name="name" class="error-feedback"></ErrorMessage>
              </div>
              <div class="mb-3 form-group">
                <label for="desc" class="form-label">Page description: </label>
                <Field
                  as="textarea"
                  rows="4"
                  type="text"
                  name="desc"
                  id="desc"
                  class="form-control"
                  placeholder="What's your page about?"
                  v-model="data.desc"
                />
                <ErrorMessage name="desc" class="error-feedback"></ErrorMessage>
              </div>
              <div class="mb-4 form-group">
                <div class="d-flex justify-content-between">
                  <label class="form-label font-weight-bold">Avatar: </label>
                  <label
                    for="avatar-page"
                    class="form-label"
                    style="cursor: pointer"
                  >
                    <a class="nav-link">Chose photo</a>
                  </label>
                  <input
                    hidden
                    type="file"
                    name="avatar-page"
                    id="avatar-page"
                    class="form-control"
                    multiple
                    accept="image/*"
                    @change="onAvatarChange"
                  />
                </div>
                <div class="row justify-content-center">
                  <div v-if="avatar">
                    <img
                      class="rounded-circle"
                      style="height: 150px; width: 150px; object-fit: cover"
                      :src="avatar"
                      alt="images"
                    />
                  </div>
                  <div
                    v-else
                    class="rounded-circle d-flex justify-content-center align-items-center bg-secondary"
                    style="height: 150px; width: 150px"
                  >
                    <i class="fa-solid fa-image" style="font-size: 5rem"></i>
                  </div>
                </div>
              </div>
              <div class="mb-4 form-group">
                <div class="d-flex justify-content-between">
                  <label class="form-label font-weight-bold"
                    >Cover image:
                  </label>
                  <label
                    for="cover-page"
                    class="form-label"
                    style="cursor: pointer"
                  >
                    <a class="nav-link">Chose photo</a>
                  </label>
                  <input
                    hidden
                    type="file"
                    name="cover-page"
                    id="cover-page"
                    class="form-control"
                    multiple
                    accept="image/*"
                    @change="onCoverChange"
                  />
                </div>
                <div class="row justify-content-center">
                  <div v-if="cover" class="col-10">
                    <img
                      class="rounded w-100"
                      style="height: 200px; object-fit: cover"
                      :src="cover"
                      alt="images"
                    />
                  </div>
                  <div
                    v-else
                    class="col-10 rounded w-100 d-flex justify-content-center align-items-center bg-secondary"
                    style="height: 200px"
                  >
                    <i class="fa-solid fa-image" style="font-size: 5rem"></i>
                  </div>
                </div>
              </div>
              <div class="form-group text-center">
                <button
                  class="btn btn-warning"
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
import pageService from "@/services/page.service.js";

import { ref, onBeforeMount, computed, inject } from "vue";
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import $ from "jquery";

const $toast = useToast();
const user = inject("user");
const pages = ref([]);
const avatar = ref(null);
const cover = ref(null);
const formDataAvatar = ref(null);
const formDataCover = ref(null);
const loading = ref(false);
const data = ref({
  name: "",
  desc: "",
});

const pageFormSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Page name is requied!")
    .min(5, "Page name must have at least 5 letters.")
    .max(50, "Page name must be less than 50 letters."),
  desc: yup
    .string()
    .trim()
    .required("Page description is requied!")
    .min(5, "Page description must have at least 5 letters.")
    .max(200, "Page description must be less than 100 letters."),
});

function onAvatarChange(e) {
  formDataAvatar.value = new FormData();
  formDataAvatar.value.append("avatar-page", e.target.files[0]);
  avatar.value = URL.createObjectURL(e.target.files[0]);
}

function onCoverChange(e) {
  formDataCover.value = new FormData();
  formDataCover.value.append("cover-page", e.target.files[0]);
  cover.value = URL.createObjectURL(e.target.files[0]);
}

async function onSubmit() {
  if (formDataAvatar.value === null || formDataCover === null) {
    $toast.error("You must upload both avatar and cover image for your page!", {
      position: "top-right",
    });
    loading.value = false;
    return;
  }

  const result = await Swal.fire({
    title: "Confirmation",
    text: "Are you sure you want to add this page?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;
  loading.value = true;

  const res = await pageService.createPage(data.value);
  if (res.status !== "success") {
    $toast.error("An error occurred! Please try again later.", {
      position: "top-right",
    });
    loading.value = false;
    return;
  } else {
    const resAvatar = await pageService.uploadAvatar(
      res.data.page._id,
      formDataAvatar.value
    );

    const resCover = await pageService.uploadCover(
      res.data.page._id,
      formDataCover.value
    );

    if (resAvatar.status === "success" && resCover.status === "success") {
      $toast.success("Create page successfully!", {
        position: "top-right",
      });

      await refresh();
      formDataAvatar.value = null;
      formDataCover.value = null;
      avatar.value = null;
      cover.value = null;
      loading.value = false;
      $("#myModaltoCreatePage").modal("hide");
    }
  }
}

async function refresh() {
  const response = await pageService.getAllUserPages(user._value._id);

  if (response.status !== "success") {
    $toast.error("An error occurred! Please try again later.", {
      position: "top-right",
    });
    router.push({ name: "home-page" });
    return;
  }

  pages.value = response.data.pages;
}

onBeforeMount(async () => {
  await refresh();
});

async function submitDelete(pageId) {
  const result = await Swal.fire({
    title: "Delete Page",
    text: "Are you sure you want to delete this page?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  if (!result.isConfirmed) return;

  const response = await pageService.deletePage(pageId);
  if (response.status === "success") {
    $toast.success(`Page have been deleted!`, {
      position: "top-right",
    });
    await refresh();
  } else {
    $toast.error("An error occurred! Please try again later.", {
      position: "top-right",
    });
  }
}
</script>
<style scoped>
label {
  font-weight: bold;
}
.error-feedback {
  color: red;
}
</style>
