import { defineStore } from "pinia";
import UserService from "../services/user.service";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authUser: null,
    otherUser: null,
  }),
  getters: {
    user: (state) => state.authUser,
    other: (state) => state.otherUser,
  },
  actions: {
    async getUser() {
      try {
        const data = await UserService.getUser();
        this.authUser = data.data;
      } catch (error) {
        console.log("Just login!");
        // Xử lý lỗi khi không thể lấy thông tin người dùng
      }
    },

    async getOtherUser(id) {
      try {
        const data = await UserService.getOtherUser(id);
        this.otherUser = data.data;
        // console.log(data);
      } catch (error) {
        console.log("This user invalid!");
      }
    },
  },
});
