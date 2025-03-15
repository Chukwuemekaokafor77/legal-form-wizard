// src/components/interview/GuidedInterviewEngine.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert, AlertDescription } from '../ui';
import { AlertCircle } from 'lucide-react';
import ConditionalField from './ConditionalField';
import InterviewQuestion from './InterviewQuestion';
import ProgressIndicator from './ProgressIndicator';
import NavigationControls from './NavigationControls';
import { validateField } from '../../utils/validation';

/**
 * A dynamic interview engine that adapts questions based on previous answers
 */
const GuidedInterviewEngine = ({
  questions = [],
  initialAnswers = {},
  onComplete,
  onUpdate,
  currentSection = 0,
  showProgress = true,
  saveProgress = false,
  locale = 'en'
}) => {
  const [answers, setAnswers] = useState(initialAnswers);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [errors, setErrors] = useState({});
  const [completed, setCompleted] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Filter questions based on conditional logic
  const activeQuestions = useMemo(() => {
    return questions.filter(question => {
      // If question has a condition, evaluate it
      if (question.condition) {
        const { field, operator, value } = question.condition;
        const fieldValue = getNestedValue(answers, field);
        
        switch (operator) {
          case 'equals':
            return fieldValue === value;
          case 'notEquals':
            return fieldValue !== value;
          case 'contains':
            return Array.isArray(fieldValue) && fieldValue.includes(value);
          case 'greaterThan':
            return fieldValue > value;
          case 'lessThan':
            return fieldValue < value;
          case 'exists':
            return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
          case 'notExists':
            return fieldValue === undefined || fieldValue === null || fieldValue === '';
          default:
            return true;
        }
      }
      // No condition means always show
      return true;
    });
  }, [questions, answers]);

  // Calculate total steps and current progress
  const totalSteps = activeQuestions.length;
  const progressPercentage = (currentQuestion / Math.max(totalSteps, 1)) * 100;

  // Helper function to get nested property value
  const getNestedValue = useCallback((obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part] !== undefined ? acc[part] : undefined, obj);
  }, []);

  // Set nested property value
  const setNestedValue = useCallback((obj, path, value) => {
    const newObj = { ...obj };
    const parts = path.split('.');
    let current = newObj;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      
      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {};
      }
      
      current = current[part];
    }
    
    current[parts[parts.length - 1]] = value;
    return newObj;
  }, []);

  // Handle answer changes
  const handleAnswerChange = useCallback((questionId, value) => {
    setAnswers(prev => {
      const newAnswers = setNestedValue(prev, questionId, value);
      
      // Auto-save if enabled
      if (saveProgress) {
        setSaveStatus('saving');
        
        // Simulated save delay - replace with actual API call
        setTimeout(() => {
          setSaveStatus('saved');
          
          // Clear the "saved" status after a few seconds
          setTimeout(() => {
            setSaveStatus(null);
          }, 3000);
        }, 1000);
      }
      
      // Notify parent component of updates
      onUpdate?.(newAnswers);
      
      return newAnswers;
    });
    
    // Clear any errors for this field
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  }, [errors, onUpdate, saveProgress, setNestedValue]);

  // Validate the current question
  const validateCurrentQuestion = useCallback(() => {
    if (currentQuestion >= activeQuestions.length) return true;
    
    const question = activeQuestions[currentQuestion];
    if (!question) return true;
    
    const value = getNestedValue(answers, question.id);
    
    // Skip validation if question is not required and value is empty
    if (!question.required && (value === undefined || value === null || value === '')) {
      return true;
    }
    
    // Run field-specific validation
    const validationResult = validateField(
      question.id,
      value,
      question.validation,
      answers
    );
    
    if (!validationResult.isValid) {
      setErrors(prev => ({
        ...prev,
        [question.id]: validationResult.error
      }));
      return false;
    }
    
    return true;
  }, [activeQuestions, currentQuestion, answers, getNestedValue]);

  // Handle navigation
  const handleNext = useCallback(() => {
    if (!validateCurrentQuestion()) return;
    
    // Mark current question as completed
    setCompleted(prev => {
      if (!prev.includes(currentQuestion)) {
        return [...prev, currentQuestion];
      }
      return prev;
    });
    
    // Move to next question if not at the end
    if (currentQuestion < activeQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      window.scrollTo(0, 0); // Scroll to top for new question
    } else {
      // We're at the end, submit if all questions are valid
      setIsSubmitting(true);
      
      // Validate all questions
      const allErrors = {};
      let hasErrors = false;
      
      activeQuestions.forEach((question, index) => {
        if (question.required) {
          const value = getNestedValue(answers, question.id);
          const validationResult = validateField(
            question.id,
            value,
            question.validation,
            answers
          );
          
          if (!validationResult.isValid) {
            allErrors[question.id] = validationResult.error;
            hasErrors = true;
          }
        }
      });
      
      if (hasErrors) {
        setErrors(allErrors);
        
        // Find the first question with an error and go to it
        const errorIndex = activeQuestions.findIndex(
          question => allErrors[question.id]
        );
        
        if (errorIndex !== -1) {
          setCurrentQuestion(errorIndex);
        }
      } else {
        // All good, complete the interview
        onComplete?.(answers);
      }
      
      setIsSubmitting(false);
    }
  }, [activeQuestions, answers, currentQuestion, getNestedValue, onComplete, validateCurrentQuestion]);

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      window.scrollTo(0, 0); // Scroll to top for new question
    }
  }, [currentQuestion]);

  // Jump to a specific question
  const jumpToQuestion = useCallback((index) => {
    if (index >= 0 && index < activeQuestions.length) {
      setCurrentQuestion(index);
      window.scrollTo(0, 0);
    }
  }, [activeQuestions]);

  // Render the current question
  const currentQuestionData = activeQuestions[currentQuestion];

  return (
    <div className="guided-interview-engine space-y-6">
      {/* Progress Indicator */}
      {showProgress && (
        <ProgressIndicator 
          current={currentQuestion + 1}
          total={totalSteps}
          percentage={progressPercentage}
          completed={completed}
          onQuestionClick={jumpToQuestion}
        />
      )}
      
      {/* Save Status */}
      {saveStatus && (
        <div className={`
          fixed top-4 right-4 p-2 rounded shadow-md text-sm flex items-center gap-2
          ${saveStatus === 'saving' ? 'bg-blue-100 text-blue-700' : 
            saveStatus === 'saved' ? 'bg-green-100 text-green-700' : 
            'bg-red-100 text-red-700'}
        `}>
          {saveStatus === 'saving' && <span>Saving...</span>}
          {saveStatus === 'saved' && <span>Changes saved</span>}
          {saveStatus === 'error' && <span>Error saving</span>}
        </div>
      )}
      
      {/* Error Summary */}
      {Object.keys(errors).length > 0 && currentQuestion === activeQuestions.length - 1 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please correct the following errors before continuing:
            <ul className="mt-2 list-disc pl-6">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Current Question */}
      {currentQuestionData && (
        <div className="question-container">
          <InterviewQuestion
            question={currentQuestionData}
            value={getNestedValue(answers, currentQuestionData.id)}
            onChange={(value) => handleAnswerChange(currentQuestionData.id, value)}
            error={errors[currentQuestionData.id]}
            locale={locale}
          />
        </div>
      )}
      
      {/* Navigation Controls */}
      <NavigationControls
        onNext={handleNext}
        onPrevious={handlePrevious}
        canGoNext={!!currentQuestionData}
        canGoPrevious={currentQuestion > 0}
        isLastQuestion={currentQuestion === activeQuestions.length - 1}
        isSubmitting={isSubmitting}
        locale={locale}
      />
    </div>
  );
};

export default GuidedInterviewEngine;
