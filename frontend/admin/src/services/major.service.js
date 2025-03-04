import createApiClient from '@/services/api.service';
// import slugify from 'slugify';

class MajorService {
  constructor(baseURL = '/api/v1/majors') {
    this.api = createApiClient(baseURL);
  }

  async getAllMajors(query) {
    try {
      const params = new URLSearchParams(query).toString();
      const response = await this.api.json.get(`/?${params}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async createMajor(data) {
    try {
      const response = await this.api.json.post('/', data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getMajor(majorId) {
    try {
      const response = await this.api.json.get(`/${majorId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async updateMajor(majorId, data) {
    try {
      const response = await this.api.json.patch(`/${majorId}`, data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async deleteMajor(majorId) {
    try {
      const response = await this.api.json.delete(`/${majorId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async searchMajors(name) {
    try {
      const response = await this.api.json.get(`/search?name=${name}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}

export default new MajorService();
