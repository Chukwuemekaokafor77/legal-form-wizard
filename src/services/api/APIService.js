// src/services/api/APIService.js
class APIService {
    constructor() {
      this.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
      this.headers = {
        'Content-Type': 'application/json'
      };
    }
  
    setAuthToken(token) {
      if (token) {
        this.headers['Authorization'] = `Bearer ${token}`;
      } else {
        delete this.headers['Authorization'];
      }
    }
  
    async generateForms(formData) {
      try {
        const response = await fetch(`${this.baseURL}/forms/generate`, {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify(formData)
        });
  
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to generate forms');
        }
  
        return await response.json();
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    }
  
    async getFormPreview(formId, formData) {
      try {
        const response = await fetch(`${this.baseURL}/forms/${formId}/preview`, {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify(formData)
        });
  
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to get form preview');
        }
  
        return await response.json();
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    }
  
    async validateForm(formId, formData) {
      try {
        const response = await fetch(`${this.baseURL}/forms/${formId}/validate`, {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify(formData)
        });
  
        return await response.json();
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    }
  
    async getFormTemplate(formId) {
      try {
        const response = await fetch(`${this.baseURL}/forms/${formId}/template`, {
          headers: this.headers
        });
  
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to get form template');
        }
  
        return await response.json();
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    }
  
    async getFormsList(province, category) {
      try {
        const response = await fetch(
          `${this.baseURL}/forms?province=${province}&category=${category}`,
          { headers: this.headers }
        );
  
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to get forms list');
        }
  
        return await response.json();
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    }
  }
  
  export default new APIService();
  