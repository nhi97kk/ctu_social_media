<template>
  <div v-if="loader">
    <!-- accepted answers content  -->
    <h2>Accepted Solution ({{ solutions.length }})</h2>
    <div class="my-2">
      <p v-if="solutions.length == 0" class="w-100 text-center">
        No answers available...
      </p>
      <AnswerCard
        v-else
        v-for="answer in solutions"
        :answer="answer"
        :key="answer._id"
        :parentAnswerUserName="null"
        :emitter="emitter"
        :depth="0"
      ></AnswerCard>
    </div>

    <!-- answers content  -->
    <h2 class="mt-4">Replies ({{ countAns }})</h2>
    <div class="my-2">
      <p v-if="replies.length == 0" class="w-100 text-center">
        No answers available...
      </p>

      <AnswerCard
        v-else
        v-for="answer in replies"
        :answer="answer"
        :key="answer._id"
        :parentAnswerUserName="null"
        :emitter="emitter"
        :depth="0"
      ></AnswerCard>
    </div>

    <!-- modal -->
    <div class="modal" id="myModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title text-center">Reply</h4>
            <button type="button" class="close" data-dismiss="modal">
              &times;
            </button>
          </div>

          <!-- Modal Body -->
          <div class="container px-5 py-3">
            <Form
              class="form"
              @submit="onSubmit"
              :validation-schema="answerFormSchema"
            >
              <!-- answer content -->
              <div class="mb-3 form-group">
                <label for="content" class="form-label">Content: </label>
                <Field
                  type="text"
                  name="content"
                  id="content"
                  class="form-control"
                  v-model="answer.content"
                />
                <ErrorMessage
                  name="content"
                  class="error-feedback"
                ></ErrorMessage>
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
                  Send
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
import AnswerCard from "@/components/forum/AnswerCard.vue";
import ImageList from "@/components/product/ImageList.vue";

import answerService from "@/services/answer.service.js";

import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
  defineEmits,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import $ from "jquery";
import mitt from "mitt";

const emitter = mitt(); // Khởi tạo mitt trực tiếp trong setup
const emit = defineEmits(["accept"]);
const $toast = useToast();
const router = useRouter();
const props = defineProps(["question"]);
const { question } = props;
const solutions = ref([]);
const replies = ref([]);
const countAns = ref(0);
const loader = ref(false);
const answer = ref({
  content: "",
  question: null,
  parentAnswer: null,
});
const images = ref([]);
const loading = ref(false);
const formData = ref(new FormData());

// Schema validation
const answerFormSchema = yup.object({
  content: yup.string().trim().required("Content is required").min(5).max(500),
});

// Thiết lập `parentAnswer` từ `questionContent`
const setParentAnswer = (parentId) => {
  answer.value.parentAnswer = parentId;
};

// Thêm answer vừa được accept vào solutions
const pushSolutions = (answer) => {
  const solution = { ...answer, replies: [], hideActions: true };
  solutions.value.push(solution);
  emit("accept");
};

// Lắng nghe sự kiện reply từ bất kỳ AnswerCard nào
onMounted(() => {
  emitter.on("reply", setParentAnswer);
  emitter.on("accept", pushSolutions);
});

onBeforeUnmount(() => {
  emitter.off("reply", setParentAnswer); // Xóa listener khi component bị huỷ
  emitter.off("accept", pushSolutions);
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

function addReplyToParent(answers, newReply) {
  newReply.replies = [];
  if (newReply.parentAnswer === null) {
    // fix me
    replies.value = [...replies.value, newReply];
  } else {
    for (const answer of answers) {
      if (answer._id === newReply.parentAnswer) {
        // Gán mảng mới cho replies để Vue nhận diện thay đổi
        answer.replies = [...answer.replies, newReply];
        return true;
      } else if (answer.replies && answer.replies.length) {
        if (addReplyToParent(answer.replies, newReply)) {
          return true;
        }
      }
    }
  }
  return false;
}

// Submit the form to create a new product
async function onSubmit() {
  // Prepare form data and submit
  loading.value = true;
  const response = await answerService.createAnswer(answer.value);

  if (response.status !== "success") {
    $toast.error("Error occur! Try again later...", {
      position: "top-right",
    });
    loading.value = false;
    return;
  }

  if (response.status === "success" && images.value.length !== 0) {
    //  Add new image
    const res = await answerService.createAnswerImages(
      response.data.answer._id,
      formData.value
    );

    if (res.status !== "success") {
      $toast.error("Error occur! Try again later...", {
        position: "top-right",
      });
      loading.value = false;
      return;
    }
    response.data.answer = res.data.answer;
  }

  addReplyToParent(replies.value, response.data.answer);
  replies.value = [...replies.value];

  $toast.success("Send reply successfully!", {
    position: "top-right",
  });

  // Reset form
  answer.value.content = "";
  answer.value.parentAnswer = null;
  // Reset modal data
  images.value = []; // Xóa URL ảnh
  formData.value = new FormData(); // Xóa dữ liệu ảnh
  $("#myModal").modal("hide");
  loading.value = false;
}

async function refresh() {
  const repliesRes = await answerService.getAnswersByQuestion(question._id);
  const solutionsRes = await answerService.getSolutions(question._id);

  if (solutionsRes.status !== "success" || repliesRes.status !== "success") {
    $toast.error("Error occurred when load answers!", {
      position: "top-right",
    });
    router.push({ name: "home-page" });
    return;
  } else {
    solutions.value = solutionsRes.data.answers;
    replies.value = repliesRes.data.answers;
    countAns.value = repliesRes.data.countAns;
  }

  answer.value.question = question._id;
  loader.value = true;
}

onBeforeMount(async () => {
  await refresh();
});
</script>
