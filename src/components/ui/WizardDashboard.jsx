// src/components/ui/WizardDashboard.jsx
import React from 'react';
import { 
  CheckCircle, Clock, AlertCircle, HelpCircle, 
  FileText, ArrowRight, Calendar, User 
} from 'lucide-react';

export const WizardDashboard = ({
  progress,
  currentStep,
  totalSteps,
  timeEstimate,
  requiredDocuments = [],
  uploadedDocuments = [],
  completedSections = [],
  onNavigateToStep
}) => {
  // Calculate overall progress percentage
  const progressPercentage = (progress / 100) * 100;
  
  // Get missing required documents
  const missingDocuments = requiredDocuments.filter(
    doc => !doc.optional && !uploadedDocuments.some(u => u.type === doc.id)
  );
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Main progress card */}
      <div className="md:col-span-2 bg-white rounded-lg border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CheckCircle className={progressPercentage === 100 ? "text-green-500" : "text-blue-500"} />
          <span>Your Progress</span>
        </h2>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </div>
            <div className="text-sm text-gray-600">
              {Math.round(progressPercentage)}% complete
            </div>
          </div>
          
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                progressPercentage === 100 
                  ? 'bg-green-500' 
                  : progressPercentage > 75 
                    ? 'bg-blue-500' 
                    : progressPercentage > 30 
                      ? 'bg-blue-400' 
                      : 'bg-blue-300'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <div className="mt-2 flex items-center justify-end text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            Estimated time: {timeEstimate} minutes
          </div>
        </div>
        
        {/* Sections overview */}
        <div className="space-y-3">
          {[
            { 
              id: 'personal', 
              title: 'Personal Information', 
              icon: User,
              isCompleted: completedSections.includes('personal'),
              step: 2
            },
            { 
              id: 'case', 
              title: 'Case Details', 
              icon: FileText,
              isCompleted: completedSections.includes('case'),
              step: 3
            },
            { 
              id: 'documents', 
              title: 'Document Upload', 
              icon: FileText,
              isCompleted: completedSections.includes('documents'),
              step: 4,
              warning: missingDocuments.length > 0 ? `${missingDocuments.length} required documents missing` : null
            },
            { 
              id: 'review', 
              title: 'Review & Submit', 
              icon: CheckCircle,
              isCompleted: completedSections.includes('review'),
              step: 5
            }
          ].map(section => (
            <div 
              key={section.id}
              className={`
                flex items-center justify-between p-3 rounded-lg border
                ${section.isCompleted 
                  ? 'bg-green-50 border-green-200' 
                  : section.warning 
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-gray-50 border-gray-200'}
                ${onNavigateToStep ? 'cursor-pointer hover:bg-opacity-80' : ''}
              `}
              onClick={() => onNavigateToStep?.(section.step)}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${section.isCompleted 
                    ? 'bg-green-500 text-white' 
                    : section.warning
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-300 text-white'}
                `}>
                  <section.icon size={16} />
                </div>
                
                <div>
                  <div className="font-medium">{section.title}</div>
                  {section.warning && (
                    <div className="text-xs text-yellow-700 mt-0.5 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {section.warning}
                    </div>
                  )}
                </div>
              </div>
              
              {onNavigateToStep && (
                <ArrowRight className="text-gray-400" size={18} />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Help and resources card */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <HelpCircle className="text-blue-500" />
          <span>Help & Resources</span>
        </h2> <div className="space-y-4">
      <div className="p-3 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-700 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Deadlines
        </h3>
        <p className="text-sm text-blue-600 mt-1">
          Complete your forms by the required deadlines to ensure timely processing.
        </p>
      </div>
      
      <div className="p-3 bg-gray-50 rounded-lg">
        <h3 className="font-medium flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-600" />
          Required Documents
        </h3>
        <ul className="mt-2 space-y-1.5">
          {requiredDocuments.map(doc => (
            <li key={doc.id} className="text-sm flex items-start gap-1.5">
              {uploadedDocuments.some(u => u.type === doc.id) ? (
                <CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5" />
              )}
              <span>{doc.name}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <button className="w-full mt-4 text-center text-blue-600 text-sm hover:underline flex items-center justify-center gap-1">
        <HelpCircle size={14} />
        <span>Get Help From Legal Aid</span>
      </button>
    </div>
  </div>
</div>
);
};