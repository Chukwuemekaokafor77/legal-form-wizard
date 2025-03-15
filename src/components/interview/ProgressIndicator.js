// src/components/interview/ProgressIndicator.js
import React from 'react';

const ProgressIndicator = ({
  current,
  total,
  percentage,
  completed = [],
  onQuestionClick
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium">
          Question {current} of {total}
        </div>
        <div className="text-sm text-gray-600">
          {Math.round(percentage)}% complete
        </div>
      </div>
      
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }).map((_, index) => {
          const isCompleted = completed.includes(index);
          const isCurrent = index === current - 1;
          
          return (
            <button
              key={index}
              className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs
                transition-colors duration-200
                ${isCompleted 
                  ? 'bg-blue-500 text-white' 
                  : isCurrent 
                    ? 'bg-blue-200 text-blue-800' 
                    : 'bg-gray-200 text-gray-600'}
              `}
              onClick={() => onQuestionClick(index)}
              disabled={!isCompleted && !isCurrent}
              aria-label={`Go to question ${index + 1}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;