// src/components/ui/WizardNavigation.jsx
import React from 'react';
import { ChevronLeft, ChevronRight, Save, Check } from 'lucide-react';

export const WizardNavigation = ({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isLastStep = false,
  isNextDisabled = false,
  onSave,
  isSaving = false
}) => {
  return (
    <div className="flex items-center justify-between mt-8 border-t pt-6">
      <div className="flex-1">
        <button
          onClick={onPrevious}
          disabled={currentStep === 1}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700
            border border-gray-300 hover:bg-gray-50 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <ChevronLeft size={20} />
          <span>Previous</span>
        </button>
      </div>
      
      <div className="flex-shrink-0 flex items-center text-sm text-gray-500">
        Step {currentStep} of {totalSteps}
      </div>
      
      <div className="flex-1 flex justify-end gap-3">
        {onSave && (
          <button
            onClick={onSave}
            disabled={isSaving}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700
              border border-gray-300 hover:bg-gray-50 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <Save size={18} />
            <span>{isSaving ? 'Saving...' : 'Save Progress'}</span>
          </button>
        )}
        
        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className={`
            flex items-center gap-2 px-6 py-2 rounded-lg text-white
            bg-blue-600 hover:bg-blue-700 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <span>{isLastStep ? 'Submit' : 'Continue'}</span>
          {isLastStep ? <Check size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
};