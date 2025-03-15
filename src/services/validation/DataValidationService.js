// src/services/validation/DocumentValidationService.js
import { pathwayRequirements } from '../../data/pathwayRequirements';

class DocumentValidationService {
  validateRequiredDocuments(category, uploadedDocuments = [], formData = {}) {
    const errors = {};
    const pathway = pathwayRequirements[category];

    if (!pathway) {
      console.warn(`Pathway requirements not found for category: ${category}`);
      return {
        isValid: true,
        errors: {}
      };
    }

    // Enhanced: Document requirements aware of conditional logic
    const requiredDocuments = pathway.requiredDocuments.filter(doc => {
      if (doc.conditional) {
        const conditionValue = formData[doc.conditional.field];
        return conditionValue === doc.conditional.value;
      }
      return true;
    });

    const missingDocs = requiredDocuments
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
      errors.documents = missingDocs;
    }

    // Validate document-specific requirements based on case type
    switch (category) {
      case 'joint_divorce':
      case 'simple_divorce':
        this.validateDivorceDocuments(uploadedDocuments, errors);
        break;

      case 'decision_making':
      case 'parenting_order':
        this.validateChildRelatedDocuments(uploadedDocuments, errors);
        break;

      case 'support':
        this.validateFinancialDocuments(uploadedDocuments, errors);
        break;

      case 'property_division':
        this.validatePropertyDocuments(uploadedDocuments, errors);
        break;

      case 'enforcement':
        this.validateEnforcementDocuments(uploadedDocuments, errors);
        break;

      default:
        console.warn(`No specific document validations defined for category: ${category}`);
        break;
    }

    // Document quality checks
    const qualityErrors = this.validateDocumentQuality(uploadedDocuments);
    if (qualityErrors.length > 0) {
      errors.quality = qualityErrors;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  validateDivorceDocuments(documents, errors) {
    if (!documents.some(doc =>
      doc.type === 'marriage_certificate' &&
      doc.verified
    )) {
      errors.marriageCertificate = "A verified marriage certificate is required for divorce applications.";
    }
  }

  validateChildRelatedDocuments(documents, errors) {
    if (!documents.some(doc =>
      doc.type === 'children_birth_certificates' &&
      doc.verified
    )) {
      errors.childBirthCertificates = "Verified birth certificates are required for all children involved in the application.";
    }
  }

  validateFinancialDocuments(documents, errors) {
    const hasFinancialStatement = documents.some(doc =>
      doc.type === 'financial_statement' &&
      doc.verified
    );

    const hasIncomeProof = documents.some(doc =>
      doc.type === 'income_proof' &&
      doc.verified
    );

    if (!hasFinancialStatement) {
      errors.financialStatement = "A verified financial statement is required for support applications.";
    }

    if (!hasIncomeProof) {
      errors.incomeProof = "Verified proof of income is required for support calculations.";
    }
  }

  validatePropertyDocuments(documents, errors) {
    const hasFinancialStatement = documents.some(doc =>
      doc.type === 'financial_statement' &&
      doc.verified
    );

    const hasPropertyDocs = documents.some(doc =>
      doc.type === 'property_documents' &&
      doc.verified
    );

    if (!hasFinancialStatement) {
      errors.financialStatement = "A financial statement is required to assess property division.";
    }

    if (!hasPropertyDocs) {
      errors.propertyDocuments = "Relevant property documents (deeds, mortgage statements) are required.";
    }
  }

  validateEnforcementDocuments(documents, errors) {
    const hasDomesticContract = documents.some(doc =>
      doc.type === 'domestic_contract' &&
      doc.verified
    );

    if (!hasDomesticContract) {
      errors.domesticContract = "A verified copy of the domestic contract is required for enforcement.";
    }
  }

  validateDocumentQuality(documents) {
    const errors = [];

    for (const doc of documents) {
      // Check file size (max 10MB)
      if (doc.size > 10 * 1024 * 1024) {
        errors.push({
          id: doc.id,
          message: `${doc.name} exceeds maximum file size of 10MB`
        });
      }

      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(doc.mimeType)) {
        errors.push({
          id: doc.id,
          message: `${doc.name} must be a PDF, JPEG, or PNG file`
        });
      }

      // Check document clarity/quality if it's an image
      if (doc.mimeType.startsWith('image/') && doc.quality < 0.7) {
        errors.push({
          id: doc.id,
          message: `${doc.name} image quality is too low. Please provide a clearer copy`
        });
      }
    }

    return errors;
  }
}

export default new DocumentValidationService();
