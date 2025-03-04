import { defineStore } from "pinia";
import PostService from "../services/post.service";
import UserService from "../services/user.service";

export const usePostStore = defineStore("post", {
  state: () => ({
    allPosts: null,
    postCurrent: null,
    isLikedPost: false,
    likeCount: null,
  }),
  getters: {
    posts: (state) => state.allPosts,
    post: (state) => state.postCurrent,
    isLiked: (state) => state.isLikedPost,
    likes: (state) => state.likeCount,
  },
  actions: {
    async getAllPosts() {
      try {
        const data = await PostService.getAll();
        this.allPosts = data.data;
      } catch (error) {
        console.log(error);
        // Xử lý lỗi khi không thể lấy thông tin người dùng
      }
    },

    async getAllUserPosts(id) {
      try {
        const data = await PostService.getAllUserPosts(id);
        this.allPosts = data;
        console.log(data);
      } catch (error) {
        console.log(error);
        // Xử lý lỗi khi không thể lấy thông tin người dùng
      }
    },

    async getPost(PostId, UserId) {
      try {
        const data = await PostService.get(PostId);
        this.postCurrent = data.data;
        console.log(this.postCurrent);
        this.isLikedPost = this.postCurrent.likes.some(
          (like) => like === UserId
        );
        this.likeCount = this.postCurrent.likes.length;
        console.log(this.postCurrent.likes);
        console.log(UserId);
      } catch (error) {
        console.log(error);
      }
    },

    async toggleLike(id) {
      try {
        await PostService.like(id);
      } catch (error) {
        console.log(error);
      }
    },
  },
});
