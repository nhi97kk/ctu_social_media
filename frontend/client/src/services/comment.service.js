import createApiClient from "./api.service";
class CommentService {
  constructor(baseUrl = "/api/v1/comments") {
    this.api = createApiClient(baseUrl);
  }

  async createComment(postId, comment) {
    try {
      const data = { desc: comment };
      const response = await this.api.json.post(`/post/${postId}`, data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async likeComment(commentId) {
    try {
      const response = await this.api.json.patch(`/${commentId}/like`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async deleteComment(commentId) {
    try {
      const response = await this.api.json.patch(`/${commentId}/softDelete`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getAllCommentsPost(postId) {
    try {
      const response = await this.api.json.get(`/post/${postId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}
export default new CommentService();
