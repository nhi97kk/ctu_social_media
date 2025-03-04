<template>
  <!-- loader -->
  <loader v-if="loader"></loader>

  <div v-else style="margin-top: 4rem; min-height: 90vh" class="container page">
    <div class="row">
      <h2 class="p-3 col-6 text-warning">Online market</h2>
      <div class="col-6 d-flex justify-content-end align-items-center">
        <button
          class="btn btn-info text-white shadow border border-white"
          data-toggle="modal"
          data-target="#myModal"
        >
          <i class="fa-solid fa-plus mr-2"></i>
          <span>Upload new item</span>
        </button>
      </div>
    </div>
    <product-filter></product-filter>
    <div class="row mr-0 mt-2">
      <div class="col-3">
        <div class="p-2">
          <!-- Khu vực "Market" -->
          <div
            @click="changeCategory('market')"
            class="rounded-lg p-2 mb-2 btn-hover bg-secondary"
            :class="
              selectedCategory === 'market' ? 'text-warning' : 'text-white'
            "
          >
            <div class="w-100 d-flex align-items-center">
              <div class="icon-group mr-3">
                <i class="fa-solid fa-store"></i>
              </div>
              <span>Market</span>
            </div>
          </div>

          <!-- Khu vực "Active Listings" -->
          <div
            @click="changeCategory('approved')"
            class="rounded-lg p-2 mb-2 btn-hover bg-secondary"
            :class="
              selectedCategory === 'approved' ? 'text-warning' : 'text-white'
            "
          >
            <div class="w-100 d-flex align-items-center">
              <div class="icon-group mr-3">
                <i class="fa-solid fa-cart-shopping"></i>
              </div>
              <span>Active Listings</span>
            </div>
          </div>

          <!-- Khu vực "Pending Approval" -->
          <div
            @click="changeCategory('pending')"
            class="rounded-lg p-2 mb-2 btn-hover bg-secondary"
            :class="
              selectedCategory === 'pending' ? 'text-warning' : 'text-white'
            "
          >
            <div class="w-100 d-flex align-items-center">
              <div class="icon-group mr-3">
                <i class="fa-regular fa-compass"></i>
              </div>
              <span>Pending Approval</span>
            </div>
          </div>

          <!-- Khu vực "Sold Listings" -->
          <div
            @click="changeCategory('sold')"
            class="rounded-lg p-2 mb-2 btn-hover bg-secondary"
            :class="selectedCategory === 'sold' ? 'text-warning' : 'text-white'"
          >
            <div class="w-100 d-flex align-items-center">
              <div class="icon-group mr-3">
                <i class="fa-solid fa-box"></i>
              </div>
              <span>Sold Listings</span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-9">
        <router-view></router-view>
      </div>
    </div>
    <div class="modal" id="myModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title text-center">Add New Product</h4>
            <button type="button" class="close" data-dismiss="modal">
              &times;
            </button>
          </div>

          <!-- Modal Body -->
          <div class="container px-5 py-3">
            <Form
              class="form"
              @submit="onSubmit"
              :validation-schema="productFormSchema"
            >
              <!-- Product Name -->
              <div class="mb-3 form-group">
                <label for="name" class="form-label">Product Name: </label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  class="form-control"
                  v-model="product.name"
                />
                <ErrorMessage name="name" class="error-feedback"></ErrorMessage>
              </div>

              <!-- Price -->
              <div class="mb-3 form-group">
                <label for="price" class="form-label">Price: </label>
                <Field
                  type="text"
                  name="price"
                  id="price"
                  class="form-control"
                  v-model="product.price"
                />
                <ErrorMessage
                  name="price"
                  class="error-feedback"
                ></ErrorMessage>
              </div>

              <!-- Stock Quantity -->
              <div class="mb-3 form-group">
                <label for="stockQuantity" class="form-label"
                  >Stock Quantity:
                </label>
                <Field
                  type="text"
                  name="stockQuantity"
                  id="stockQuantity"
                  class="form-control"
                  v-model="product.stockQuantity"
                />
                <ErrorMessage
                  name="stockQuantity"
                  class="error-feedback"
                ></ErrorMessage>
              </div>

              <!-- Notes -->
              <div class="mb-3 form-group">
                <label for="note" class="form-label">Notes: </label>
                <Field
                  type="text"
                  name="note"
                  id="note"
                  class="form-control"
                  v-model="product.note"
                />
                <ErrorMessage name="note" class="error-feedback"></ErrorMessage>
              </div>

              <div class="mb-3 form-group">
                <label for="type" class="form-label">Type: </label>
                <Field
                  as="select"
                  name="type"
                  id="type"
                  class="form-control w-50"
                  v-model="product.type"
                >
                  <option value="">-- Type --</option>
                  <option value="Books">Books - Sách và giáo trình</option>
                  <option value="Stationery">
                    Stationery - Dụng cụ học tập
                  </option>
                  <option value="Electronics">
                    Electronics - Thiết bị điện tử
                  </option>
                  <option value="Clothing">
                    Clothing - Quần áo và phụ kiện
                  </option>
                  <option value="Courses">Courses - Khóa học</option>
                  <option value="Digital">
                    Digital - Sản phẩm kỹ thuật số
                  </option>
                  <option value="Food">Food - Đồ ăn uống</option>
                  <option value="Essentials">
                    Essentials - Đồ dùng cần thiết
                  </option>
                  <option value="Other">Other - Khác</option>
                </Field>

                <ErrorMessage name="type" class="error-feedback"></ErrorMessage>
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
                  Create Product
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
import ImageList from "@/components/product/ImageList.vue";
import ProductFilter from "@/components/product/ProductFilter.vue";
import Loader from "@/components/Loader.vue";

import productService from "@/services/product.service.js";
import userService from "@/services/user.service.js";

import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { ref, provide, onBeforeMount, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import $ from "jquery";

const $toast = useToast();
const route = useRoute();
const router = useRouter();
const user = ref(null);
const loader = ref(true);
const product = ref({
  name: "",
  price: "",
  stockQuantity: "",
  note: "",
  type: "",
});
const images = ref([]);
const loading = ref(false);
const formData = ref(new FormData()); // Để chứa dữ liệu ảnh khi tải lên

// Thêm trạng thái selectedCategory
const selectedCategory = ref("market"); // Giá trị mặc định là "market"

// Hàm thay đổi category và cập nhật selectedCategory
function changeCategory(category) {
  selectedCategory.value = category; // Cập nhật category được chọn
  router.push({
    name: "product-list",
    query: {
      status:
        selectedCategory.value == "market"
          ? "approved"
          : selectedCategory.value,
      createdBy:
        selectedCategory.value == "market" ? undefined : user.value._id,
    },
  });
}

// Schema validation
const productFormSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Product name is required")
    .min(5)
    .max(200),
  price: yup.number().required("Price is required").min(0),
  stockQuantity: yup.number().required("Stock quantity is required").min(1),
  type: yup.string().required("Product type is required"),
});

// Handle image change (preview images before submitting)
function onImagesChange(e) {
  for (let i = 0; i < e.target.files.length; i++) {
    const file = e.target.files[i];
    images.value.push(file); // Add to images array for preview
    formData.value.append("images", file);
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
      newFormData.append("images", image);
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

  const response = await productService.createProduct(product.value);

  if (response.status !== "success") {
    $toast.error("Error occur! Try again later...", {
      position: "top-right",
    });
    loading.value = false;
    return;
  }

  if (response.status === "success") {
    //  Add new image
    await productService.createProductImages(
      response.data.product._id,
      formData.value
    );

    $toast.success("Successfully! Reload your pending approval!", {
      position: "top-right",
    });

    // Reset form
    product.value = {
      name: "",
      price: "",
      stockQuantity: "",
      note: "",
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

  if (res.status !== "success") {
    $toast.error(res.message || "Error occur! Try again later...", {
      position: "top-right",
    });
    router.push({ name: "home-page" });
    return;
  } else {
    user.value = res.data.user;
    await router.push({
      name: "product-list",
      query: {
        status: "approved",
      },
    });
    loader.value = false;
  }
}

onBeforeMount(async () => {
  await refresh();
});

provide("user", user);
</script>
