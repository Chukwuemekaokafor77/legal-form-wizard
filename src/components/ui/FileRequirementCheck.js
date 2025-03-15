// src/components/ui/FileRequirementCheck.js
import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  HelpCircle, 
  File, 
  ExternalLink,
  Info 
} from 'lucide-react';

export const FileRequirementCheck = ({ 
  requirements, 
  onComplete,
  onStatusChange,
  showProgress = true
}) => {
  const [checkedItems, setCheckedItems] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);

  // Calculate progress
  const totalRequired = requirements.filter(req => req.required).length;
  const checkedRequired = requirements
    .filter(req => req.required)
    .filter(req => checkedItems[req.id])
    .length;
  const progress = totalRequired > 0 ? (checkedRequired / totalRequired) * 100 : 0;

  const updateStatus = useCallback(() => {
    // Check if all required items are checked
    const allRequiredChecked = requirements
      .filter(req => req.required)
      .every(req => checkedItems[req.id]);
    
    onComplete?.(allRequiredChecked);
    onStatusChange?.({
      isComplete: allRequiredChecked,
      checkedItems,
      progress
    });
  }, [checkedItems, requirements, onComplete, onStatusChange, progress]);

  useEffect(() => {
    updateStatus();
  }, [updateStatus]);

  const handleCheck = (id) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="space-y-6">
      {showProgress && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Document Checklist Progress</span>
            <span className="text-gray-600">
              {checkedRequired} of {totalRequired} required items
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {requirements.map(req => (
          <div 
            key={req.id} 
            className={`
              relative flex items-start p-3 rounded-lg
              ${checkedItems[req.id] ? 'bg-green-50/50' : 'bg-gray-50/50'}
              ${hoveredItem === req.id ? 'ring-1 ring-blue-200' : ''}
              transition-all duration-200
            `}
            onMouseEnter={() => setHoveredItem(req.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className="flex-shrink-0 mt-1">
              <input
                type="checkbox"
                id={req.id}
                checked={checkedItems[req.id] || false}
                onChange={() => handleCheck(req.id)}
                className="
                  w-4 h-4 rounded border-gray-300 
                  text-blue-600 focus:ring-blue-500
                  transition-colors
                "
              />
            </div>

            <div className="ml-3 flex-1">
              <label 
                htmlFor={req.id}
                className="font-medium flex items-center gap-2 cursor-pointer"
              >
                <File className="w-4 h-4 text-gray-400" aria-hidden="true" />
                {req.name}
                {req.required && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-normal">
                    Required
                  </span>
                )}
              </label>

              {req.description && (
                <div className="text-sm text-gray-600 mt-1">
                  {req.description}
                </div>
              )}

              {req.requirements && (
                <div className="mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1 mb-1">
                    <Info className="w-4 h-4 text-blue-500" aria-hidden="true" />
                    <span className="font-medium">Requirements:</span>
                  </div>
                  <ul className="list-disc ml-5 space-y-1">
                    {req.requirements.map((requirement, index) => (
                      <li key={index}>{requirement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {req.helpText && (
                <div className="mt-2 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-500" aria-hidden="true" />
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    onClick={() => window.open(req.helpLink, '_blank')}
                  >
                    {req.helpText}
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-shrink-0 ml-4">
              {checkedItems[req.id] ? (
                <CheckCircle className="w-5 h-5 text-green-500" aria-hidden="true" />
              ) : req.required ? (
                <AlertCircle className="w-5 h-5 text-amber-500" aria-hidden="true" />
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {progress === 100 && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
          <CheckCircle className="w-5 h-5" aria-hidden="true" />
          <span className="font-medium">All required documents are ready!</span>
        </div>
      )}
    </div>
  );
};

// Helper component for file requirements list
export const FileRequirementsList = ({ requirements }) => (
  <div className="space-y-3">
    {requirements.map(req => (
      <div 
        key={req.id}
        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
      >
        <File className="w-5 h-5 text-gray-400 mt-0.5" aria-hidden="true" />
        <div>
          <div className="font-medium">
            {req.name}
            {req.required && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                Required
              </span>
            )}
          </div>
          {req.description && (
            <div className="text-sm text-gray-600 mt-1">
              {req.description}
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);
