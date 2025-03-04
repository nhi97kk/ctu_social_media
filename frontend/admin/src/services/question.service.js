import createApiClient from '@/services/api.service';
import slugify from 'slugify';

class QuestionService {
  constructor(baseURL = '/api/v1/questions') {
    this.api = createApiClient(baseURL);
  }

  async getAllQuestions(filter) {
    try {
      const params = new URLSearchParams(filter).toString();
      const response = await this.api.json.get(`/topic/?${params}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getQuestionsByTopic(topicId, filter) {
    try {
      const params = new URLSearchParams(filter).toString();
      const response = await this.api.json.get(`/topic/${topicId}/?${params}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async createQuestion(data) {
    try {
      const response = await this.api.json.post('/', data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async createQuestionImages(questionId, formData) {
    try {
      const response = await this.api.formData.post(
        `/${questionId}/images`,
        formData,
      );
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getQuestion(questionId) {
    try {
      const response = await this.api.json.get(`/${questionId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async likeQuestion(questionId) {
    try {
      const response = await this.api.json.patch(`/${questionId}/like`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async updateQuestion(questionId, data) {
    try {
      const response = await this.api.json.patch(`/${questionId}`, data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async hideQuestion(questionId) {
    try {
      const response = await this.api.json.patch(`/${questionId}/softDelete`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async restoreQuestion(questionId) {
    try {
      const response = await this.api.json.patch(`/${questionId}/restore`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async searchQuestions(name) {
    try {
      const slug = slugify(name);
      const response = await this.api.json.get(`/search?slug=${slug}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getQuestionStatistics() {
    try {
      const response = await this.api.json.get('admin/question-statistics');
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}

export default new QuestionService();
