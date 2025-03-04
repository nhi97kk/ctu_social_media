import createApiClient from "./api.service";
class PostService {
  constructor(baseUrl = "/api/v1/posts") {
    this.api = createApiClient(baseUrl);
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

  async search(query) {
    try {
      const params = new URLSearchParams(query).toString();
      const response = await this.api.json.get(`/search/?${params}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async createPost(data) {
    try {
      const response = await this.api.json.post("/", data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async createPostImages(postId, formData) {
    try {
      const response = await this.api.formData.post(
        `/${postId}/postUpload`,
        formData
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

  async updatePost(postId, data) {
    try {
      const response = await this.api.json.patch(`/${postId}`, data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async deletePost(postId) {
    try {
      const response = await this.api.json.patch(`/${postId}/softDelete`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async deletePostImage(postId, imageId) {
    try {
      const response = await this.api.json.delete(
        `/${postId}/images/${imageId}`
      );
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

  async likePost(postId) {
    try {
      const response = await this.api.json.patch(`/${postId}/like`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async share(id, data) {
    try {
      const response = await this.api.json.post(`/${id}/share`, data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getNewsFeed() {
    try {
      const response = await this.api.json.get("/newsfeed");
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getAllUserPosts(id) {
    try {
      const response = await this.api.json.get(`/all/${id}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getAllPagePosts(id) {
    try {
      const response = await this.api.json.get(`/page/${id}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getAllPagesPosts() {
    try {
      const response = await this.api.json.get("/pages");
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getAllGroupPosts(id) {
    try {
      const response = await this.api.json.get(`/group/${id}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getAllGroupsPosts() {
    try {
      const response = await this.api.json.get("/groups");
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}
export default new PostService();
