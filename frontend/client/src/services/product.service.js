import createApiClient from "@/services/api.service";
import slugify from "slugify";

class ProductService {
  constructor(baseURL = "/api/v1/products") {
    this.api = createApiClient(baseURL);
  }

  async getAllProducts(query) {
    try {
      const params = new URLSearchParams(query).toString();
      const response = await this.api.json.get(`/?${params}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async createProduct(data) {
    try {
      const response = await this.api.json.post("/", data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async createProductImages(productId, formData) {
    try {
      const response = await this.api.formData.post(
        `/${productId}/images`,
        formData
      );
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getProduct(productId) {
    try {
      const response = await this.api.json.get(`/${productId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getFilterProduct(filter) {
    try {
      const params = new URLSearchParams(filter).toString();
      const response = await this.api.json.get(`/filter/?${params}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getAllFilterProduct(filter) {
    try {
      const params = new URLSearchParams(filter).toString();
      const response = await this.api.json.get(`all/filter/?${params}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async updateSoldProduct(productId) {
    try {
      const response = await this.api.json.patch(`/${productId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async searchProducts(query) {
    try {
      const params = new URLSearchParams(query).toString();
      const response = await this.api.json.get(`/?${params}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}

export default new ProductService();
