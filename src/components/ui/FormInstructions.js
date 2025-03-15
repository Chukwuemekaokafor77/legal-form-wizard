// src/components/ui/FormInstructions.js
import React, { useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp,
  Lightbulb
} from 'lucide-react';

export const FormInstructions = ({ 
  instructions,
  collapsible = true,
  showProgress = true,
  onInstructionClick
}) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [checkedInstructions, setCheckedInstructions] = useState({});

  const handleInstructionCheck = (index) => {
    setCheckedInstructions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const completedCount = Object.values(checkedInstructions).filter(Boolean).length;
  const progress = instructions.length > 0 ? (completedCount / instructions.length) * 100 : 0;

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="bg-blue-50 border-b border-blue-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg flex items-center">
            <Info className="w-5 h-5 mr-2 text-blue-500" />
            Important Instructions
          </h3>
          {showProgress && (
            <span className="text-sm text-blue-600">
              {completedCount} of {instructions.length} completed
            </span>
          )}
        </div>

        {showProgress && (
          <div className="h-2 bg-blue-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <div className="divide-y">
        {instructions.map((instruction, index) => {
          const isExpanded = expandedIndex === index;
          const isChecked = checkedInstructions[index];
          const hasDetails = instruction.details || instruction.note || instruction.links;

          return (
            <div 
              key={index}
              className={`p-4 transition-colors duration-200 ${isChecked ? 'bg-green-50' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-start gap-3">
                <div 
                  className={`
                    flex-shrink-0 w-6 h-6 rounded-full 
                    flex items-center justify-center text-sm
                    ${isChecked 
                      ? 'bg-green-500' 
                      : instruction.required 
                        ? 'bg-blue-500' 
                        : 'bg-gray-400'
                    }
                    text-white font-medium
                  `}
                >
                  {isChecked ? <CheckCircle className="w-4 h-4" aria-hidden="true" /> : index + 1}
                </div>

                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <div className="font-medium flex items-center gap-2">
                        {instruction.title}
                        {instruction.required && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                            Required
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {instruction.description}
                      </div>
                    </div>

                    {collapsible && hasDetails && (
                      <button
                        onClick={() => setExpandedIndex(isExpanded ? null : index)}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1"
                        aria-expanded={isExpanded}
                        aria-label={`Toggle details for instruction ${index + 1}`}
                      >
                        {isExpanded ? <ChevronUp /> : <ChevronDown />}
                      </button>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pl-[1rem]">
                      {instruction.details && (
                        <div className="text-sm text-gray-600 space-y-[0.5rem]">
                          {Array.isArray(instruction.details) ? (
                            <ul className="list-disc pl-[1rem] space-y-[0.25rem]">
                              {instruction.details.map((detail, idx) => (
                                <li key={idx}>{detail}</li>
                              ))}
                            </ul>
                          ) : (
                            <p>{instruction.details}</p>
                          )}
                        </div>
                      )}

                      {instruction.note && (
                        <div className="mt-[0.75rem] flex items-start gap-[0.5rem] p-[0.75rem] bg-yellow-50 rounded-lg">
                          <Lightbulb className="w-[1.25rem] h-[1.25rem] text-yellow-500 flex-shrink-[0]" aria-hidden="true" />
                          <p className="text-sm text-yellow-[700]">{instruction.note}</p>
                        </div>
                      )}

                      {instruction.links?.length > 0 && (
                        <div className="mt-[0.75rem] space-y-[0.5rem]">
                          {instruction.links.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="
                                text-sm text-blue-[600] hover:text-blue-[700]
                                flex items-center gap-[0.25rem]
                              "
                            >
                              {link.text}
                              <ExternalLink className="[w-.75rem][h-.75rem]" aria-hidden />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Checkbox for marking instruction as complete */}
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleInstructionCheck(index)}
                  aria-label={`Mark instruction ${index + 1} as complete`}
                  className="
                    w-[1rem][h-.75rem][rounded-border-gray]
                    focus:ring-blue transition-colors
                  "
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
