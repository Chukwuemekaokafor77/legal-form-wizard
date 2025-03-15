// src/components/ui/LegalDisclaimer.js
import React from 'react';

export const LegalDisclaimer = () => {
  return (
    <div className="mt-8 pt-4 border-t border-gray-200">
      <div className="text-xs text-gray-500">
        <p className="mb-1">
          <span className="font-semibold">Disclaimer:</span> This tool does not provide legal advice. 
          It is designed to help you complete court forms but is not a substitute for professional legal counsel.
        </p>
        <p>
          For legal advice about your situation, please consult with a qualified lawyer.
        </p>
      </div>
    </div>
  );
};