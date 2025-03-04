import createApiClient from './api.service';
class GroupService {
  constructor(baseUrl = '/api/v1/groups') {
    this.api = createApiClient(baseUrl);
  }

  async getAllGroups(query) {
    try {
      const params = new URLSearchParams(query).toString();
      const response = await this.api.json.get(`/?${params}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async createGroup(data) {
    try {
      const response = await this.api.json.post('/', data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async uploadAvatar(groupId, formData) {
    try {
      const response = await this.api.formData.patch(
        `/avatarUpload/${groupId}`,
        formData,
      );
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async uploadCover(groupId, formData) {
    try {
      const response = await this.api.formData.patch(
        `/coverUpload/${groupId}`,
        formData,
      );
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getGroup(groupId) {
    try {
      const response = await this.api.json.get(`/${groupId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async updateGroup(groupId, data) {
    try {
      const response = await this.api.json.patch(`/${groupId}`, data);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async updateApprovedGroup(groupId) {
    try {
      const response = await this.api.json.patch(`/${groupId}/approved`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async updateRejectedGroup(groupId) {
    try {
      const response = await this.api.json.patch(`/${groupId}/rejected`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async hideGroup(groupId) {
    try {
      const response = await this.api.json.patch(`/${groupId}/softDelete`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async deleteGroup(groupId) {
    try {
      const response = await this.api.json.delete(`/${groupId}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async searchGroups(name) {
    try {
      const slug = slugify(name);
      const response = await this.api.json.get(`/search?slug=${slug}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async sendRequest(groupId) {
    try {
      const response = await this.api.json.post(`/${groupId}/join`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async accept(groupId, userId) {
    return (await this.api.json.patch(`/${groupId}/accept/${userId}`)).data;
  }

  async delete(groupId, userId) {
    return (await this.api.json.patch(`/${groupId}/delete/${userId}`)).data;
  }

  async leave(groupId) {
    try {
      const response = await this.api.json.delete(`/${groupId}/leave`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getAllUserGroups(id) {
    try {
      const response = await this.api.json.get(`/all/${id}`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getSuggestGroups() {
    try {
      const response = await this.api.json.get('/suggested');
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getJoinedGroups() {
    try {
      const response = await this.api.json.get('/joined');
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getGroupJoinRequests(groupId) {
    try {
      const response = await this.api.json.get(`/${groupId}/requests`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }

  async getGroupMembers(groupId) {
    try {
      const response = await this.api.json.get(`/${groupId}/members`);
      return response.data;
    } catch (err) {
      return err.response.data;
    }
  }
}
export default new GroupService();
