import createApiClient from "./api.service";
class AuthService {
  constructor(baseUrl = "/api/v1/users") {
    this.api = createApiClient(baseUrl);
  }
  async login(data) {
    return (await this.api.post("/login", data)).data.data;
  }
  async signUp(data) {
    return (await this.api.post("/signup", data)).data;
  }
  async logout() {
    return (await this.api.get("/logout")).data;
  }
  async updatePass(data) {
    return await this.api.patch("/updateMyPassword", data);
  }
}
export default new AuthService();
