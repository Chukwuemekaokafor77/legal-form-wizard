// src/components/wizard/Step4.js (New)
import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { FileText, Upload, CheckCircle, AlertCircle } from 'lucide-react';

const DocumentUploader = ({ document, onUpload }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Basic validation (file type and size)
      if (selectedFile.type !== 'application/pdf' &&
          !selectedFile.type.startsWith('image/')) {
        setError('Invalid file type. Only PDF and images are allowed.');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit.');
        return;
      }

      setFile(selectedFile);
      setError(null);
      onUpload(document.id, selectedFile);
    }
  }, [document, onUpload]);

  return (
    <div className="border rounded-md p-4 space-y-2">
      <label className="block text-sm font-medium text-gray-700">{document.name}</label>
      <input
        type="file"
        accept="application/pdf,image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0 file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {file && (
        <div className="flex items-center text-green-600 text-sm">
          <CheckCircle className="w-4 h-4 mr-1" />
          Uploaded: {file.name}
        </div>
      )}
    </div>
  );
};

const Step4 = ({ onChange, answers }) => {
  const [uploadedDocuments, setUploadedDocuments] = useState(answers.uploadedDocuments || {});
  const [uploadErrors, setUploadErrors] = useState({});

  const requiredDocuments = answers.caseType?.requiredDocuments || []; // Access from answers

  const handleDocumentUpload = (docId, file) => {
    setUploadedDocuments(prev => ({ ...prev, [docId]: file }));
    setUploadErrors(prev => {
      const { [docId]: omit, ...rest } = prev;
      return rest;
    }); // Clear error
    onChange({ uploadedDocuments: { ...uploadedDocuments, [docId]: file } }); // Update parent
  };

  const validate = () => {
    const newErrors = {};
    requiredDocuments.forEach(doc => {
      if (!uploadedDocuments[doc.id]) {
        newErrors[doc.id] = `${doc.name} is required`;
      }
    });
    setUploadErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Upload Required Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {requiredDocuments.map(doc => (
            <div key={doc.id}>
              <DocumentUploader
                document={doc}
                onUpload={handleDocumentUpload}
              />
              {uploadErrors[doc.id] && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {uploadErrors[doc.id]}
                </p>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Step4;
