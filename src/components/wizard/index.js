// src/components/wizard/index.js
import { StepWrapper } from './StepWrapper';
import ChecklistStep from './ChecklistStep';
import ProvinceStep from './ProvinceStep';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';
import ReviewStep from './ReviewStep';
import FormGenerationStep from './FormGenerationStep';

// Define step metadata for the wizard
export const WIZARD_STEPS = {
  CHECKLIST: {
    id: 'checklist',
    title: 'Document Checklist',
    description: 'Review required documents',
    component: ChecklistStep,
    requiredDocuments: true
  },
  PROVINCE: {
    id: 'province',
    title: 'Select Province',
    description: 'Choose your jurisdiction',
    component: ProvinceStep
  },
  LEGAL_CATEGORY: {
    id: 'legal-category',
    title: 'Legal Category',
    description: 'Select type of legal matter',
    component: Step1
  },
  PERSONAL_INFO: {
    id: 'personal-info',
    title: 'Personal Information',
    description: 'Enter your details',
    component: Step2,
    validation: true
  },
  CASE_DESCRIPTION: {
    id: 'case-description',
    title: 'Case Details',
    description: 'Describe your legal matter',
    component: Step3,
    validation: true
  },
  UPLOAD_DOCUMENTS: {
    id: 'upload-documents',
    title: 'Upload Documents',
    description: 'Upload required documents',
    component: Step4,
    validation: true
  },
  REVIEW_INFORMATION: {
    id: 'review-information',
    title: 'Review Information',
    description: 'Review your information',
    component: Step5
  },
  CONFIRMATION: {
    id: 'confirmation',
    title: 'Confirmation',
    description: 'Confirm and submit',
    component: Step6
  },
  REVIEW: {
    id: 'review',
    title: 'Final Review',
    description: 'Review and confirm details',
    component: ReviewStep
  },
  GENERATE_FORMS: {
    id: 'generate-forms',
    title: 'Generate Forms',
    description: 'Generate and download forms',
    component: FormGenerationStep,
    requiresDocuments: true
  }
};

// Order of steps in the wizard
export const WIZARD_FLOW = [
  WIZARD_STEPS.CHECKLIST,
  WIZARD_STEPS.PROVINCE,
  WIZARD_STEPS.LEGAL_CATEGORY,
  WIZARD_STEPS.PERSONAL_INFO,
  WIZARD_STEPS.CASE_DESCRIPTION,
  WIZARD_STEPS.UPLOAD_DOCUMENTS,
  WIZARD_STEPS.REVIEW_INFORMATION,
  WIZARD_STEPS.CONFIRMATION,
  WIZARD_STEPS.REVIEW,
  WIZARD_STEPS.GENERATE_FORMS
];

// Helper functions for wizard navigation
export const getNextStep = (currentStepId) => {
  const currentIndex = WIZARD_FLOW.findIndex(step => step.id === currentStepId);
  return currentIndex < WIZARD_FLOW.length - 1 ? WIZARD_FLOW[currentIndex + 1] : null;
};

export const getPreviousStep = (currentStepId) => {
  const currentIndex = WIZARD_FLOW.findIndex(step => step.id === currentStepId);
  return currentIndex > 0 ? WIZARD_FLOW[currentIndex - 1] : null;
};

export const canProceedToStep = (stepId, answers = {}, documents = []) => {
  const step = Object.values(WIZARD_STEPS).find(s => s.id === stepId);
  if (!step) return false;

  // Check if required documents are uploaded
  if (step.requiredDocuments && (!documents || documents.length === 0)) {
    return false;
  }

  // Check if previous steps are completed
  const currentIndex = WIZARD_FLOW.findIndex(s => s.id === stepId);
  const previousSteps = WIZARD_FLOW.slice(0, currentIndex);
  
  return previousSteps.every(prevStep => {
    // Check if step has required answers
    if (prevStep.validation) {
      return answers[prevStep.id] && Object.keys(answers[prevStep.id]).length > 0;
    }
    return true;
  });
};

// Export individual components
export {
  StepWrapper,
  ChecklistStep,
  ProvinceStep,
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
  ReviewStep,
  FormGenerationStep
};