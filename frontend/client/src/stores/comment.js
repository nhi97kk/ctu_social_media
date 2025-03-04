import { defineStore } from "pinia";
import CommentService from "../services/comment.service";

export const useCommentStore = defineStore("comment", {
  state: () => ({
    allComments: null,
  }),
  getters: {
    comments: (state) => state.allComments,
  },
  actions: {
    async getAllCommentPosts(id) {
      try {
        const data = await CommentService.getAllCommentsPost(id);
        this.allComments = data;
        console.log(this.allComments);
      } catch (error) {
        console.log(error);
        // Xử lý lỗi khi không thể lấy thông tin người dùng
      }
    },
  },
});
