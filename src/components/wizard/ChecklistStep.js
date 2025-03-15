// src/components/wizard/ChecklistStep.js
import React, { useEffect, useState } from 'react';
import { pathwayRequirements } from '../../data/pathwayRequirements';

const ChecklistStep = ({ caseType, nextStep }) => {
  const [requiredDocuments, setRequiredDocuments] = useState([]);

  useEffect(() => {
    // Fetch required documents based on caseType
    if (caseType && pathwayRequirements[caseType]) {
      setRequiredDocuments(pathwayRequirements[caseType].requiredDocuments);
    }
  }, [caseType]);

  return (
    <div className="card">
      <h2>Before You Begin</h2>
      <p>Ensure you have the following documents ready:</p>
      <ul className="list-disc pl-5">
        {requiredDocuments.map(doc => (
          <li key={doc.id}>
            {doc.name} - {doc.description}
          </li>
        ))}
      </ul>
      <button
        onClick={nextStep}
        className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
      >
        Proceed
      </button>
    </div>
  );
};

export default ChecklistStep;
