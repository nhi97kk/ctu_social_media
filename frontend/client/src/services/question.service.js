import createApiClient from "@/services/api.service";
import slugify from "slugify";

class QuestionService {
  constructor(baseURL = "/api/v1/questions") {
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

  async search(filter) {
    try {
      const params = new URLSearchParams(filter).toString();
      const response = await this.api.json.get(`/search/?${params}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async createQuestion(data) {
    try {
      const response = await this.api.json.post("/", data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async createQuestionImages(questionId, formData) {
    try {
      const response = await this.api.formData.post(
        `/${questionId}/images`,
        formData
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
}

export default new QuestionService();
