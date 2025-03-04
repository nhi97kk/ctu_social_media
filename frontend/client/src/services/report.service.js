import createApiClient from "@/services/api.service";

class ReportService {
  constructor(baseURL = "/api/v1/reports") {
    this.api = createApiClient(baseURL);
  }

  async createReport(data) {
    try {
      const response = await this.api.json.post("/", data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}

export default new ReportService();
