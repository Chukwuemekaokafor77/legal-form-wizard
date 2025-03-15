// src/components/ui/ProgressBar.js
import React from 'react';
import { Clock, Save, CheckCircle } from 'lucide-react';

export const ProgressBar = ({ 
  currentStep, 
  totalSteps, 
  timeEstimate,
  steps = [],
  onStepClick,
  canNavigate = false,
  showSaveHint = true,
  className = ''
}) => {
  const progress = (currentStep / totalSteps) * 100;
  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} hour${hours !== 1 ? 's' : ''}${mins > 0 ? ` ${mins} min` : ''}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-medium">Progress</span>
            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {Math.round(progress)}%
            </span>
          </div>
          {timeEstimate > 0 && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span>{formatTime(timeEstimate)} remaining</span>
            </div>
          )}
        </div>

        <div className="relative">
          {/* Background Track */}
          <div 
            className="w-full bg-gray-100 rounded-full h-2"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div 
              className="bg-blue-600 rounded-full h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step Markers */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-1">
            {Array.from({ length: totalSteps }).map((_, index) => {
              const isCompleted = index + 1 < currentStep;
              const isCurrent = index + 1 === currentStep;
              const stepTitle = steps[index]?.title || `Step ${index + 1}`;
              
              return (
                <button
                  key={index}
                  onClick={() => canNavigate && onStepClick?.(index + 1)}
                  disabled={!canNavigate}
                  className={`
                    w-4 h-4 rounded-full border-2 transition-all
                    ${canNavigate ? 'cursor-pointer' : 'cursor-default'}
                    ${isCompleted 
                      ? 'bg-blue-600 border-blue-600' 
                      : isCurrent
                        ? 'bg-white border-blue-600'
                        : 'bg-white border-gray-300'
                    }
                  `}
                  title={stepTitle}
                  aria-label={`${stepTitle}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
                >
                  {isCompleted && <CheckCircle className="w-3 h-3 text-white" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Info */}
      <div className="flex justify-between items-center text-sm">
        <div className="text-gray-600">
          Step {currentStep} of {totalSteps}
          {steps[currentStep - 1]?.title && (
            <span className="ml-2 font-medium">
              - {steps[currentStep - 1].title}
            </span>
          )}
        </div>
        {showSaveHint && (
          <div className="flex items-center gap-1 text-gray-500">
            <Save className="w-4 h-4" aria-hidden="true" />
            <span>You can save and continue later</span>
          </div>
        )}
      </div>

      {/* Optional Step Description */}
      {steps[currentStep - 1]?.description && (
        <p className="text-sm text-gray-600">
          {steps[currentStep - 1].description}
        </p>
      )}

      {/* Estimated Times */}
      {steps.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`
                text-xs p-2 rounded
                ${index + 1 === currentStep 
                  ? 'bg-blue-50 border border-blue-100' 
                  : 'bg-gray-50'
                }
              `}
            >
              <div className="font-medium">{step.title}</div>
              {step.estimatedTime && (
                <div className="text-gray-500 mt-1">
                  ~{formatTime(step.estimatedTime)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
