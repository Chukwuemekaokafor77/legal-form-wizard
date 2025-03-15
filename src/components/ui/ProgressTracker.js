import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  CheckCircle,
  FileText,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  ArrowRight
} from 'lucide-react';

const ProgressTracker = ({
  currentStep,
  totalSteps,
  steps = [],
  completedSteps = [],
  estimatedTimes = {},
  onStepClick,
  showTimeline = true
}) => {
  const [expandedSection, setExpandedSection] = useState(null);
  
  // Calculate overall progress
  const progress = (completedSteps.length / totalSteps) * 100;
  
  // Calculate remaining time
  const calculateRemainingTime = () => {
    let remainingMinutes = 0;
    for (let i = currentStep - 1; i < totalSteps; i++) {
      remainingMinutes += estimatedTimes[i + 1] || 10; // Default 10 minutes per step
    }
    
    if (remainingMinutes < 60) {
      return `${remainingMinutes} minutes`;
    } else {
      const hours = Math.floor(remainingMinutes / 60);
      const minutes = remainingMinutes % 60;
      return `${hours} hour${hours !== 1 ? 's' : ''}${minutes > 0 ? ` ${minutes} min` : ''}`;
    }
  };
  
  // Get current status for the timeline
  const getTimelineStatus = () => {
    if (completedSteps.length === totalSteps) {
      return 'complete';
    }
    if (completedSteps.length === 0) {
      return 'not-started';
    }
    return 'in-progress';
  };
  
  // Timeline steps
  const timelineSteps = [
    {
      id: 'form-completion',
      title: 'Form Completion',
      status: completedSteps.length === totalSteps ? 'complete' : 'in-progress',
      date: new Date().toLocaleDateString(),
      icon: FileText
    },
    {
      id: 'document-submission',
      title: 'Document Submission', 
      status: completedSteps.length === totalSteps ? 'pending' : 'future',
      estimatedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(), // +2 days
      icon: FileText
    },
    {
      id: 'court-processing',
      title: 'Court Processing',
      status: 'future',
      estimatedDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(), // +14 days
      icon: Clock
    },
    {
      id: 'hearing',
      title: 'Hearing (if required)',
      status: 'future',
      estimatedDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toLocaleDateString(), // +45 days
      icon: Calendar
    },
    {
      id: 'final-decision',
      title: 'Final Decision',
      status: 'future',
      estimatedDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString(), // +60 days
      icon: CheckCircle
    }
  ];
  
  // Required documents - would come from props in real app
  const requiredDocuments = [
    {
      id: 'marriage_certificate',
      name: 'Marriage Certificate',
      status: 'complete',
      date: '2023-11-15'
    },
    {
      id: 'financial_statement',
      name: 'Financial Statement',
      status: 'pending',
      info: 'Form 72J required'
    },
    {
      id: 'id_document',
      name: 'Government-issued ID',
      status: 'incomplete'
    }
  ];
  
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-blue-50 p-4 border-b border-blue-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-blue-800">Application Progress</h3>
          <span className="text-sm font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            {Math.round(progress)}% Complete
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center text-sm mt-2">
          <div className="text-blue-600 font-medium">
            Step {currentStep} of {totalSteps}
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span>{calculateRemainingTime()} remaining</span>
          </div>
        </div>
      </div>
      
      {/* Step Progress */}
      <div className="p-4 border-b">
        <button 
          className="w-full flex items-center justify-between text-left mb-2"
          onClick={() => toggleSection('steps')}
        >
          <h4 className="font-medium text-gray-800 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-blue-500" />
            Form Completion Steps
          </h4>
          {expandedSection === 'steps' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        {expandedSection === 'steps' && (
          <div className="mt-3 space-y-2">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = completedSteps.includes(stepNumber);
              const isCurrent = currentStep === stepNumber;
              
              return (
                <div 
                  key={stepNumber}
                  className={`
                    flex items-center p-3 rounded-lg cursor-pointer transition-colors
                    ${isCompleted ? 'bg-green-50' : isCurrent ? 'bg-blue-50' : 'bg-gray-50'}
                    hover:bg-opacity-80
                  `}
                  onClick={() => onStepClick && onStepClick(stepNumber)}
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0
                    ${isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-300 text-white'}
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <div className={`
                      font-medium
                      ${isCompleted ? 'text-green-700' : isCurrent ? 'text-blue-700' : 'text-gray-700'}
                    `}>
                      {step.title || `Step ${stepNumber}`}
                    </div>
                    {step.description && (
                      <div className="text-sm text-gray-600">{step.description}</div>
                    )}
                  </div>
                  
                  {estimatedTimes[stepNumber] && (
                    <div className="text-sm text-gray-500 ml-2 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {estimatedTimes[stepNumber]} min
                    </div>
                  )}
                  
                  {isCompleted && (
                    <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                  )}
                  
                  {isCurrent && (
                    <ArrowRight className="w-5 h-5 text-blue-500 ml-2" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Required Documents */}
      <div className="p-4 border-b">
        <button 
          className="w-full flex items-center justify-between text-left mb-2"
          onClick={() => toggleSection('documents')}
        >
          <h4 className="font-medium text-gray-800 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-500" />
            Required Documents
          </h4>
          {expandedSection === 'documents' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        {expandedSection === 'documents' && (
          <div className="mt-3 space-y-3">
            {requiredDocuments.map((doc) => (
              <div 
                key={doc.id}
                className={`
                  flex items-start p-3 rounded-lg
                  ${doc.status === 'complete' 
                    ? 'bg-green-50 border border-green-100' 
                    : doc.status === 'pending' 
                      ? 'bg-yellow-50 border border-yellow-100' 
                      : 'bg-gray-50 border border-gray-200'}
                `}
              >
                <div className="flex-shrink-0 mr-3 mt-0.5">
                  {doc.status === 'complete' ? (
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                  ) : doc.status === 'pending' ? (
                    <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    </div>
                  )}
                </div>
                
                <div className="flex-grow">
                  <div className="font-medium">{doc.name}</div>
                  {doc.status === 'complete' && doc.date && (
                    <div className="text-xs text-green-600 mt-1">
                      Uploaded on {new Date(doc.date).toLocaleDateString()}
                    </div>
                  )}
                  {doc.status === 'pending' && doc.info && (
                    <div className="text-xs text-yellow-700 mt-1 flex items-center">
                      <Info className="w-3 h-3 mr-1" />
                      {doc.info}
                    </div>
                  )}
                  {doc.status === 'incomplete' && (
                    <div className="text-xs text-red-600 mt-1">
                      Required - please upload
                    </div>
                  )}
                </div>
                
                {doc.status !== 'complete' && (
                  <button className="text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap">
                    Upload
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Timeline */}
      {showTimeline && (
        <div className="p-4">
          <button 
            className="w-full flex items-center justify-between text-left mb-3"
            onClick={() => toggleSection('timeline')}
          >
            <h4 className="font-medium text-gray-800 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              Process Timeline
            </h4>
            {expandedSection === 'timeline' ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          {expandedSection === 'timeline' && (
            <div className="mt-3 relative">
              {/* Vertical line */}
              <div className="absolute left-[17px] top-1 bottom-0 w-[2px] bg-gray-200"></div>
              
              <div className="space-y-6">
                {timelineSteps.map((step, index) => {
                  let statusStyles = {};
                  
                  if (step.status === 'complete') {
                    statusStyles = {
                      containerClass: 'bg-green-500',
                      textClass: 'text-green-700 font-medium'
                    };
                  } else if (step.status === 'in-progress') {
                    statusStyles = {
                      containerClass: 'bg-blue-500',
                      textClass: 'text-blue-700 font-medium'
                    };
                  } else if (step.status === 'pending') {
                    statusStyles = {
                      containerClass: 'bg-yellow-500',
                      textClass: 'text-yellow-700'
                    };
                  } else {
                    statusStyles = {
                      containerClass: 'bg-gray-300',
                      textClass: 'text-gray-500'
                    };
                  }
                  
                  return (
                    <div key={step.id} className="flex items-start relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${statusStyles.containerClass}`}>
                        <step.icon className="w-4 h-4 text-white" />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="font-medium">{step.title}</div>
                        {step.status === 'complete' && step.date && (
                          <div className={`text-sm ${statusStyles.textClass}`}>
                            Completed: {step.date}
                          </div>
                        )}
                        {(step.status === 'pending' || step.status === 'future') && step.estimatedDate && (
                          <div className={`text-sm ${statusStyles.textClass}`}>
                            {step.status === 'pending' ? 'Expected' : 'Estimated'}: {step.estimatedDate}
                          </div>
                        )}
                        {step.status === 'in-progress' && (
                          <div className="text-sm text-blue-700 font-medium">
                            In progress
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer - Helpful reminders */}
      <div className="bg-gray-50 p-4 border-t text-sm">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-gray-600">
            Save your progress regularly. You can come back and continue your application at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;