// src/components/ui/LegalText.js
import React from 'react';
import { findTermDefinitions } from '../../utils/legalTerms';
import { LegalTermTooltip } from './LegalTermTooltip';

export const LegalText = ({ children }) => {
  if (typeof children !== 'string') return children;

  const terms = findTermDefinitions(children);
  if (terms.length === 0) return children;

  const parts = children.split(new RegExp(`(${terms.join('|')})`, 'g'));

  return (
    <span>
      {parts.map((part, index) => 
        terms.includes(part) ? (
          <LegalTermTooltip key={index} term={part} />
        ) : (
          part
        )
      )}
    </span>
  );
};