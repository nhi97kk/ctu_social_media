import createApiClient from "@/services/api.service";

class UserService {
  constructor(baseUrl = "/api/v1/users") {
    this.api = createApiClient(baseUrl);
  }

  async login(data) {
    try {
      const response = await this.api.json.post("/login", data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async register(data) {
    try {
      const response = await this.api.json.post("/signup", data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async logout() {
    try {
      const response = await this.api.json.post("/logout");
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getMe() {
    try {
      const response = await this.api.json.get("/me");
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async updateMe(data) {
    try {
      const response = await this.api.json.patch("/me", data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async updatePass(data) {
    try {
      const response = await this.api.json.patch("/updatePassword", data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async deleteMe() {
    try {
      const response = await this.api.json.delete("/me");
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getAllUsers(query) {
    try {
      const params = new URLSearchParams(query).toString();
      const response = await this.api.json.get(`/?${params}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getUser(userId) {
    try {
      const response = await this.api.json.get(`/${userId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async uploadAvatar(userId, formData) {
    try {
      const response = await this.api.formData.patch(
        `/avatarUpload/${userId}`,
        formData
      );
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async uploadCover(userId, formData) {
    try {
      const response = await this.api.formData.patch(
        `/coverUpload/${userId}`,
        formData
      );
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async createPostImages(userId, formData) {
    try {
      const response = await this.api.formData.post(
        `/${userId}/postUpload`,
        formData
      );
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getAll() {
    try {
      const response = await this.api.json.get("/all");
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

  // Friend related methods
  async addFriend(userId) {
    try {
      const response = await this.api.json.patch(`/addFriend/${userId}`);
      return response.data;
    } catch (err) {
      return err.response.data; // Ném lỗi để xử lý ở nơi gọi
    }
  }

  async acceptRequest(userId) {
    try {
      const response = await this.api.json.patch(`/acceptRequest/${userId}`);
      return response.data;
    } catch (err) {
      return err.response.data; // Ném lỗi để xử lý ở nơi gọi
    }
  }

  async unFriend(userId) {
    try {
      const response = await this.api.json.patch(`/unFriend/${userId}`);
      return response.data;
    } catch (err) {
      return err.response.data; // Ném lỗi để xử lý ở nơi gọi
    }
  }

  async getAllFriends(userId, query) {
    try {
      const params = new URLSearchParams(query).toString();
      const response = await this.api.json.get(
        `/findAllFriends/${userId}/?${params}`
      );
      return response.data;
    } catch (err) {
      throw err.response ? err.response.data : err; // Ném lỗi để xử lý ở nơi gọi
    }
  }

  async getAllRequests() {
    try {
      const response = await this.api.json.get("/findAllRequests");
      return response.data;
    } catch (err) {
      throw err.response ? err.response.data : err; // Ném lỗi để xử lý ở nơi gọi
    }
  }

  async getAllOthers() {
    try {
      const response = await this.api.json.get("/getOthers");
      return response.data;
    } catch (err) {
      throw err.response ? err.response.data : err; // Ném lỗi để xử lý ở nơi gọi
    }
  }
}
export default new UserService();
