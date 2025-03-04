import createApiClient from '@/services/api.service';

class ReportService {
  constructor(baseURL = '/api/v1/reports') {
    this.api = createApiClient(baseURL);
  }

  async getAllReports(query) {
    try {
      const params = new URLSearchParams(query).toString();
      const response = await this.api.json.get(`/?${params}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async resolveReport(reportId) {
    try {
      const response = await this.api.json.patch(`/${reportId}/report/resolve`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async resolveReports(targetId, targetModel) {
    try {
      const response = await this.api.json.patch(
        `/${targetId}/${targetModel}/resolve`,
      );
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async rejectReport(reportId) {
    try {
      const response = await this.api.json.patch(`/${reportId}/report/reject`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async rejectReports(targetId, targetModel) {
    try {
      const response = await this.api.json.patch(
        `/${targetId}/${targetModel}/reject`,
      );
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async hideReport(reportId) {
    try {
      const response = await this.api.json.patch(`/${reportId}/softDelete`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async restoreReport(reportId) {
    try {
      const response = await this.api.json.patch(`/${reportId}/restore`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getReportStatistics() {
    try {
      const response = await this.api.json.get('admin/report-statistics');
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}

export default new ReportService();
