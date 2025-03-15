// src/components/ui/DocumentPreparationGuide.js
import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, HelpCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';

export const DocumentPreparationGuide = ({ 
  requiredDocuments,
  onDocumentCheck,
  expandable = true,
  initialCheckedDocs = {}
}) => {
  const [checkedDocs, setCheckedDocs] = useState(initialCheckedDocs);
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoveredDoc, setHoveredDoc] = useState(null);

  useEffect(() => {
    setCheckedDocs(initialCheckedDocs);
  }, [initialCheckedDocs]);

  const handleCheckDocument = (docId) => {
    const newCheckedDocs = {
      ...checkedDocs,
      [docId]: !checkedDocs[docId]
    };
    setCheckedDocs(newCheckedDocs);
    if (onDocumentCheck) {
      onDocumentCheck(newCheckedDocs);
    }
  };

  const getCompletionStatus = () => {
    const totalRequired = requiredDocuments.filter(doc => !doc.optional).length;
    const completed = Object.values(checkedDocs).filter(Boolean).length;
    return {
      completed,
      total: totalRequired,
      percentage: totalRequired > 0 ? Math.round((completed / totalRequired) * 100) : 0
    };
  };

  const status = getCompletionStatus();

  return (
    <div className="bg-blue-50 border rounded-lg overflow-hidden">
      <div className="border-l-4 border-blue-400 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-lg">Required Documents</h3>
          </div>
          {expandable && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? "Collapse document list" : "Expand document list"}
            >
              {isExpanded ? <ChevronUp aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
            </button>
          )}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">Please have these documents ready:</p>
          <div className="text-sm text-blue-600">
            {status.completed} of {status.total} completed
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-blue-100 rounded mb-4">
          <div 
            className="h-full bg-blue-500 rounded transition-all duration-300"
            style={{ width: `${status.percentage}%` }}
            role="progressbar"
            aria-valuenow={status.percentage}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>

        {isExpanded && (
          <ul className="space-y-3">
            {requiredDocuments.map((doc) => (
              <li 
                key={doc.id} 
                className="flex items-start gap-3 p-2 rounded hover:bg-blue-100 transition-colors"
                onMouseEnter={() => setHoveredDoc(doc.id)}
                onMouseLeave={() => setHoveredDoc(null)}
              >
                <div className="flex-shrink-0 mt-1">
                  <input 
                    type="checkbox" 
                    id={doc.id}
                    checked={checkedDocs[doc.id] || false}
                    onChange={() => handleCheckDocument(doc.id)}
                    className="
                      w-4 h-4 rounded border-gray-300 text-blue-600 
                      focus:ring-blue-500 transition-colors cursor-pointer
                    "
                  />
                </div>
                <div className="flex-grow">
                  <label 
                    htmlFor={doc.id}
                    className="flex items-center gap-2 font-medium cursor-pointer"
                  >
                    {doc.name}
                    {doc.optional && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        Optional
                      </span>
                    )}
                  </label>
                  {doc.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {doc.description}
                    </p>
                  )}
                  {doc.requirements && hoveredDoc === doc.id && (
                    <div className="mt-2 text-sm bg-white p-2 rounded border border-blue-100">
                      <div className="font-medium mb-1">Requirements:</div>
                      <ul className="list-disc pl-4 space-y-1">
                        {doc.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {doc.hint && (
                  <button 
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                    title={doc.hint}
                    aria-label={`Hint for ${doc.name}`}
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {isExpanded && status.completed === status.total && status.total > 0 && (
        <div className="bg-green-50 p-3 border-t border-green-100">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span>All required documents are ready!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const DocumentItem = ({ name, description, isOptional, requirements, className = '' }) => (
  <div className={`flex items-start gap-2 ${className}`}>
    <FileText className="w-5 h-5 mt-1 text-blue-500" />
    <div>
      <div className="flex items-center gap-2">
        <span className="font-medium">{name}</span>
        {isOptional && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
            Optional
          </span>
        )}
      </div>
      {description && (
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      )}
      {requirements && (
        <ul className="mt-2 text-sm text-gray-600 space-y-1">
          {requirements.map((req, index) => (
            <li key={index} className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 text-amber-500" />
              <span>{req}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);
