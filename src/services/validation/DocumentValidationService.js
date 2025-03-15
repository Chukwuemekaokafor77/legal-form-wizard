// src/services/validation/DocumentValidationService.js
import { pathwayRequirements } from '../../data/pathwayRequirements';

class DocumentValidationService {
  validateRequiredDocuments(category, uploadedDocuments = []) {
    const pathway = pathwayRequirements[category];

    if (!pathway) {
      console.warn(`Pathway requirements not found for category: ${category}`);
      return {
        isValid: true,
        errors: {}
      };
    }

    const missingDocs = pathway.requiredDocuments
      .filter(doc => !doc.optional)
      .filter(doc => !uploadedDocuments.some(uploaded =>
        uploaded.type === doc.id
      ))
      .map(doc => ({
        id: doc.id,
        name: doc.name,
        message: `Missing required document: ${doc.name}`
      }));

    if (missingDocs.length > 0) {
      return {
        isValid: false,
        errors: { documents: missingDocs }
      };
    }

    return {
      isValid: true,
      errors: {}
    };
  }

  validateDocumentQuality(file) {
    const errors = [];

    // Size validation (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      errors.push('File size exceeds 10MB limit');
    }

    // Type validation
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('File must be PDF, JPEG, or PNG');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async validateDocument(file, category, documentType) {
    try {
      // Basic file validation
      const qualityCheck = this.validateDocumentQuality(file);
      if (!qualityCheck.isValid) {
        return qualityCheck;
      }

      // Category-specific validation
      const pathway = pathwayRequirements[category];
      if (!pathway) {
        console.warn(`Pathway requirements not found for category: ${category}`);
        return { isValid: true, errors: [] };
      }

      const docRequirement = pathway.requiredDocuments.find(doc => doc.id === documentType);
      if (!docRequirement) {
        console.warn(`Document requirement not found for type: ${documentType}`);
        return {
          isValid: false,
          errors: ['Document type not required for this category']
        };
      }

      return { isValid: true, errors: [] };
    } catch (error) {
      console.error('Document validation error:', error);
      return {
        isValid: false,
        errors: ['Error validating document']
      };
    }
  }
}

export default new DocumentValidationService();
