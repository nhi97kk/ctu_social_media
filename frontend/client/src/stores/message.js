import { defineStore } from "pinia";
import MessageService from "../services/message.service";

export const useMessageStore = defineStore("message", {
  state: () => ({
    allMessages: null,
  }),
  getters: {
    messages: (state) => state.allMessages,
  },
  actions: {
    async getAllMessagesChats(id) {
      try {
        const data = await MessageService.getAllMessagesChats(id);
        this.allMessages = data;

        console.log(data);
      } catch (error) {
        console.log(error);
        // Xử lý lỗi khi không thể lấy thông tin người dùng
      }
    },
  },
});
