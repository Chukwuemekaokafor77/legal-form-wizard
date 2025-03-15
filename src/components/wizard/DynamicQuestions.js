// src/components/wizard/DynamicQuestions.js
import React, { useState, useEffect, useCallback } from 'react';
import { questionSchema } from '../../data/questionSchema';
import LegalTermTooltip from '../ui/LegalTermTooltip';
import LearnMoreModal from '../ui/LearnMoreModal';
import ProgressBar from '../ui/ProgressBar';
import { validateField } from '../../utils/validation';
import { legalTerms } from '../../utils/legalTerms';

const DynamicQuestions = ({ 
  caseType, 
  province, 
  answers, 
  onChange,
  onComplete 
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [sectionValid, setSectionValid] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [currentHelp, setCurrentHelp] = useState(null);

  // Enhanced question loading with legal term integration
  useEffect(() => {
    if (caseType && province) {
      const baseQuestions = questionSchema.caseTypes[caseType]?.questions || [];
      const enhancedQuestions = baseQuestions.map(section => ({
        ...section,
        fields: section.fields.map(field => ({
          ...field,
          label: injectLegalTerms(field.label),
          helpText: field.helpText || legalTerms[field.id]?.description
        }))
      }));
      setQuestions(enhancedQuestions);
    }
  }, [caseType, province]);

  // Legal term injection helper
  const injectLegalTerms = (text) => {
    return text.replace(/\{\{(.*?)\}\}/g, (match, term) => {
      const legalTerm = legalTerms[term.trim()];
      return legalTerm ? 
        <LegalTermTooltip term={legalTerm.term} definition={legalTerm.definition} /> : 
        match;
    });
  };

  // Enhanced validation with custom rules
  const validateSection = useCallback(() => {
    const currentFields = questions[currentSection]?.fields || [];
    let isValid = true;
    const errors = {};

    currentFields.forEach(field => {
      const value = answers[field.id];
      const error = validateField(field, value);
      if (error) {
        errors[field.id] = error;
        isValid = false;
      }
    });

    setFieldErrors(errors);
    setSectionValid(isValid);
    return isValid;
  }, [currentSection, questions, answers]);

  // Enhanced answer handling with validation
  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    onChange(newAnswers);
    
    // Immediate validation feedback
    const fieldConfig = questions[currentSection]?.fields?.find(f => f.id === questionId);
    if (fieldConfig) {
      const error = validateField(fieldConfig, value);
      setFieldErrors(prev => ({ ...prev, [questionId]: error }));
    }
  };

  // Enhanced navigation with progress tracking
  const handleNavigation = (direction) => {
    if (direction === 'next' && !validateSection()) return;
    
    setCurrentSection(prev => {
      const newSection = direction === 'next' ? prev + 1 : prev - 1;
      window.scrollTo(0, 0); // Reset scroll position
      return newSection;
    });
  };

  // Enhanced field rendering with tooltips and help
  const renderField = (field) => {
    const error = fieldErrors[field.id];
    const fieldContainerClass = `field-container ${error ? 'border-l-4 border-red-500 pl-4' : ''}`;

    return (
      <div className={fieldContainerClass}>
        <div className="flex items-center justify-between">
          <label className="block font-medium">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.helpText && (
            <button 
              onClick={() => setCurrentHelp(field)}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              Need help?
            </button>
          )}
        </div>
        
        {renderFieldInput(field)}
        
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        {field.description && (
          <p className="text-gray-600 text-sm mt-1">{field.description}</p>
        )}
      </div>
    );
  };

  // Input type handling with enhanced features
  const renderFieldInput = (field) => {
    const commonProps = {
      value: answers[field.id] || '',
      onChange: (e) => handleAnswer(field.id, e.target.value),
      className: "border p-2 rounded w-full",
      'aria-label': field.label,
      onBlur: () => validateSection() // Validate on blur
    };

    switch (field.type) {
      case 'date':
        return <input type="date" {...commonProps} />;
      
      case 'boolean':
        return (
          <div className="space-x-4">
            {[true, false].map((option) => (
              <label key={option} className="inline-flex items-center">
                <input
                  type="radio"
                  checked={answers[field.id] === option}
                  onChange={() => handleAnswer(field.id, option)}
                  className="mr-2"
                />
                {option ? 'Yes' : 'No'}
              </label>
            ))}
          </div>
        );

      case 'document-upload':
        return (
          <input 
            type="file"
            accept={field.acceptedFormats?.join(',') || '*'}
            onChange={(e) => handleAnswer(field.id, e.target.files[0])}
          />
        );

      case 'conditional-group':
        return (
          <div className="space-y-4 pl-4 border-l-2 border-gray-200">
            {(answers[field.id] || []).map((item, index) => (
              <div key={index} className="space-y-2">
                {field.fields.map(subField => renderField({
                  ...subField,
                  id: `${field.id}.${index}.${subField.id}`
                }))}
              </div>
            ))}
            <button
              onClick={() => handleAnswer(
                field.id, 
                [...(answers[field.id] || []), {}]
              )}
              className="text-blue-600"
            >
              Add Another {field.itemLabel || 'Item'}
            </button>
          </div>
        );

      default:
        return <input type="text" {...commonProps} />;
    }
  };

  if (!questions.length) return null;

  return (
    <div className="space-y-6">
      <ProgressBar 
        current={currentSection + 1} 
        total={questions.length} 
      />
      
      <LearnMoreModal
        isOpen={!!currentHelp}
        onClose={() => setCurrentHelp(null)}
        title={currentHelp?.label}
        content={currentHelp?.helpText}
      />

      {questions[currentSection].prerequisite && (
        <div className="bg-blue-50 p-4 rounded-lg">
          {injectLegalTerms(questions[currentSection].prerequisite)}
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-2xl font-semibold">
          {questions[currentSection].section}
        </h3>
        
        <div className="space-y-6">
          {questions[currentSection].fields.map(field => (
            <div key={field.id} className="space-y-4">
              {renderField(field)}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => handleNavigation('prev')}
          disabled={currentSection === 0}
          className="px-6 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
        >
          ← Previous
        </button>
        
        <button
          onClick={() => currentSection === questions.length - 1 ? onComplete() : handleNavigation('next')}
          disabled={!sectionValid}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {currentSection === questions.length - 1 ? 
            'Generate Documents →' : 
            'Next →'}
        </button>
      </div>
    </div>
  );
};

export default DynamicQuestions;
