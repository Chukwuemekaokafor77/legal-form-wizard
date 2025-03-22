
// src/App.js - Update with our improved components
import React, { useState, useEffect, useCallback } from "react";
import StepWizard from "react-step-wizard";
import { ThemeProvider } from './components/ui/Theme';
import { WizardNavigation } from './components/ui/WizardNavigation';
import { WizardDashboard } from './components/ui/WizardDashboard';
import { EnhancedFormAssistant } from './components/assistant/EnhancedFormAssistant';
import { EnhancedDocumentUploader } from './components/documents/EnhancedDocumentUploader';

import {
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
} from './components/wizard';
import { StepWrapper } from './components/wizard/StepWrapper';
import {
  LegalTermTooltip,
  ProgressBar,
  LegalDisclaimer,
  ErrorMessage,
  GuestUserBanner,
  LearnMoreModal,
  RequiredDocumentList
} from './components/ui';
import { 
  FormService, 
  PDFService, 
  SessionService, 
  UserService,
  DocumentValidationService 
} from './services';
import DataTransformationService from './services/transformation/DataTransformationService';
import { validateEmail, validatePhone, validatePostalCode, validateAge } from './utils/validation';
import useGuestSession from './hooks/useGuestSession';
import { legalTermsGlossary } from './data/legalTermsGlossary';
import { pathwayRequirements } from './data/pathwayRequirements';
import "./App.css";

const GUEST_SESSION_TIMEOUT = 14400; // 4 hours in seconds

const App = () => {
  const [answers, setAnswers] = useState({});
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [timeEstimate, setTimeEstimate] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatedForms, setGeneratedForms] = useState([]);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [learnMoreContent, setLearnMoreContent] = useState('');
  const [requiredDocuments, setRequiredDocuments] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [completedSections, setCompletedSections] = useState([]);
  const [formProgress, setFormProgress] = useState(0);
  
  const totalSteps = 9;

  const { isGuest, guestSessionTimeRemaining, startGuestSession } = useGuestSession({
    timeout: GUEST_SESSION_TIMEOUT,
    onExpire: () => {
      alert("Your session has expired. Please refresh the page to start a new session.");
    }
  });

  // Load saved progress on mount
  useEffect(() => {
    const loadSavedProgress = async () => {
      try {
        if (isGuest) {
          startGuestSession();
        } else {
          const savedProgress = await SessionService.loadProgress();
          if (savedProgress) {
            setAnswers(savedProgress.answers);
            setDisclaimerAccepted(true);
            setCompletedSections(savedProgress.completedSections || []);
            setFormProgress(savedProgress.progress || 0);
            
            if (savedProgress.uploadedDocuments) {
              setUploadedDocuments(savedProgress.uploadedDocuments);
            }
            
            const stepMatch = savedProgress.lastStep.match(/#step-(\d+)/);
            if (stepMatch) {
              setCurrentStep(parseInt(stepMatch[1]));
            }
          }
        }
      } catch (err) {
        console.error('Error loading progress:', err);
        setError('Failed to load saved progress');
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedProgress();
  }, [isGuest, startGuestSession]);

  // Update time estimate and required documents when category changes
  useEffect(() => {
    if (answers.legalCategory) {
      const pathway = pathwayRequirements[answers.legalCategory];
      if (pathway) {
        setTimeEstimate(pathway.estimatedTime);
        setRequiredDocuments(pathway.requiredDocuments || []);
      }
    }
  }, [answers.legalCategory]);

  const handleChange = useCallback(async (value) => {
    try {
      const newAnswers = { ...answers, ...value };
      setAnswers(newAnswers);
      
      // Check if category requires account
      if (value.legalCategory) {
        const pathway = pathwayRequirements[value.legalCategory];
        if (pathway?.requiresAccount && isGuest) {
          setError('This form requires creating an account to proceed');
          return;
        }
      }

      // Update progress
      const totalFields = countTotalFields();
      const filledFields = countFilledFields(newAnswers);
      const newProgress = Math.round((filledFields / totalFields) * 100);
      setFormProgress(newProgress);

      if (!isGuest) {
        setIsSaving(true);
        await SessionService.saveProgress({
          answers: newAnswers,
          completedSections,
          progress: newProgress,
          uploadedDocuments
        });
        setIsSaving(false);
      }
    } catch (err) {
      console.error('Error saving progress:', err);
      setIsSaving(false);
    }
  }, [answers, isGuest, completedSections, uploadedDocuments]);

  // Helper functions for calculating progress
  const countTotalFields = () => {
    // This would be more sophisticated in a real app
    return 50; // Placeholder value
  };

  const countFilledFields = (data) => {
    // This would count all filled fields recursively in a real app
    let count = 0;
    const countFields = (obj) => {
      if (!obj) return;
      if (typeof obj === 'object') {
        Object.values(obj).forEach(value => {
          if (value !== null && value !== undefined && value !== '') {
            count++;
          }
          if (typeof value === 'object') {
            countFields(value);
          }
        });
      }
    };
    
    countFields(data);
    return count;
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate required documents
      const missingDocs = await DocumentValidationService.validateRequiredDocuments(
        answers.legalCategory,
        uploadedDocuments
      );

      if (missingDocs.length > 0) {
        setError(`Missing required documents: ${missingDocs.join(', ')}`);
        return;
      }

      const transformedData = DataTransformationService.transformForBackend(answers);
      const forms = await FormService.generateMultipleForms(transformedData);
      setGeneratedForms(forms);

      // Generate both PDF and Word versions
      for (const form of forms) {
        await PDFService.generatePDF(form);
        await PDFService.generateWord(form);
      }

      if (!isGuest) {
        await SessionService.clearProgress();
      }

      // Show success message
      alert("Your forms have been generated successfully!");

    } catch (err) {
      console.error('Error submitting forms:', err);
      setError('Failed to generate forms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLearnMore = (content) => {
    setLearnMoreContent(content);
    setShowLearnMore(true);
  };

  const handleDocumentUpload = (document) => {
    setUploadedDocuments(prev => [...prev, document]);
    
    // Save progress
    if (!isGuest) {
      SessionService.saveProgress({
        answers,
        completedSections,
        progress: formProgress,
        uploadedDocuments: [...uploadedDocuments, document]
      });
    }
  };

  const handleSaveProgress = async () => {
    if (isGuest) {
      alert("Please create an account to save your progress");
      return;
    }
    
    try {
      setIsSaving(true);
      await SessionService.saveProgress({
        answers,
        completedSections,
        progress: formProgress,
        uploadedDocuments
      });
      setIsSaving(false);
      alert("Progress saved successfully!");
    } catch (err) {
      console.error('Error saving progress:', err);
      setIsSaving(false);
      setError('Failed to save progress');
    }
  };

  const completeSection = (section) => {
    if (!completedSections.includes(section)) {
      const newCompletedSections = [...completedSections, section];
      setCompletedSections(newCompletedSections);
      
      // Save progress
      if (!isGuest) {
        SessionService.saveProgress({
          answers,
          completedSections: newCompletedSections,
          progress: formProgress,
          uploadedDocuments
        });
      }
    }
  };

  if (isLoading) {
    return (
      <ThemeProvider>
        <div className="wizard-container">
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="App">
        <h1 className="text-2xl font-bold text-center mb-6">Legal Form Wizard</h1>
        
        {isGuest && (
          <GuestUserBanner 
            timeRemaining={guestSessionTimeRemaining}
            requiresAccount={pathwayRequirements[answers.legalCategory]?.requiresAccount}
          />
        )}

        {error && <ErrorMessage message={error} />}

        {/* Dashboard overview */}
        <WizardDashboard 
          progress={formProgress}
          currentStep={currentStep}
          totalSteps={totalSteps}
          timeEstimate={timeEstimate}
          requiredDocuments={requiredDocuments}
          uploadedDocuments={uploadedDocuments}
          completedSections={completedSections}
          onNavigateToStep={(step) => setCurrentStep(step)}
        />

        <StepWizard
          isHashEnabled
          nav={<WizardNavigation 
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={() => {/* handled by steps */}}
            onPrevious={() => {/* handled by steps */}}
            onSave={handleSaveProgress}
            isSaving={isSaving}
          />}
          onStepChange={(stats) => {
            setCurrentStep(stats.activeStep);
            if (!isGuest) {
              SessionService.saveProgress({
                answers,
                lastStep: `#step-${stats.activeStep}`,
                completedSections,
                progress: formProgress,
                uploadedDocuments
              });
            }
          }}
        >
          <StepWrapper>
            <ChecklistStep 
              hashKey={"checklist"}
              onChange={handleChange} 
              answers={answers}
              onLearnMore={handleLearnMore}
              onComplete={() => completeSection('checklist')}
            />
          </StepWrapper>
          <StepWrapper>
            <ProvinceStep 
              hashKey={"province"}
              onChange={handleChange} 
              answers={answers}
              onLearnMore={handleLearnMore}
              onComplete={() => completeSection('province')}
            />
          </StepWrapper>
          <StepWrapper>
            <Step1 
              hashKey={"legal-category"}
              onChange={handleChange} 
              answers={answers}
              onLearnMore={handleLearnMore}
              onComplete={() => completeSection('category')}
            />
          </StepWrapper>
          <StepWrapper>
            <div>
              <Step2 
                hashKey={"personal-info"}
                onChange={handleChange} 
                answers={answers}
                onLearnMore={handleLearnMore}
                onComplete={() => completeSection('personal')}
              />
              
              {/* Add the enhanced form assistant */}
              <div className="mt-6">
                <EnhancedFormAssistant
                  section="Personal Information"
                  fieldDefinitions={[
                    {
                      id: "personalInfo.fullName",
                      label: "Full Name",
                      type: "text",
                      required: true,
                      friendlyQuestion: "What is your full legal name?",
                      helpText: "Enter your name exactly as it appears on legal documents"
                    },
                    {
                      id: "personalInfo.dateOfBirth",
                      label: "Date of Birth",
                      type: "date",
                      required: true,
                      friendlyQuestion: "What is your date of birth?",
                      helpText: "Use format YYYY-MM-DD"
                    },
                    {
                      id: "personalInfo.contact.email",
                      label: "Email",
                      type: "email",
                      required: true,
                      friendlyQuestion: "What email address should we use to contact you?"
                    },
                    {
                      id: "personalInfo.contact.phone",
                      label: "Phone Number",
                      type: "tel",
                      required: true,
                      friendlyQuestion: "What phone number can you be reached at?"
                    }
                  ]}
                  currentValues={answers.personalInfo || {}}
                  onUpdate={(values) => handleChange({ personalInfo: { ...answers.personalInfo, ...values }})}
                />
              </div>
            </div>
          </StepWrapper>
          <StepWrapper>
            <Step3 
              hashKey={"case-description"}
              onChange={handleChange} 
              answers={answers}
              onLearnMore={handleLearnMore}
              onComplete={() => completeSection('case')}
            />
          </StepWrapper>
          <StepWrapper>
            <div>
              <h2 className="text-xl font-semibold mb-6">Upload Required Documents</h2>
              
              <div className="space-y-6">
                {requiredDocuments.filter(doc => !doc.optional).map(doc => (
                  <EnhancedDocumentUploader
                    key={doc.id}
                    documentType={doc.id}
                    documentName={doc.name}
                    description={doc.description}
                    onUpload={handleDocumentUpload}
                    onAnalysisComplete={(formFields) => {
                      // Pre-fill form with extracted data
                      handleChange(formFields);
                    }}
                    required={true}
                  />
                ))}
                
                {requiredDocuments.filter(doc => doc.optional).length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Optional Documents</h3>
                    
                    <div className="space-y-6">
                      {requiredDocuments.filter(doc => doc.optional).map(doc => (
                        <EnhancedDocumentUploader
                          key={doc.id}
                          documentType={doc.id}
                          documentName={doc.name}
                          description={doc.description}
                          onUpload={handleDocumentUpload}
                          onAnalysisComplete={(formFields) => {
                            handleChange(formFields);
                          }}
                          required={false}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium flex items-center gap-2 mb-2">
                  <HelpCircle className="text-blue-500" size={18} />
                  Document Tips
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Make sure documents are clear and all text is legible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Our AI will automatically extract data from your documents to help fill your forms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>All documents are processed securely and not stored permanently</span>
                  </li>
                </ul>
              </div>
            </div>
          </StepWrapper>
          <StepWrapper>
            <Step5  
              hashKey={"review-information"}
              answers={answers}
              onLearnMore={handleLearnMore}
              uploadedDocuments={uploadedDocuments}
            />
          </StepWrapper>
          <StepWrapper>
            <Step6 
              hashKey={"confirmation"}
              answers={answers}
              onLearnMore={handleLearnMore}
              onComplete={() => completeSection('confirmation')}
            />
          </StepWrapper>
          <StepWrapper>
            <ReviewStep 
              hashKey={"review"}
              answers={answers}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              generatedForms={generatedForms}
              onLearnMore={handleLearnMore}
              uploadedDocuments={uploadedDocuments}
              onEdit={() => setCurrentStep(2)} // Go back to personal info
            />
          </StepWrapper>
          <StepWrapper>
            <FormGenerationStep 
              hashKey={"generate-forms"}
              answers={answers}
              courtType={answers.province === "New Brunswick" ? "Supreme" : ""}
              generatedForms={generatedForms}
              onLearnMore={handleLearnMore}
            />
          </StepWrapper>
        </StepWizard>

        {showLearnMore && (
          <LearnMoreModal
            content={learnMoreContent}
            onClose={() => setShowLearnMore(false)}
          />
        )}

        <LegalTermTooltip terms={legalTermsGlossary} />
        <LegalDisclaimer accepted={disclaimerAccepted} onAccept={setDisclaimerAccepted} />
      </div>
    </ThemeProvider>
  );
};

export default App;