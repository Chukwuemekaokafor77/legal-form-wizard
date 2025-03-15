// src/services/forms/FormValidationService.js
class FormValidationService {
    validateField(value, rules) {
      if (!rules) return true;
      
      const validationRules = JSON.parse(rules);
      let isValid = true;
      let errorMessage = '';
  
      if (validationRules.required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
      }
  
      if (validationRules.pattern && value) {
        const regex = new RegExp(validationRules.pattern);
        if (!regex.test(value)) {
          isValid = false;
          errorMessage = validationRules.patternMessage || 'Invalid format';
        }
      }
  
      if (validationRules.minLength && value?.length < validationRules.minLength) {
        isValid = false;
        errorMessage = `Minimum length is ${validationRules.minLength}`;
      }
  
      return { isValid, errorMessage };
    }
  
    validateForm(formData, fields) {
      const errors = {};
      
      fields.forEach(field => {
        const { isValid, errorMessage } = this.validateField(
          formData[field.field_name],
          field.validation_rules
        );
        
        if (!isValid) {
          errors[field.field_name] = errorMessage;
        }
      });
  
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    }
  }
  
  export default new FormValidationService();