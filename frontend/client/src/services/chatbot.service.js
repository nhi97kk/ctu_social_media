import createApiClient from "@/services/api.service";

class ChatbotService {
  constructor(baseURL = "/api/v1/chatbot") {
    this.api = createApiClient(baseURL);
  }

  async sendQuestion(data) {
    try {
      const response = await this.api.json.post(`/ask`, data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}

export default new ChatbotService();
