import createApiClient from "@/services/api.service";

class MessageService {
  constructor(baseUrl = "/api/v1/messages") {
    this.api = createApiClient(baseUrl);
  }
  async create(data) {
    try {
      const response = await this.api.json.post("/", data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getAllMessagesChats(chatId) {
    try {
      const response = await this.api.json.get(`/message/${chatId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}
export default new MessageService();
