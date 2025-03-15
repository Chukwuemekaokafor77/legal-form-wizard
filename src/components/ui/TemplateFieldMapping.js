// src/components/ui/TemplateFieldMapping.js
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from './Alert';

export const TemplateFieldMapping = ({ 
  formFields, 
  templateFields, 
  initialMapping = {}, 
  onMappingChange,
  onValidate 
}) => {
  const [mapping, setMapping] = useState(initialMapping);
  const [unmappedFields, setUnmappedFields] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    validateMapping();
  }, [mapping]);

  const validateMapping = () => {
    const unmapped = templateFields.filter(
      field => !mapping[field.name] && field.isRequired
    );
    setUnmappedFields(unmapped);
    
    const isValid = unmapped.length === 0;
    onValidate?.(isValid);
    return isValid;
  };

  const handleMappingChange = (templateField, formField) => {
    const newMapping = {
      ...mapping,
      [templateField]: formField
    };
    setMapping(newMapping);
    onMappingChange(newMapping);
  };

  const getFieldSuggestion = (templateFieldName) => {
    // Simple field name matching logic
    const normalized = templateFieldName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return formFields.find(field => 
      field.toLowerCase().replace(/[^a-z0-9]/g, '') === normalized
    );
  };

  const autoMapFields = () => {
    const newMapping = { ...mapping };
    templateFields.forEach(field => {
      if (!mapping[field.name]) {
        const suggestion = getFieldSuggestion(field.name);
        if (suggestion) {
          newMapping[field.name] = suggestion;
        }
      }
    });
    setMapping(newMapping);
    onMappingChange(newMapping);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Field Mapping</h3>
        <button
          onClick={autoMapFields}
          className="text-sm text-blue-600 hover:underline"
        >
          Auto-map Fields
        </button>
      </div>

      {unmappedFields.length > 0 && (
        <Alert variant="warning">
          <AlertDescription>
            {unmappedFields.length} required fields still need to be mapped
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {templateFields.map(field => (
          <div key={field.name} className="grid grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {field.name}
                {field.isRequired && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              <span className="text-xs text-gray-500">
                Type: {field.type}
              </span>
            </div>
            <select
              value={mapping[field.name] || ''}
              onChange={(e) => handleMappingChange(field.name, e.target.value)}
              className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 
                         focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm 
                         rounded-md ${!mapping[field.name] && field.isRequired ? 'border-red-300' : ''}`}
            >
              <option value="">Select field</option>
              {formFields.map(formField => (
                <option key={formField} value={formField}>
                  {formField}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};