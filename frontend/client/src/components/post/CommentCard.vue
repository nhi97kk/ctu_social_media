<template>
  <div v-if="!deleted" class="d-flex p-2 w-99">
    <div class="user">
      <div class="profile">
        <img
          :src="
            page != null && comment.user._id === page.owner._id
              ? page.avatar
              : comment.user.avatar
          "
          alt=""
          class="border border-info rounded-circle shadow-lg"
        />
      </div>
    </div>
    <div class="d-flex flex-column">
      <div
        class="d-flex flex-column desc-comment position-relative px-3"
        style="width: fit-content"
      >
        <h4 class="user-name font-weight-bold" style="font-size: 1rem">
          {{
            page != null && comment.user._id === page.owner._id
              ? page.name
              : comment.user.name
          }}
        </h4>
        <p class="user-comment m-0 text-align-justify">
          {{ comment.desc }}
        </p>
        <div class="dots position-absolute" style="top: 0; right: -1.5rem">
          <i class="fa-solid fa-ellipsis btn-hover"></i>
          <div
            class="commentOptions arrow-custom position-absolute flex-column rounded-lg p-2 bg-white mt-2 border border-warning shadow"
            style="right: -5px"
          >
            <div
              v-if="user._id != comment.user._id"
              @click="submitReportComment"
              class="d-flex align-items-center btn-hover"
            >
              <i class="fa-solid fa-triangle-exclamation mr-2 text-warning"></i>
              <span class="text-nowrap">Report this comment.</span>
            </div>
            <div
              v-else
              @click="submitDeleteComment"
              class="d-flex align-items-center btn-hover"
            >
              <i class="fa-solid fa-trash-can mr-2 text-danger"></i>
              <span class="text-nowrap">Delete this comment.</span>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex align-items-center ml-3">
        <span class="mr-3">{{ timeAgo(comment.createdAt) }}</span>
        <i
          @click="handleLikeComment"
          class="fa-regular fa-thumbs-up mr-2 btn-hover"
          :class="{ 'text-warning': comment.likes.includes(user._id) }"
        ></i>
        <span>{{ comment.likes.length }}</span>
      </div>
    </div>
  </div>
  <div v-else class="px-3 py-2">
    <p class="text-secondary m-0">This comment have been deleted.</p>
  </div>
</template>
<script setup>
import commentService from "@/services/comment.service.js";
import reportService from "@/services/report.service.js";

import { ref, inject } from "vue";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import { formatDistanceToNow } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

const $toast = useToast();
const props = defineProps(["comment", "page"]);
const { comment, page } = props;
const user = inject("user");
const report = ref({
  message: "",
  targetId: comment._id,
  targetModel: "Comment",
});
const deleted = ref(false);

// Hàm tính khoảng cách thời gian theo múi giờ Việt Nam
function timeAgo(date) {
  // Múi giờ Việt Nam
  const timeZone = "Asia/Ho_Chi_Minh";
  // Chuyển đổi thời gian từ UTC về múi giờ Việt Nam
  const vietnamTime = utcToZonedTime(new Date(date), timeZone);
  // Tính khoảng cách từ thời gian hiện tại đến thời gian đã được chuyển đổi
  return formatDistanceToNow(vietnamTime, { addSuffix: true });
}

// Hàm toggle like
async function handleLikeComment() {
  const response = await commentService.likeComment(comment._id);
  if (response.status !== "success") {
    $toast.error(
      response.message || "An error occurred! Please try again later.",
      {
        position: "top-right",
      }
    );
    return;
  } else {
    comment.likes = response.data;
  }
}

//
async function submitReportComment() {
  const result = await Swal.fire({
    title: "Report Comment",
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
    $toast.success(`You reported the comment of ${comment.user.name}`, {
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

async function submitDeleteComment() {
  const result = await Swal.fire({
    title: "Delete Comment",
    text: "Are you sure you want to delete this comment?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
  });

  if (!result.isConfirmed) return;

  const response = await commentService.deleteComment(comment._id);
  if (response.status === "success") {
    deleted.value = true;
    $toast.success(`The comment have been deleted!`, {
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
.arrow-custom::before {
  position: absolute;
  content: "";
  top: -20px;
  right: 0px;
  border-width: 10px 13px;
  border-color: transparent transparent yellow transparent;
  border-style: solid;
}
.commentOptions {
  display: none;
}
.dots:hover .commentOptions {
  display: flex;
}
</style>
