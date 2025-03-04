<template>
  <div class="container p-3">
    <h3>Upload PDF</h3>
    <form @submit.prevent="uploadPDF">
      <input type="file" @change="handleFile" accept=".pdf" />
      <button class="btn btn-success" type="submit">Upload</button>
    </form>
    <p v-if="message">{{ message }}</p>
    <hr />
    <h3>Content of PDF</h3>
    <div class="button btn btn-warning my-1" @click="updatePDF()">Edit</div>
    <form action="">
      <textarea
        name=""
        id=""
        rows="10"
        class="w-100"
        style="text-align: justify"
        v-model="pdfContent.content"
      >
      </textarea>
    </form>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import chatbotService from '@/services/chatbot.service';
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from 'vue-toast-notification';

const $toast = useToast();
const file = ref(null);
const message = ref('');
const pdfContent = ref({
  content: '',
});

function handleFile(event) {
  file.value = event.target.files[0];
}

async function uploadPDF() {
  if (!file.value) {
    message.value = 'Please select a file.';
    return;
  }

  const formData = new FormData();
  formData.append('pdf', file.value);

  const response = await chatbotService.sendPDF(formData);
  if (response.status === 'success') {
    $toast.success(`Upload new PDF content success.`, {
      position: 'top-right',
    });
    file.value = null;
    pdfContent.value = response.data;
  }
}

async function updatePDF() {
  const response = await chatbotService.updatePDF(
    { content: pdfContent.value.content },
    pdfContent.value._id,
  );
  if (response.status === 'success') {
    $toast.success(`Update PDF content success.`, {
      position: 'top-right',
    });
    pdfContent.value = response.data;
  }
}

onBeforeMount(async () => {
  const response = await chatbotService.getPDF();

  if (response.status === 'success') {
    pdfContent.value = response.data;
  }
});
</script>
