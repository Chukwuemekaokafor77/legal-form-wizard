// src/components/submission/SubmissionTimeline.js
import React from 'react';
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  AlertCircle, 
  ChevronRight,
  Calendar 
} from 'lucide-react';

export const SubmissionTimeline = ({ 
  submissionStatus, 
  estimatedDates,
  courtLocation
}) => {
  const steps = [
    {
      id: 'forms_generated',
      label: 'Forms Generated',
      description: 'All required forms have been generated',
      icon: FileText,
      date: submissionStatus.formsGeneratedDate
    },
    {
      id: 'forms_submitted',
      label: 'Forms Submitted',
      description: 'Forms have been submitted to the court',
      icon: CheckCircle,
      date: submissionStatus.formsSubmittedDate
    },
    {
      id: 'court_processing',
      label: 'Court Processing',
      description: 'Court is reviewing your submission',
      icon: Clock,
      date: submissionStatus.courtProcessingDate,
      estimatedDate: estimatedDates.courtProcessingDate
    },
    {
      id: 'hearing_scheduled',
      label: 'Hearing Scheduled',
      description: 'A court date has been assigned',
      icon: Calendar,
      date: submissionStatus.hearingScheduledDate,
      estimatedDate: estimatedDates.hearingDate
    },
    {
      id: 'decision_rendered',
      label: 'Decision Rendered',
      description: 'Court has made a decision',
      icon: FileText,
      date: submissionStatus.decisionDate,
      estimatedDate: estimatedDates.decisionDate
    }
  ];
  
  // Find current active step
  const currentStepIndex = steps.findIndex(step => !step.date);
  
  return (
    <div className="submission-timeline p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Submission Timeline</h3>
        {courtLocation && (
          <div className="text-sm text-gray-600">
            Court: {courtLocation}
          </div>
        )}
      </div>
      
      <div className="relative">
        {/* Vertical timeline line */}
        <div 
          className="absolute top-0 bottom-0 left-6 w-0.5 bg-gray-200" 
          style={{ marginLeft: '9px' }}
        />
        
        {/* Timeline steps */}
        <div className="space-y-8">
          {steps.map((step, index) => {
            const isComplete = !!step.date;
            const isCurrent = index === currentStepIndex;
            const isPending = index > currentStepIndex;
            
            return (
              <div key={step.id} className="relative flex items-start">
                {/* Step icon */}
                <div className="flex-shrink-0 mr-4">
                  <div 
                    className={`
                      w-5 h-5 rounded-full flex items-center justify-center p-4
                      ${isComplete ? 'bg-green-500 text-white' : 
                        isCurrent ? 'bg-blue-500 text-white' : 
                        'bg-gray-300 text-gray-600'}
                    `}
                  >
                    {isComplete ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                </div>
                
                {/* Step content */}
                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`
                        font-medium
                        ${isComplete ? 'text-green-600' : 
                          isCurrent ? 'text-blue-600' : 
                          'text-gray-500'}
                      `}>
                        {step.label}
                      </h4>
                      
                      <p className="text-sm text-gray-600">
                        {step.description}
                      </p>
                    </div>
                    
                    <div className="text-sm text-right">
                      {isComplete ? (
                        <div className="text-green-600">
                          Completed: {new Date(step.date).toLocaleDateString()}
                        </div>
                      ) : step.estimatedDate ? (
                        <div className="text-gray-600">
                          Est. {new Date(step.estimatedDate).toLocaleDateString()}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  
                  {/* Current step details */}
                  {isCurrent && (
                    <div className="mt-2 p-3 bg-blue-50 rounded text-sm">
                      {step.id === 'forms_generated' && (
                        <div>
                          <div className="font-medium mb-1">Next Steps:</div>
                          <ol className="list-decimal pl-4 space-y-1">
                            <li>Print your completed forms</li>
                            <li>Sign all required signature areas</li>
                            <li>Make required copies</li>
                            <li>Submit to the court at {courtLocation}</li>
                          </ol>
                        </div>
                      )}
                      {step.id === 'forms_submitted' && (
                        <div>
                          <div className="font-medium mb-1">Processing Information:</div>
                          <p>
                            Your forms are being processed by the court registry.
                            This typically takes 5-10 business days. You will be 
                            notified when processing is complete.
                          </p>
                        </div>
                      )}
                      {step.id === 'court_processing' && (
                        <div>
                          <div className="font-medium mb-1">Court Processing:</div>
                          <p>
                            Your case is being reviewed by court staff. They will
                            verify your documents and assign a court file number. 
                            You may be contacted if additional information is needed.
                          </p>
                        </div>
                      )}
                      {step.id === 'hearing_scheduled' && (
                        <div>
                          <div className="font-medium mb-1">Your Court Date:</div>
                          <p>
                            Prepare for your court appearance by reviewing your
                            documents and considering what you'll say. Arrive at
                            least 30 minutes early and dress appropriately.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubmissionTimeline;