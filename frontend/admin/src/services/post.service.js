import createApiClient from '@/services/api.service';
import slugify from 'slugify';

class PostService {
  constructor(baseURL = '/api/v1/posts') {
    this.api = createApiClient(baseURL);
  }

  async getAllPosts(query) {
    try {
      const params = new URLSearchParams(query).toString();
      const response = await this.api.json.get(`/?${params}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async createPost(data) {
    try {
      const response = await this.api.json.post('/', data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async createPostImages(postId, formData) {
    try {
      const response = await this.api.formData.post(
        `/${postId}/images`,
        formData,
      );
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getPost(postId) {
    try {
      const response = await this.api.json.get(`/${postId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getPostImage(imageId) {
    try {
      const response = await this.api.json.get(`/images/${imageId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async updatePost(postId, data) {
    try {
      const response = await this.api.json.patch(`/${postId}`, data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async hidePost(postId) {
    try {
      const response = await this.api.json.patch(`/${postId}/softDelete`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async restorePost(postId) {
    try {
      const response = await this.api.json.patch(`/${postId}/restore`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async searchPosts(name) {
    try {
      const slug = slugify(name);
      const response = await this.api.json.get(`/search?slug=${slug}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getPostStatistics() {
    try {
      const response = await this.api.json.get('admin/post-statistics');
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}

export default new PostService();
