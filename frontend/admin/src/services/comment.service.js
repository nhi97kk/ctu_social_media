import createApiClient from './api.service';
class CommentService {
  constructor(baseUrl = '/api/v1/comments') {
    this.api = createApiClient(baseUrl);
  }

  async getAllComments(query) {
    try {
      const params = new URLSearchParams(query).toString();
      const response = await this.api.json.get(`/?${params}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
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

  async hideComment(commentId) {
    try {
      const response = await this.api.json.patch(`/${commentId}/softDelete`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async restoreComment(commentId) {
    try {
      const response = await this.api.json.patch(`/${commentId}/restore`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getComment(commentId) {
    try {
      const response = await this.api.json.get(`/${commentId}`);
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
