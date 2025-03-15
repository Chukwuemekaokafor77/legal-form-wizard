// src/components/ui/CustomNavigation.js
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const CustomNavigation = ({ 
  nextStep, 
  previousStep, 
  currentStep, 
  totalSteps,
  isLoading = false,
  isValid = true,
  nextLabel = "Next",
  previousLabel = "Previous",
  className = ""
}) => {
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  return (
    <nav className={`flex justify-between items-center mt-6 ${className}`} aria-label="Form navigation">
      <button 
        onClick={previousStep}
        disabled={isFirstStep || isLoading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded
          transition-all duration-200
          ${isFirstStep 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        type="button"
        aria-label="Previous step"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        {previousLabel}
      </button>

      <div className="text-sm text-gray-500" aria-live="polite">
        Step {currentStep} of {totalSteps}
      </div>

      <button 
        onClick={nextStep}
        disabled={isLastStep || isLoading || !isValid}
        className={`
          flex items-center gap-2 px-4 py-2 rounded
          transition-all duration-200
          ${isLastStep 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isLoading ? 'animate-pulse' : ''}
          ${!isValid ? 'bg-gray-300 cursor-not-allowed' : ''}
        `}
        type="button"
        aria-label={isLastStep ? "Submit form" : "Next step"}
      >
        {nextLabel}
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </nav>
  );
};

// Optional Form Navigation variant
export const FormNavigation = ({ 
  onNext, 
  onPrevious, 
  currentStep, 
  totalSteps,
  isLoading,
  isValid,
  saveProgress
}) => {
  const handleNext = async (event) => {
    event.preventDefault(); // Prevent default form submission
    if (saveProgress) {
      await saveProgress();
    }
    onNext();
  };

  return (
    <div className="border-t pt-4 mt-6">
      <CustomNavigation
        nextStep={handleNext}
        previousStep={onPrevious}
        currentStep={currentStep}
        totalSteps={totalSteps}
        isLoading={isLoading}
        isValid={isValid}
        nextLabel={currentStep === totalSteps ? "Submit" : "Next"}
        previousLabel="Back"
        className="max-w-md mx-auto"
      />
    </div>
  );
};
