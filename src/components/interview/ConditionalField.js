// src/components/interview/ConditionalField.js
import React, { useMemo } from 'react';
import InterviewQuestion from './InterviewQuestion';

const ConditionalField = ({
  field,
  value,
  onChange,
  parentData,
  locale = 'en'
}) => {
  // Determine if the field should be displayed based on conditions
  const shouldDisplay = useMemo(() => {
    if (!field.condition) return true;
    
    const { field: conditionField, operator, value: conditionValue } = field.condition;
    const fieldValue = parentData?.[conditionField];
    
    switch (operator) {
      case 'equals':
        return fieldValue === conditionValue;
      case 'notEquals':
        return fieldValue !== conditionValue;
      case 'contains':
        return Array.isArray(fieldValue) && fieldValue.includes(conditionValue);
      case 'greaterThan':
        return fieldValue > conditionValue;
      case 'lessThan':
        return fieldValue < conditionValue;
      case 'exists':
        return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
      case 'notExists':
        return fieldValue === undefined || fieldValue === null || fieldValue === '';
      default:
        return true;
    }
  }, [field.condition, parentData]);
  
  if (!shouldDisplay) {
    return null;
  }
  
  return (
    <InterviewQuestion
      question={field}
      value={value}
      onChange={onChange}
      locale={locale}
    />
  );
};

export default ConditionalField;