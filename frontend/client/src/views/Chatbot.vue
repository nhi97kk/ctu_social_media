<template>
  <div class="container" style="margin-top: 4rem; height: 90vh">
    <div class="row">
      <div class="col-4 d-flex flex-column">
        <h4 class="text-info mt-2">Suggested Questions</h4>
        <div
          class="rounded-lg shadow bg-white border border-info p-1 my-1 btn-hover"
          v-for="(suggestion, index) in suggestions"
          :key="index"
          @click="selectSuggestion(suggestion)"
        >
          {{ suggestion }}
        </div>
      </div>
      <div class="col-8">
        <div class="rounded-lg shadow-lg bg-white mt-2 border border-info">
          <div
            class="p-2 mb-2 list d-flex flex-column"
            style="height: 75vh; overflow-y: scroll"
            ref="chatBody"
          >
            <div
              v-for="message in messages"
              :key="message._id"
              :class="{ own: message.of === 'me' }"
              style="max-width: 75%"
            >
              <div class="rounded-lg shadow p-2 mb-2 border border-secondary">
                <span>{{ message.content }}</span>
              </div>
            </div>
          </div>
          <div class="d-flex p-2 align-items-center">
            <input
              class="w-100 rounded-lg p-2"
              type="text"
              placeholder="Message ChatBot"
              v-model="question.content"
              :disabled="loading"
              @keyup.enter="onSubmit"
            />
            <button
              class="btn btn-hover d-flex align-items-center"
              @click="onSubmit"
              :disabled="loading"
            >
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
                v-if="loading"
              ></span>
              <i
                v-else
                class="fa-solid fa-paper-plane"
                style="font-size: 1.5rem"
              ></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import chatbotService from "@/services/chatbot.service";
import { ref, watch, onMounted, nextTick } from "vue";

const chatBody = ref(null);
const loading = ref(false);
const messages = ref([
  {
    content:
      "Bạn có câu hỏi gì về nội quy, quy chế của Trường Đại học Cần Thơ?",
    of: "chatbot",
  },
]);
const question = ref({
  content: "",
  of: "me",
});
const suggestions = ref([
  "Thời gian và cách thức đăng ký học phần như thế nào?",
  "Nếu không đăng ký đủ tín chỉ tối thiểu trong một kỳ, tôi có bị xử lý không?",
  "Điều kiện xét học bổng khuyến khích học tập?",
  "Những trường hợp nào dẫn đến bị buộc thôi học?",
]);

function selectSuggestion(suggestion) {
  question.value.content = suggestion; // Gán nội dung câu hỏi vào ô input
}

// Scroll to the bottom of the chat when there are new messages
const scrollToBottom = () => {
  nextTick(() => {
    if (chatBody.value) {
      const chatContainer = chatBody.value;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  });
};

async function onSubmit() {
  if (!question.value.content.trim()) return;

  loading.value = true;
  const ques = question.value.content;
  question.value.content = "";

  messages.value.push({ content: ques, of: "me" });
  scrollToBottom();
  const response = await chatbotService.sendQuestion({
    question: ques,
  });
  if (response.status === "success") {
    messages.value.push({ content: response.data.answer, of: "chatbot" });
    scrollToBottom();
  }
  loading.value = false;
}
</script>

<style scoped>
.own {
  align-self: flex-end;
}
</style>
