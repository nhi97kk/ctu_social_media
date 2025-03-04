import createApiClient from '@/services/api.service';

class ChatbotService {
  constructor(baseURL = '/api/v1/chatbot') {
    this.api = createApiClient(baseURL);
  }

  async sendPDF(data) {
    try {
      const response = await this.api.formData.post('/', data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getPDF() {
    try {
      const response = await this.api.json.get('/');
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async updatePDF(data, id) {
    try {
      const response = await this.api.json.patch(`update/${id}`, data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}

export default new ChatbotService();
