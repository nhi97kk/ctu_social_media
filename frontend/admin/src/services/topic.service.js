import createApiClient from '@/services/api.service';
import slugify from 'slugify';

class TopicService {
  constructor(baseURL = '/api/v1/topics') {
    this.api = createApiClient(baseURL);
  }

  async getAllTopics(query) {
    try {
      const params = new URLSearchParams(query).toString();
      const response = await this.api.json.get(`/?${params}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async createTopic(data) {
    try {
      const response = await this.api.json.post('/', data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getTopic(topicId) {
    try {
      const response = await this.api.json.get(`/${topicId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async updateTopic(topicId, data) {
    try {
      const response = await this.api.json.patch(`/${topicId}`, data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async hideTopic(topicId) {
    try {
      const response = await this.api.json.patch(`/${topicId}/softDelete`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async deleteTopic(topicId) {
    try {
      const response = await this.api.json.delete(`/${topicId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async searchTopics(name) {
    try {
      const slug = slugify(name);
      const response = await this.api.json.get(`/search?slug=${slug}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}

export default new TopicService();
