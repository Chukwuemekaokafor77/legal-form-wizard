// src/components/ui/FormBreakdownGuide.js
import React, { useState } from 'react';
import { Clock, ChevronRight, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

export const FormBreakdownGuide = ({ 
  steps, 
  currentStep = 0,
  onStepClick,
  showProgress = true
}) => {
  const [expandedStep, setExpandedStep] = useState(null);

  const totalTime = steps.reduce((acc, step) => acc + (step.timeEstimate || 0), 0);
  const completedSteps = steps.filter(step => step.completed).length;
  const progress = steps.length > 0 ? (completedSteps / steps.length) * 100 : 0;

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      {showProgress && (
        <div className="p-4 border-b bg-gray-50">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Overall Progress</span>
            <span className="text-gray-600">
              {completedSteps} of {steps.length} steps completed
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-end text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            Estimated total time: {totalTime} minutes
          </div>
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <HelpCircle className="w-5 h-5 mr-2 text-blue-500" />
          How to Complete Your Forms
        </h3>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const isExpanded = expandedStep === index;
            const isCurrent = currentStep === index;
            const isCompleted = step.completed;

            return (
              <div 
                key={index}
                className={`
                  relative rounded-lg transition-all duration-200
                  ${isCurrent ? 'bg-blue-50 ring-2 ring-blue-200' : 'bg-gray-50 hover:bg-gray-100'}
                  ${isCompleted ? 'bg-green-50 hover:bg-green-100' : ''}
                `}
              >
                <button
                  onClick={() => {
                    setExpandedStep(isExpanded ? null : index);
                    if (onStepClick) onStepClick(index);
                  }}
                  className="w-full text-left p-4"
                  aria-expanded={isExpanded}
                  aria-label={`Step ${index + 1}: ${step.title}`}
                >
                  <div className="flex items-start">
                    <div className={`
                      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                      ${isCompleted 
                        ? 'bg-green-500' 
                        : isCurrent 
                          ? 'bg-blue-500' 
                          : 'bg-gray-400'
                      }
                      text-white font-medium
                    `}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" aria-hidden="true" />
                      ) : (
                        index + 1
                      )}
                    </div>

                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium flex items-center">
                          {step.title}
                          {step.required && (
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                              Required
                            </span>
                          )}
                        </h4>
                        <ChevronRight 
                          className={`
                            w-5 h-5 text-gray-400 transition-transform
                            ${isExpanded ? 'rotate-90' : ''}
                          `}
                          aria-hidden="true"
                        />
                      </div>

                      <p className="text-gray-600 text-sm mt-1">
                        {step.description}
                      </p>

                      {step.timeEstimate && (
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                          <Clock className="w-4 h-4 mr-1" aria-hidden="true" />
                          Estimated time: {step.timeEstimate} minutes
                        </div>
                      )}
                    </div>
                  </div>
                </button>

                {isExpanded && step.details && (
                  <div className="px-4 pb-4 pt-2 ml-[3rem] border-t">
                    {step.warning && (
                      <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg mb-3">
                        <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-[0.125rem]" aria-hidden="true" />
                        <p className="text-sm text-yellow-700">{step.warning}</p>
                      </div>
                    )}

                    <div className="text-sm text-gray-600 space-y-[0.5rem]">
                      {Array.isArray(step.details) ? (
                        <ul className="list-disc pl-[1rem] space-y-[0.25rem]">
                          {step.details.map((detail, idx) => (
                            <li key={idx}>{detail}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{step.details}</p>
                      )}
                    </div>

                    {step.requirements && (
                      <div className="mt-[0.75rem]">
                        <h5 className="font-medium text-sm mb-[0.5rem]">Requirements:</h5>
                        <ul className="list-disc pl-[1rem] space-y-[0.25rem] text-sm text-gray-[600]">
                          {step.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
