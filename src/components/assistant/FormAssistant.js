// src/components/assistant/FormAssistant.js
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, MessageCircle, X, HelpCircle } from 'lucide-react';

export const FormAssistant = ({ 
  section, 
  fieldDefinitions,
  currentValues,
  onUpdate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  
  // Generate simplified questions based on form fields
  const assistantSteps = fieldDefinitions.map(field => ({
    id: field.id,
    question: generateQuestion(field),
    helpText: field.helpText,
    fieldType: field.type,
    options: field.options,
    required: field.required
  }));
  
  // Initialize from current values if available
  useEffect(() => {
    if (currentValues && Object.keys(currentValues).length > 0) {
      setUserResponses(prev => ({
        ...prev,
        ...currentValues
      }));
    }
  }, [currentValues]);
  
  // Generate user-friendly questions
  function generateQuestion(field) {
    switch (field.id) {
      case 'marriageDate':
        return 'When did you get married?';
      case 'separationDate':
        return 'When did you and your spouse separate?';
      case 'childrenCount':
        return 'How many children do you have?';
      case 'hasDomesticViolence':
        return 'Is domestic violence a concern in your situation?';
      case 'requiresUrgentRelief':
        return 'Do you need urgent court intervention?';
      // Add more field-specific questions
      default:
        return `Please enter your ${field.label.toLowerCase()}:`;
    }
  }
  
  // Process user responses into form data
  useEffect(() => {
    if (Object.keys(userResponses).length > 0) {
      // Map responses to form fields
      const formData = {};
      Object.entries(userResponses).forEach(([fieldId, value]) => {
        formData[fieldId] = value;
      });
      
      onUpdate(formData);
    }
  }, [userResponses, onUpdate]);
  
  const handleResponse = (stepId, value) => {
    setUserResponses(prev => ({
      ...prev,
      [stepId]: value
    }));
    
    // Move to next step if available
    if (currentStep < assistantSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Completed all steps
      setTimeout(() => {
        setIsOpen(false);
      }, 1500);
    }
  };
  
  const renderResponseInput = (step) => {
    switch (step.fieldType) {
      case 'date':
        return (
          <input
            type="date"
            value={userResponses[step.id] || ''}
            onChange={(e) => handleResponse(step.id, e.target.value)}
            className="w-full p-2 border rounded"
          />
        );
      case 'select':
        return (
          <select
            value={userResponses[step.id] || ''}
            onChange={(e) => handleResponse(step.id, e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Please select...</option>
            {step.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'boolean':
        return (
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={step.id}
                checked={userResponses[step.id] === true}
                onChange={() => handleResponse(step.id, true)}
                className="h-4 w-4"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={step.id}
                checked={userResponses[step.id] === false}
                onChange={() => handleResponse(step.id, false)}
                className="h-4 w-4"
              />
              <span>No</span>
            </label>
          </div>
        );
      case 'number':
        return (
          <input
            type="number"
            value={userResponses[step.id] || ''}
            onChange={(e) => handleResponse(step.id, e.target.value)}
            className="w-full p-2 border rounded"
          />
        );
      default:
        return (
          <input
            type="text"
            value={userResponses[step.id] || ''}
            onChange={(e) => handleResponse(step.id, e.target.value)}
            className="w-full p-2 border rounded"
          />
        );
    }
  };
  
  return (
    <div className="form-assistant">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-blue-600 mb-4"
      >
        <MessageCircle size={18} />
        <span>Get help filling out this section</span>
        {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>
      
      {isOpen && (
        <div className="bg-blue-50 p-4 rounded-lg mb-4 relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
          
          <div className="mb-4">
            <h4 className="font-medium text-lg mb-2">
              Form Assistant: {section}
            </h4>
            <p className="text-sm text-gray-600">
              I'll help you fill out this section by asking simple questions.
            </p>
          </div>
          
          <div className="current-step p-3 bg-white rounded shadow-sm">
            <div className="text-sm text-gray-500 mb-1">
              Question {currentStep + 1} of {assistantSteps.length}
            </div>
            
            <div className="question mb-3 font-medium">
              {assistantSteps[currentStep].question}
              {assistantSteps[currentStep].required && <span className="text-red-500">*</span>}
            </div>
            
            {assistantSteps[currentStep].helpText && (
              <div className="help-text text-sm text-gray-600 mb-3 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                <span>{assistantSteps[currentStep].helpText}</span>
              </div>
            )}
            
            <div className="response-input">
              {renderResponseInput(assistantSteps[currentStep])}
            </div>
            
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="text-sm text-gray-600 px-3 py-1 rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  if (currentStep < assistantSteps.length - 1) {
                    setCurrentStep(currentStep + 1);
                  } else {
                    setIsOpen(false);
                  }
                }}
                className="text-sm text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
              >
                {currentStep === assistantSteps.length - 1 ? 'Finish' : 'Skip'}
              </button>
            </div>
          </div>
          
          <div className="progress-indicator flex mt-4">
            {assistantSteps.map((step, index) => (
              <div
                key={step.id}
                className={`
                  h-2 flex-grow rounded-full mx-0.5
                  ${index < currentStep ? 'bg-blue-500' : 
                    index === currentStep ? 'bg-blue-300' : 'bg-gray-200'}
                `}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormAssistant;