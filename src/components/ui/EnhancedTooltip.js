// src/components/ui/EnhancedTooltip.js
import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, ExternalLink } from 'lucide-react';
import { legalTermsGlossary } from '../../data/legalTermsGlossary';

export const EnhancedTooltip = ({ 
  term, 
  onLearnMore,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);
  const buttonRef = useRef(null);

  const termKey = term.toLowerCase().replace(/\s+/g, '_');
  const termData = legalTermsGlossary[termKey];

  if (!termData) {
    console.warn(`Term "${term}" not found in glossary`);
    return <span className={className}>{term}</span>;
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLearnMore = () => {
    setIsVisible(false);
    if (onLearnMore) {
      onLearnMore(term, termData);
    }
  };

  const toggleTooltip = () => setIsVisible(!isVisible);

  return (
    <span className="relative inline-block">
      <button
        ref={buttonRef}
        className={`
          inline-flex items-center gap-1 text-blue-600 
          hover:text-blue-700 focus:outline-none 
          focus:ring-2 focus:ring-blue-500 rounded px-1
          ${className}
        `}
        onClick={toggleTooltip}
        aria-describedby={`tooltip-${termKey}`}
      >
        {term}
        <HelpCircle className="w-4 h-4" />
      </button>

      {isVisible && (
        <div
          ref={tooltipRef}
          id={`tooltip-${termKey}`}
          role="tooltip"
          className="
            absolute z-50 w-72 p-3 mt-2 text-sm 
            bg-white border rounded-lg shadow-lg
          "
        >
          <div className="font-medium mb-1">{termData.term}</div>
          <div className="text-gray-600">{termData.definition}</div>
          
          {termData.example && (
            <div className="mt-2 text-xs bg-gray-50 p-2 rounded">
              <span className="font-medium">Example: </span>
              {termData.example}
            </div>
          )}
          
          <button
            className="
              text-blue-600 text-xs mt-2 
              hover:underline focus:outline-none 
              focus:ring-2 focus:ring-blue-500 
              rounded px-2 py-1
            "
            onClick={handleLearnMore}
            aria-label={`Learn more about ${term}`}
          >
            Learn More
            <ExternalLink className="w-3 h-3 inline ml-1" />
          </button>
        </div>
      )}
    </span>
  );
};

// Usage wrapper for common terms
export const LegalTerm = ({ children, onLearnMore }) => {
  const term = children.toString();
  const termKey = term.toLowerCase().replace(/\s+/g, '_');
  
  if (!legalTermsGlossary[termKey]) {
    return children;
  }
  
  return (
    <EnhancedTooltip 
      term={term} 
      onLearnMore={onLearnMore}
    />
  );
};
