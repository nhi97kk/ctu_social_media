<template>
  <div class="container">
    <!-- Cover Image -->
    <div class="row justify-content-center position-relative">
      <div class="col-md-10 col-12">
        <img
          :src="props.user.coverImage"
          alt="Cover Image"
          class="img-fluid w-100 rounded border border-info shadow"
          style="max-height: 300px; object-fit: cover"
        />
        <button
          v-show="props.me"
          data-toggle="modal"
          data-target="#editImageModal"
          class="btn btn-warning text-white position-absolute shadow-lg border border-white"
          style="top: 1rem; right: 2rem"
        >
          <!-- <span>Update avatar and cover image</span> -->
          <i class="fa-solid fa-camera"></i>
        </button>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="row col-md-9 col-12">
        <!-- Avatar -->
        <div class="col-md-4 col-12" style="height: 120px">
          <img
            :src="props.user.avatar"
            alt="Avatar"
            class="rounded-circle img-thumbnail position-absolute border border-info"
            style="
              bottom: 20px;
              width: 170px;
              height: 170px;
              border: 0.5px solid white;
            "
          />
        </div>
        <!-- Profile info -->
        <div class="col-md-8 col-12 py-3">
          <div class="info-profile">
            <h4>
              {{ props.user.name }}
              <i
                :class="{
                  'fa-solid text-danger fa-venus':
                    props.user.gender === 'female',
                  'fa-solid text-danger fa-mars': props.user.gender === 'male',
                  'fa-solid text-danger fa-genderless':
                    props.user.gender === 'other',
                }"
              ></i>
            </h4>
            <span>
              <i class="fa-regular fa-envelope mr-2 text-success"></i>
              {{ props.user.email }}
            </span>
            <span>
              <i class="fa-solid fa-book-open-reader mr-2 text-info"></i>
              {{ props.user.major?.name }}
            </span>
            <span>
              <i class="fa-solid fa-school-flag text-warning mr-2"></i>
              {{ props.user.major?.college }}
            </span>
          </div>

          <div class="position-absolute" style="top: 1rem; right: 0">
            <!-- edit btn  -->
            <button
              v-if="props.me"
              @click="() => $router.push({ name: 'edit-me-page' })"
              class="btn btn-warning text-white border border-white shadow"
            >
              <i class="fa-solid fa-user-pen"></i>
            </button>

            <!-- options friend  -->
            <div v-else class="d-flex flex-column">
              <div class="d-flex align-items-center justify-content-between">
                <button
                  v-if="currentUser.requests.includes(props.user._id)"
                  class="border border-white shadow btn btn-success d-flex align-items-center my-1 fit-content"
                  @click="confirm(props.user._id)"
                >
                  <i class="fa-solid fa-check mr-2"></i>
                  <span>Confirm</span>
                </button>

                <button
                  v-else-if="currentUser.friends.includes(props.user._id)"
                  class="shadow btn btn-danger d-flex align-items-center my-1 fit-content text-white"
                  @click="unFriend(props.user._id)"
                >
                  <i class="fa-solid fa-user-minus mr-2"></i>
                  <span>Unfriend</span>
                </button>

                <button
                  v-else-if="props.user.requests.includes(currentUser._id)"
                  @click="sendRequest(props.user._id)"
                  class="border border-white shadow btn btn-warning d-flex align-items-center my-1 fit-content text-white"
                >
                  <i class="fa-regular fa-clock mr-2"></i>
                  <span>Request pending</span>
                </button>
                <button
                  v-else
                  class="border border-white shadow btn btn-info d-flex align-items-center my-1 fit-content"
                  @click="sendRequest(props.user._id)"
                >
                  <i class="fa-solid fa-arrow-up-right-from-square mr-2"></i>
                  <span>Send request</span>
                </button>

                <div
                  class="border border-info shadow ml-3 btn-hover rounded-circle bg-warning d-flex justify-content-center align-items-center"
                  style="width: 40px; height: 40px"
                  @click="chat(props.user._id)"
                >
                  <img
                    class="rounded-circle"
                    style="object-fit: cover; width: 60%"
                    src="../../assets/img/icons/messenger.svg"
                    alt=""
                  />
                </div>
              </div>
              <button
                class="btn btn-outline-warning d-flex align-items-center my-1 fit-content"
                @click="submitReport(props.user._id)"
              >
                <i class="fa-solid fa-triangle-exclamation mr-2"></i>
                <span>Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col-md-10 col-12">
        <hr class="w-100 border-info" />
      </div>
    </div>
  </div>

  <!-- The Modal -->
  <div class="modal" id="editImageModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title text-center">Update avatar and cover image</h4>
          <button type="button" class="close" data-dismiss="modal">
            &times;
          </button>
        </div>

        <!-- Modal body -->
        <div class="view view-post-container smaller-margin">
          <div class="view-post p-4">
            <Form class="form" @submit="onSubmit">
              <div class="mb-4 form-group">
                <div class="d-flex justify-content-between">
                  <label class="form-label font-weight-bold">Avatar: </label>
                  <label
                    for="avatar"
                    class="form-label"
                    style="cursor: pointer"
                  >
                    <a class="nav-link">Chose new avatar</a>
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
                    :src="avatar ? avatar : props.user.avatar"
                    alt="Avatar"
                  />
                </div>
              </div>
              <div class="mb-4 form-group">
                <div class="d-flex justify-content-between">
                  <label class="form-label font-weight-bold"
                    >Cover image:
                  </label>
                  <label for="cover" class="form-label" style="cursor: pointer">
                    <a class="nav-link">Chose new cover image</a>
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
                    :src="cover ? cover : props.user.coverImage"
                    alt="Cover image"
                  />
                </div>
              </div>
              <div class="mb-1 form-group text-center">
                <button
                  class="btn btn-warning text-white"
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
      </div>
    </div>
  </div>
</template>

<script setup>
import userService from "@/services/user.service.js";
import chatService from "@/services/chat.service.js";
import reportService from "@/services/report.service.js";

import { ref, onBeforeMount, computed, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Form } from "vee-validate";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import $ from "jquery";

const $toast = useToast();
const router = useRouter();
const props = defineProps(["user", "me"]);
const { me, user } = props;
const currentUser = inject("user");
const avatar = ref(null);
const cover = ref(null);
const formDataAvatar = ref(null);
const formDataCover = ref(null);
const loading = ref(false);
const emit = defineEmits(["changeImg", "updateFriend"]);
const report = ref({
  message: "",
  targetId: props.user._id,
  targetModel: "User",
});

function onAvatarChange(e) {
  formDataAvatar.value = new FormData();
  formDataAvatar.value.append("avatar-user", e.target.files[0]);
  avatar.value = URL.createObjectURL(e.target.files[0]);
}

function onCoverChange(e) {
  formDataCover.value = new FormData();
  formDataCover.value.append("cover-user", e.target.files[0]);
  cover.value = URL.createObjectURL(e.target.files[0]);
}

async function onSubmit() {
  loading.value = true;

  if (formDataAvatar.value != null) {
    try {
      const res = await userService.uploadAvatar(
        props.user._id,
        formDataAvatar.value
      );
      if (res.status === "success") {
        $toast.success("Upload avatar success!", {
          position: "top-right",
        });
      }
    } catch (error) {
      $toast.error("Occur error! Try again later.", {
        position: "top-right",
      });
    }
  }

  if (formDataCover.value != null) {
    try {
      const res = await userService.uploadCover(
        props.user._id,
        formDataCover.value
      );
      if (res.status === "success") {
        $toast.success("Upload cover image success!", {
          position: "top-right",
        });
      }
    } catch (error) {
      $toast.error("Occur error! Try again later.", {
        position: "top-right",
      });
    }
  }

  avatar.value = null;
  cover.value = null;
  loading.value = false;
  $("#editImageModal").modal("hide");
  emit("changeImg");
}

async function confirm(userId) {
  const res = await userService.acceptRequest(userId);
  if (res.status === "success") {
    emit("updateFriend");
    props.user.friends = res.data.otherFriends;
    currentUser._value.friends = res.data.yourFriends;
    currentUser._value.requests = res.data.yourRequests;
    $toast.success(res.message, {
      position: "top-right",
    });
  } else {
    $toast.error(res.message || "Occur error! Try again later.", {
      position: "top-right",
    });
  }
}

async function unFriend(userId) {
  const result = await Swal.fire({
    title: "Unfriend User",
    text: "Are you sure you want to unfriend this user?",
    showCancelButton: true,
    confirmButtonText: "Yes, Unfriend",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  const res = await userService.unFriend(userId);
  if (res.status === "success") {
    emit("updateFriend");
    props.user.friends = res.data.otherFriends;
    currentUser._value.friends = res.data.yourFriends;
    $toast.success(res.message, {
      position: "top-right",
    });
  } else {
    $toast.error(res.message || "Occur error! Try again later.", {
      position: "top-right",
    });
  }
}

async function sendRequest(userId) {
  const res = await userService.addFriend(userId);

  if (res.status === "success") {
    props.user.requests = res.data;
    $toast.success(res.message, {
      position: "top-right",
    });
  } else {
    $toast.error(res.message || "Occur error! Try again later.", {
      position: "top-right",
    });
  }
}

async function chat(userId) {
  const res = await chatService.create({
    members: [userId, currentUser._value._id],
  });
  if (res.status == "success") {
    const id = res.data.existingChat
      ? res.data.existingChat._id
      : res.data.chat._id;
    router.push({ name: "chat-message", params: { chatId: id } });
  }
}

//
async function submitReport(userId) {
  const result = await Swal.fire({
    title: "Report User",
    input: "textarea",
    inputLabel: "Report Details",
    inputPlaceholder: "Provide details for this report...",
    confirmButtonText: "Submit Report",
    cancelButtonText: "Cancel",
    showCancelButton: true,
    preConfirm: (inputValue) => {
      if (inputValue.trim().length === 0) {
        Swal.showValidationMessage("Report details cannot be empty.");
      } else if (inputValue.length > 500) {
        Swal.showValidationMessage(
          "Report details must be 500 characters or less."
        );
      } else {
        report.value.message = inputValue; // Gán lại chuỗi gốc nếu thỏa mãn điều kiện
      }
    },
  });

  if (!result.isConfirmed) return;

  const response = await reportService.createReport(report.value);
  if (response.status === "success") {
    $toast.success(`You reported account of ${props.user.name}`, {
      position: "top-right",
    });
  } else {
    $toast.error(
      response.message || "An error occurred! Please try again later.",
      {
        position: "top-right",
      }
    );
  }
}
</script>
<style scoped>
@import "../../views/style/profile.css";
</style>
