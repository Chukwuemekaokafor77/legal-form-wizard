// src/components/ui/LegalTermTooltip.js
import React, { useState, useRef, useEffect } from 'react';
import { legalTerms, getRelatedTerms } from '../../utils/legalTerms';

export const LegalTermTooltip = ({ term }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const tooltipRef = useRef(null);
  const termData = legalTerms[term];
  const relatedTerms = getRelatedTerms(term);

  // Handle keyboard interactions
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsVisible(false);
        setShowLearnMore(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!termData) return <span>{term}</span>;

  return (
    <span className="relative inline-block">
      <button
        ref={tooltipRef}
        className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setShowLearnMore(true)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        aria-describedby={`tooltip-${term.replace(/\s+/g, '-')}`}
      >
        {term}
      </button>

      {isVisible && !showLearnMore && (
        <div
          id={`tooltip-${term.replace(/\s+/g, '-')}`}
          role="tooltip"
          className="absolute z-50 w-72 p-3 mt-2 text-sm bg-white border rounded-lg shadow-lg -translate-x-1/2 left-1/2"
        >
          <div className="font-medium mb-1">{termData.term}</div>
          <div className="text-gray-600">{termData.definition}</div>
          <button
            className="text-blue-600 text-xs mt-2 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              setShowLearnMore(true);
            }}
          >
            Learn More
          </button>
        </div>
      )}

      {showLearnMore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{termData.term}</h3>
              <button
                onClick={() => setShowLearnMore(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="prose max-w-none">
              <p className="font-medium mb-2">{termData.definition}</p>
              <p className="mb-4">{termData.learnMore}</p>
              
              {relatedTerms.length > 0 && (
                <>
                  <h4 className="text-md font-semibold mt-4">Related Terms</h4>
                  <ul className="list-none p-0">
                    {relatedTerms.map(related => (
                      <li key={related.term} className="mb-2">
                        <LegalTermTooltip term={related.term} />
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </span>
  );
};