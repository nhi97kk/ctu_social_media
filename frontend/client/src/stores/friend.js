import { defineStore } from "pinia";
import UserService from "../services/user.service";

export const useFriendStore = defineStore("friend", {
  state: () => ({
    allFriends: null,
    friendNum: 0,
    options: "",
  }),
  getters: {
    nums: (state) => state.friendNum,
    friends: (state) => state.allFriends,
    option: (state) => state.options,
  },
  actions: {
    async getAllFriends() {
      try {
        const data = await UserService.getAllFriends();
        this.allFriends = data.friends;
        this.friendNum = data.friends.length;
        this.options = "friends";
        console.log(data.friends);
      } catch (error) {
        console.log(error);
        // Xử lý lỗi khi không thể lấy thông tin người dùng
      }
    },

    async getAllRequests() {
      try {
        const data = await UserService.getAllFriends();
        this.allFriends = data.requests;
        this.friendNum = data.requests.length;
        this.options = "requests";
      } catch (error) {
        console.log(error);
        // Xử lý lỗi khi không thể lấy thông tin người dùng
      }
    },

    async getAllOthers() {
      try {
        const data = await UserService.getAllOthers();
        this.allFriends = data;
        this.friendNum = data.length;
        this.options = "others";
      } catch (error) {
        console.log(error);
        // Xử lý lỗi khi không thể lấy thông tin người dùng
      }
    },
  },
});
