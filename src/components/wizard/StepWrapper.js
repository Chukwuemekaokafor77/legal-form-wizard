// src/components/wizard/StepWrapper.js
import React, { useState, useEffect } from 'react';
import {
  LegalDisclaimer,
  SaveProgressButton,
  AutoSaveIndicator,
  ProgressTracker
} from '../ui';
import { AlertCircle, Info } from 'lucide-react';

export const StepWrapper = ({
  children,
  step,
  totalSteps,
  steps,
  completedSteps,
  isLoading,
  error,
  onSave,
  isSaving,
  lastSaved,
  showProgress = true,
  className = '',
  estimatedTimes,
  onStepClick
}) => {
  const [showHelp, setShowHelp] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');

  useEffect(() => {
    setAutoSaveStatus(isSaving ? 'saving' : error ? 'error' : 'saved');
  }, [isSaving, error]);

  return (
    <div className={`flex flex-col min-h-full ${className}`}>
      {/* Progress Tracking */}
      {showProgress && (
        <div className="mb-6">
          <ProgressTracker
            currentStep={step}
            totalSteps={totalSteps}
            steps={steps}
            completedSteps={completedSteps}
            estimatedTimes={estimatedTimes}
            onStepClick={onStepClick}
          />
        </div>
      )}

      {/* Save Status and Controls */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between">
          <AutoSaveIndicator status={autoSaveStatus} />
          <div className="flex items-center gap-2">
            {error && (
              <div className="flex items-center text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span>Error saving progress</span>
              </div>
            )}
            <SaveProgressButton
              onSave={onSave}
              saving={isSaving}
              lastSaved={lastSaved}
              variant="outline"
              size="small"
            />
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              title="Help"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Help Panel */}
      {showHelp && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-2">Help & Information</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <Info className="w-4 h-4 mt-1 text-blue-500" />
              Your progress is automatically saved as you complete each field
            </li>
            <li className="flex items-start gap-2">
              <Info className="w-4 h-4 mt-1 text-blue-500" />
              You can return to previous steps using the navigation buttons
            </li>
            <li className="flex items-start gap-2">
              <Info className="w-4 h-4 mt-1 text-blue-500" />
              Required fields are marked with an asterisk (*)
            </li>
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : (
          children
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t">
        <LegalDisclaimer />
      </div>
    </div>
  );
};

// StepSection component remains unchanged
export const StepSection = ({
  title,
  subtitle,
  children,
  className = ''
}) => (
  <div className={`mb-8 ${className}`}>
    {title && (
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      </div>
    )}
    {children}
  </div>
);

export default StepWrapper;