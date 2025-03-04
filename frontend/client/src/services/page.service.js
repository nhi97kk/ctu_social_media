import createApiClient from "./api.service";
class PageService {
  constructor(baseUrl = "/api/v1/pages") {
    this.api = createApiClient(baseUrl);
  }

  async getAllPages(query) {
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

  async createPage(data) {
    try {
      const response = await this.api.json.post("/", data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async uploadAvatar(pageId, formData) {
    try {
      const response = await this.api.formData.patch(
        `/avatarUpload/${pageId}`,
        formData
      );
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async uploadCover(pageId, formData) {
    try {
      const response = await this.api.formData.patch(
        `/coverUpload/${pageId}`,
        formData
      );
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getPage(pageId) {
    try {
      const response = await this.api.json.get(`/${pageId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async updatePage(pageId, data) {
    try {
      const response = await this.api.json.patch(`/${pageId}`, data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async deletePage(pageId) {
    try {
      const response = await this.api.json.patch(`/${pageId}/softDelete`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async follow(id) {
    return (await this.api.json.post(`/${id}/follow`)).data;
  }

  async getAllUserPages(id) {
    try {
      const response = await this.api.json.get(`/all/${id}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getSuggestPages() {
    try {
      const response = await this.api.json.get("/suggested");
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getFollowedPages() {
    try {
      const response = await this.api.json.get("/followed");
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}
export default new PageService();
