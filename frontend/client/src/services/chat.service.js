import createApiClient from "@/services/api.service";

class ChatService {
  constructor(baseUrl = "/api/v1/chats") {
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

  async search(query) {
    try {
      const params = new URLSearchParams(query).toString();
      const response = await this.api.json.get(`/search/?${params}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async createGroupChat(data) {
    try {
      const response = await this.api.json.post("/groupChat", data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async uploadAvatar(chatId, formData) {
    try {
      const response = await this.api.formData.patch(
        `/avatarUpload/${chatId}`,
        formData
      );
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async get(id) {
    try {
      const response = await this.api.json.get(`/${id}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async update(id, data) {
    try {
      const response = await this.api.json.patch(`/${id}`, data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getAllUserChats(userId) {
    try {
      const response = await this.api.json.get(`/chat/${userId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}
export default new ChatService();
