// src/components/ui/RequiredDocumentList.js
import React from 'react';

export const RequiredDocumentList = ({ documents, onCheck }) => {
  return (
    <div className="space-y-4">
      {documents.map((doc, index) => (
        <div key={index} className="flex items-start p-4 bg-gray-50 rounded">
          <input
            type="checkbox"
            checked={doc.checked}
            onChange={(e) => onCheck(index, e.target.checked)}
            className="mt-1 mr-3"
          />
          <div>
            <div className="font-medium">{doc.name}</div>
            <div className="text-sm text-gray-600 mt-1">{doc.description}</div>
            {doc.alternatives && (
              <div className="text-sm text-gray-500 mt-1">
                Alternatives: {doc.alternatives}
              </div>
            )}
            {doc.whereToGet && (
              <div className="text-sm text-blue-600 mt-1 cursor-pointer hover:underline">
                Where to get this document
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};