// src/components/interview/InterviewQuestion.js
import React from 'react';
import { LegalText } from '../ui/LegalText';
import { HelpCircle } from 'lucide-react';
import ConditionalField from './ConditionalField';

const InterviewQuestion = ({ 
  question, 
  value, 
  onChange, 
  error,
  locale = 'en'
}) => {
  if (!question) return null;

  const renderHelp = () => {
    if (!question.help) return null;

    return (
      <div className="mt-2 bg-gray-50 p-3 rounded-lg">
        <div className="flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
          <div className="text-sm text-gray-600">
            <LegalText>{question.help[locale] || question.help.en || question.help}</LegalText>
          </div>
        </div>
      </div>
    );
  };

  const renderField = () => {
    // Get the appropriate label based on locale
    const label = question.label[locale] || question.label.en || question.label;
    
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            className={`
              w-full rounded-lg border p-2
              ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            `}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            aria-label={label}
            aria-invalid={!!error}
            placeholder={question.placeholder?.[locale] || question.placeholder?.en || question.placeholder}
          />
        );
        
      case 'textarea':
        return (
          <textarea
            className={`
              w-full rounded-lg border p-2 min-h-[120px]
              ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            `}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            aria-label={label}
            aria-invalid={!!error}
            placeholder={question.placeholder?.[locale] || question.placeholder?.en || question.placeholder}
          />
        );
        
      case 'select':
        return (
          <select
            className={`
              w-full rounded-lg border p-2
              ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            `}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            aria-label={label}
            aria-invalid={!!error}
          >
            <option value="">
              {question.placeholder?.[locale] || question.placeholder?.en || `Select ${label}`}
            </option>
            {question.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label[locale] || option.label.en || option.label}
              </option>
            ))}
          </select>
        );
        
      case 'radio':
        return (
          <div className="space-y-2">
            {question.options?.map(option => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  checked={value === option.value}
                  onChange={() => onChange(option.value)}
                />
                <span>
                  {option.label[locale] || option.label.en || option.label}
                </span>
              </label>
            ))}
          </div>
        );
        
      case 'checkbox':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
            />
            <span>
              {question.checkboxLabel?.[locale] || question.checkboxLabel?.en || question.checkboxLabel || label}
            </span>
          </label>
        );
        
      case 'date':
        return (
          <input
            type="date"
            className={`
              w-full rounded-lg border p-2
              ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            `}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            aria-label={label}
            aria-invalid={!!error}
          />
        );
        
      case 'number':
        return (
          <input
            type="number"
            className={`
              w-full rounded-lg border p-2
              ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'}
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            `}
            value={value || ''}
            onChange={(e) => onChange(e.target.valueAsNumber || null)}
            aria-label={label}
            aria-invalid={!!error}
            min={question.min}
            max={question.max}
            step={question.step || 1}
            placeholder={question.placeholder?.[locale] || question.placeholder?.en || question.placeholder}
          />
        );
        
      case 'checkboxGroup':
        return (
          <div className="space-y-2">
            {question.options?.map(option => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onChange={(e) => {
                    const newValue = Array.isArray(value) ? [...value] : [];
                    if (e.target.checked) {
                      if (!newValue.includes(option.value)) {
                        newValue.push(option.value);
                      }
                    } else {
                      const index = newValue.indexOf(option.value);
                      if (index > -1) {
                        newValue.splice(index, 1);
                      }
                    }
                    onChange(newValue);
                  }}
                />
                <span>
                  {option.label[locale] || option.label.en || option.label}
                </span>
              </label>
            ))}
          </div>
        );
        
      case 'file':
        return (
          <div>
            <input
              type="file"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => onChange(e.target.files[0] || null)}
              accept={question.accept}
              aria-label={label}
              aria-invalid={!!error}
            />
            {value && (
              <div className="mt-2 text-sm text-gray-600">
                Selected file: {value.name} ({Math.round(value.size / 1024)} KB)
              </div>
            )}
          </div>
        );
      
      case 'repeater':
        return (
          <div className="space-y-4">
            {Array.isArray(value) && value.map((item, index) => (
              <div key={index} className="border p-4 rounded-lg bg-gray-50 relative">
                <button 
                  type="button"
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  onClick={() => {
                    const newValue = [...value];
                    newValue.splice(index, 1);
                    onChange(newValue);
                  }}
                  aria-label="Remove item"
                >
                  ×
                </button>
                
                <div className="space-y-4">
                  {question.fields.map(field => (
                    <ConditionalField
                      key={field.id}
                      field={field}
                      value={item[field.id]}
                      onChange={(newFieldValue) => {
                        const newItems = [...value];
                        newItems[index] = {
                          ...newItems[index],
                          [field.id]: newFieldValue
                        };
                        onChange(newItems);
                      }}
                      parentData={item}
                      locale={locale}
                    />
                  ))}
                </div>
              </div>
            ))}
            
            <button
              type="button"
              className="mt-2 text-blue-600 hover:text-blue-800 flex items-center gap-1"
              onClick={() => {
                const newItem = {};
                question.fields.forEach(field => {
                  newItem[field.id] = null;
                });
                onChange([...(value || []), newItem]);
              }}
            >
              + Add {question.itemLabel?.[locale] || question.itemLabel?.en || question.itemLabel || 'Item'}
            </button>
          </div>
        );
            
      default:
        return (
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 p-2"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            aria-label={label}
            aria-invalid={!!error}
          />
        );
    }
  };

  return (
    <div className="mb-6">
      <div className="mb-2">
        <label className="block text-lg font-medium mb-1">
          <LegalText>
            {question.label[locale] || question.label.en || question.label}
          </LegalText>
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {question.description && (
          <div className="text-sm text-gray-600 mb-3">
            <LegalText>
              {question.description[locale] || question.description.en || question.description}
            </LegalText>
          </div>
        )}
      </div>
      
      {renderField()}
      {renderHelp()}
      
      {error && (
        <div className="mt-2 text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

export default InterviewQuestion;





