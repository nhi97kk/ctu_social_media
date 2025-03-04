import createApiClient from '@/services/api.service';
import slugify from 'slugify';

class AnswerService {
  constructor(baseURL = '/api/v1/answers') {
    this.api = createApiClient(baseURL);
  }

  async getAllAnswers(query) {
    try {
      const params = new URLSearchParams(query).toString();
      const response = await this.api.json.get(`/?${params}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getAnswersByQuestion(questionId) {
    try {
      const response = await this.api.json.get(`/question/${questionId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getSolutions(questionId) {
    try {
      const response = await this.api.json.get(`/solutions/${questionId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async createAnswer(data) {
    try {
      const response = await this.api.json.post('/', data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async createAnswerImages(answerId, formData) {
    try {
      const response = await this.api.formData.post(
        `/${answerId}/images`,
        formData,
      );
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getAnswer(answerId) {
    try {
      const response = await this.api.json.get(`/${answerId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async acceptAnswer(answerId) {
    try {
      const response = await this.api.json.patch(`accept/${answerId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async likeAnswer(answerId) {
    try {
      const response = await this.api.json.patch(`/${answerId}/like`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async searchAnswers(name) {
    try {
      const slug = slugify(name);
      const response = await this.api.json.get(`/search?slug=${slug}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async hideAnswer(answerId) {
    try {
      const response = await this.api.json.patch(`/${answerId}/softDelete`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async restoreAnswer(answerId) {
    try {
      const response = await this.api.json.patch(`/${answerId}/restore`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}

export default new AnswerService();
