// src/services/forms/TemplateValidationService.js
class TemplateValidationService {
    validateTemplate(template, formId) {
      const errors = [];
      
      // Check required fields based on form type
      const requiredFields = this.getRequiredFields(formId);
      const missingFields = requiredFields.filter(
        field => !template.fields.some(f => f.name === field)
      );
      
      if (missingFields.length > 0) {
        errors.push(`Missing required fields: ${missingFields.join(', ')}`);
      }
  
      // Validate field types
      template.fields.forEach(field => {
        if (!this.isValidFieldType(field.type)) {
          errors.push(`Invalid field type: ${field.type} for field ${field.name}`);
        }
      });
  
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  
    getRequiredFields(formId) {
      // Define required fields for each form type
      const requiredFieldsMap = {
        '72A': [
          'applicantName',
          'applicantAddress',
          'respondentName',
          'respondentAddress',
          'courtLocation'
        ],
        '72B': [
          'petitionerName',
          'petitionerAddress',
          'respondentName',
          'marriageDate',
          'separationDate'
        ],
        '72J': [
          'name',
          'address',
          'occupation',
          'employer',
          'annualIncome'
        ]
      };
  
      return requiredFieldsMap[formId] || [];
    }
  
    isValidFieldType(type) {
      const validTypes = [
        'PDFTextField',
        'PDFCheckBox',
        'PDFRadioGroup',
        'PDFSignature'
      ];
      return validTypes.includes(type);
    }
  
    validateFieldMapping(mapping, templateFields, formData) {
      const errors = [];
      
      // Check all required fields are mapped
      templateFields
        .filter(field => field.isRequired)
        .forEach(field => {
          const mappedField = mapping[field.name];
          if (!mappedField) {
            errors.push(`Required field ${field.name} is not mapped`);
            return;
          }
  
          // Check if mapped field exists in form data
          const value = this.getNestedValue(formData, mappedField);
          if (value === undefined) {
            errors.push(`Mapped field ${mappedField} not found in form data`);
          }
        });
  
      // Validate field type compatibility
      Object.entries(mapping).forEach(([templateField, formField]) => {
        const field = templateFields.find(f => f.name === templateField);
        if (field) {
          const value = this.getNestedValue(formData, formField);
          if (!this.isCompatibleType(field.type, value)) {
            errors.push(
              `Field type mismatch: ${field.name} expects ${field.type} but got ${typeof value}`
            );
          }
        }
      });
  
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  
    isCompatibleType(fieldType, value) {
      switch (fieldType) {
        case 'PDFTextField':
          return typeof value === 'string' || typeof value === 'number';
        case 'PDFCheckBox':
          return typeof value === 'boolean';
        case 'PDFRadioGroup':
          return typeof value === 'string';
        case 'PDFSignature':
          return typeof value === 'string';
        default:
          return false;
      }
    }
  
    getNestedValue(obj, path) {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }
  }
  
  export default new TemplateValidationService();