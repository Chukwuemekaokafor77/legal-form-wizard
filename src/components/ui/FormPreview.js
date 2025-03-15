// src/components/ui/FormPreview.js
import React, { useState, useMemo } from 'react';
import { LegalText } from './LegalText';
import { 
  ChevronDown, 
  ChevronUp, 
  Edit, 
  Printer, 
  Download,
  FileText,
  AlertCircle,
  Eye
} from 'lucide-react';

export const FormPreview = ({ 
  formData, 
  formId, 
  title, 
  onEdit,
  onPrint,
  onDownload,
  validation = {},
  defaultExpanded = ['parties']
}) => {
  const [expandedSections, setExpandedSections] = useState(new Set(defaultExpanded));
  
  const sections = useMemo(() => {
    return Object.entries(formData).map(([key, data]) => ({
      key,
      title: key.replace(/([A-Z])/g, ' $1').trim(),
      data,
      hasErrors: Object.keys(validation).some(error => 
        error.startsWith(key) && validation[error].severity === 'error'
      ),
      warnings: Object.entries(validation)
        .filter(([field, val]) => 
          field.startsWith(key) && val.severity === 'warning'
        )
        .map(([_, val]) => val.message)
    }));
  }, [formData, validation]);

  const toggleSection = (section) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const renderValue = (value, key) => {
    if (value === null || value === undefined) return "Not provided";
    
    if (Array.isArray(value)) {
      return value.map((item, index) => (
        <div key={index} className="ml-2">
          {typeof item === 'object' 
            ? Object.entries(item).map(([k, v]) => (
                <div key={k} className="mb-1">
                  <span className="text-gray-600">{k}: </span>
                  {renderValue(v, k)}
                </div>
              ))
            : item
          }
        </div>
      ));
    }
    
    if (typeof value === 'object') {
      return Object.entries(value).map(([k, v]) => (
        <div key={k} className="ml-2 mb-1">
          <span className="text-gray-600">{k}: </span>
          {renderValue(v, k)}
        </div>
      ));
    }
    
    if (typeof value === 'boolean') {
      return (
        <span className={`px-2 py-0.5 rounded text-sm ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? "Yes" : "No"}
        </span>
      );
    }

    if (key === 'date' || key.includes('Date')) {
      return new Date(value).toLocaleDateString();
    }

    if (typeof value === 'number') {
      if (key.toLowerCase().includes('amount') || key.toLowerCase().includes('payment')) {
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD' 
        }).format(value);
      }
      return value.toLocaleString();
    }

    return value;
  };

  const renderSection = (section) => {
    if (!section.data || Object.keys(section.data).length === 0) return null;

    const isExpanded = expandedSections.has(section.key);

    return (
      <div key={section.key} className="border rounded-lg mb-4">
        <button
          className={`
            w-full px-4 py-3 text-left font-medium
            flex justify-between items-center
            ${section.hasErrors 
              ? 'bg-red-50 hover:bg-red-100' 
              : 'bg-gray-50 hover:bg-gray-100'
            }
            rounded-t-lg
          `}
          onClick={() => toggleSection(section.key)}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="capitalize">{section.title}</span>
            {section.hasErrors && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                Has errors
              </span>
            )}
          </div>
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        {isExpanded && (
          <div className="p-4">
            {section.warnings.length > 0 && (
              <div className="mb-4 p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2 text-amber-800 font-medium mb-2">
                  <AlertCircle className="w-5 h-5" />
                  Warnings
                </div>
                <ul className="list-disc pl-5 text-sm text-amber-700 space-y-1">
                  {section.warnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-3">
              {Object.entries(section.data).map(([key, value]) => (
                <div key={key}>
                  <div className="text-sm font-medium text-gray-600 capitalize mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </div>
                  <div className="ml-4">
                    <LegalText>
                      {renderValue(value, key)}
                    </LegalText>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t flex justify-end gap-2">
              <button
                onClick={() => onEdit(section.key)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit size={16} />
                Edit Section
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border rounded-lg">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">
              Form {formId}: {title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpandedSections(new Set(sections.map(s => s.key)))}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              <Eye size={16} />
              Expand All
            </button>
            {onPrint && (
              <button
                onClick={onPrint}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                <Printer size={16} />
                Print
              </button>
            )}
            {onDownload && (
              <button
                onClick={onDownload}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                <Download size={16} />
                Download
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        {sections.map(renderSection)}
      </div>
    </div>
  );
};