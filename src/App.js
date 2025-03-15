// src/App.js
import { GlobalWorkerOptions } from 'pdfjs-dist';
GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
import React, { useState, useEffect, useCallback } from "react";
import StepWizard from "react-step-wizard";
import { jsPDF } from "jspdf";
import EnhancedFormWizard from './components/wizard/EnhancedFormWizard';

import {
  ChecklistStep,
  ProvinceStep,
  Step1,
  Step2,
  Step3,
  Step4,  // Import Step4
  Step5,  // Import Step5
  Step6,  // Import Step6
  ReviewStep,
  FormGenerationStep
} from './components/wizard';
import { StepWrapper } from './components/wizard/StepWrapper';
import {
  LegalTermTooltip,
  ProgressBar,
  LegalDisclaimer,
  ErrorMessage,
  CustomNavigation,
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
import { 
  validateEmail, 
  validatePhone, 
  validatePostalCode, 
  validateAge,
  validateRequiredDocuments 
} from './utils/validation';
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
  const totalSteps = 9;  // Updated total steps

  const { isGuest, guestSessionTimeRemaining, startGuestSession } = useGuestSession(GUEST_SESSION_TIMEOUT);

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
        setRequiredDocuments(pathway.requiredDocuments);
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

      if (!isGuest) {
        await SessionService.saveProgress(newAnswers);
      }
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  }, [answers, isGuest]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate required documents
      const missingDocs = await DocumentValidationService.validateRequiredDocuments(
        answers.legalCategory,
        answers.uploadedDocuments
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

  if (isLoading) {
    return (
      <div className="wizard-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Legal Form Wizard</h1>
      
      {isGuest && (
        <GuestUserBanner 
          timeRemaining={guestSessionTimeRemaining}
          requiresAccount={pathwayRequirements[answers.legalCategory]?.requiresAccount}
        />
      )}

      {error && <ErrorMessage message={error} />}

      <ProgressBar 
        currentStep={currentStep} 
        totalSteps={totalSteps}
        timeEstimate={timeEstimate}
      />

      {requiredDocuments.length > 0 && (
        <RequiredDocumentsList documents={requiredDocuments} />
      )}

      <StepWizard
        isHashEnabled
        nav={<CustomNavigation isGuest={isGuest} />}
        onStepChange={(stats) => {
          setCurrentStep(stats.activeStep);
          if (!isGuest) {
            SessionService.saveProgress(answers);
          }
        }}
      >
        <StepWrapper>
          <ChecklistStep 
            hashKey={"checklist"}
            onChange={handleChange} 
            answers={answers}
            onLearnMore={handleLearnMore}
          />
        </StepWrapper>
        <StepWrapper>
          <ProvinceStep 
            hashKey={"province"}
            onChange={handleChange} 
            answers={answers}
            onLearnMore={handleLearnMore}
          />
        </StepWrapper>
        <StepWrapper>
          <Step1 
            hashKey={"legal-category"}
            onChange={handleChange} 
            answers={answers}
            onLearnMore={handleLearnMore}
          />
        </StepWrapper>
        <StepWrapper>
          <Step2 
            hashKey={"personal-info"}
            onChange={handleChange} 
            answers={answers}
            onLearnMore={handleLearnMore}
          />
        </StepWrapper>
        <StepWrapper>
          <Step3 
            hashKey={"case-description"}
            onChange={handleChange} 
            answers={answers}
            onLearnMore={handleLearnMore}
          />
        </StepWrapper>
        <StepWrapper>
          <Step4  // Add Step4
            hashKey={"upload-documents"}
            onChange={handleChange}
            answers={answers}
            onLearnMore={handleLearnMore}
          />
        </StepWrapper>
        <StepWrapper>
          <Step5  // Add Step5
            hashKey={"review-information"}
            answers={answers}
            onLearnMore={handleLearnMore}
          />
        </StepWrapper>
         <StepWrapper>
          <Step6 // Add Step6
            hashKey={"confirmation"}
            answers={answers}
            onLearnMore={handleLearnMore}
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
  );
};

export default App;
