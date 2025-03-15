// src/components/wizard/Step4.js
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { FileText, Upload, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/Alert';
import { pathwayRequirements } from '../../data/pathwayRequirements';
import SmartDocumentUploader from '../documents/SmartDocumentUploader';


const Step4 = ({ 
  onChange, 
  answers = {},
  onLearnMore
}) => {
  const [uploadedDocuments, setUploadedDocuments] = useState(answers.uploadedDocuments || {});
  const [requiredDocuments, setRequiredDocuments] = useState([]);
  const [optionalDocuments, setOptionalDocuments] = useState([]);
  const [uploadErrors, setUploadErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [extractedData, setExtractedData] = useState({});
  const [showFieldMappingInfo, setShowFieldMappingInfo] = useState(false);
  
  // Load required documents based on case type
  useEffect(() => {
    if (answers.legalCategory) {
      const pathway = pathwayRequirements[answers.legalCategory];
      if (pathway && pathway.requiredDocuments) {
        const required = [];
        const optional = [];
        
        pathway.requiredDocuments.forEach(doc => {
          if (doc.optional) {
            optional.push(doc);
          } else {
            required.push(doc);
          }
        });
        
        setRequiredDocuments(required);
        setOptionalDocuments(optional);
      }
    }
    setIsLoading(false);
  }, [answers.legalCategory]);
  
  // Handle document upload
  const handleUpload = useCallback((docId, file, metadata) => {
    const newUploadedDocuments = {
      ...uploadedDocuments,
      [docId]: {
        file,
        type: docId,
        uploadedAt: new Date().toISOString(),
        metadata
      }
    };
    
    setUploadedDocuments(newUploadedDocuments);
    setUploadErrors(prev => {
      const { [docId]: _, ...rest } = prev;
      return rest;
    });
    
    // Update parent component
    onChange({ 
      uploadedDocuments: newUploadedDocuments 
    });
  }, [uploadedDocuments, onChange]);
  
  // Handle analysis completion - merge extracted data from all documents
  const handleAnalysisComplete = useCallback((formFields, result, docId) => {
    // Add any extracted data to our state
    if (formFields && Object.keys(formFields).length > 0) {
      setExtractedData(prev => ({
        ...prev,
        [docId]: {
          fields: formFields,
          extractedAt: new Date().toISOString(),
          confidence: result.confidence
        }
      }));
      
      // Show field mapping info if this is the first document with extracted data
      if (Object.keys(extractedData).length === 0) {
        setShowFieldMappingInfo(true);
      }
    }
  }, [extractedData]);
  
  // Apply extracted data to form
  const handleApplyExtractedData = useCallback(() => {
    // Combine all extracted fields, prioritizing higher confidence values
    const mergedFields = {};
    let fieldsApplied = 0;
    
    Object.values(extractedData).forEach(docData => {
      Object.entries(docData.fields).forEach(([field, value]) => {
        // Only overwrite if field doesn't exist or new confidence is higher
        if (
          !mergedFields[field] || 
          (docData.confidence > mergedFields[field].confidence)
        ) {
          mergedFields[field] = {
            value,
            confidence: docData.confidence
          };
        }
      });
    });
    
    // Convert to the format expected by the onChange handler
    const formUpdates = {};
    Object.entries(mergedFields).forEach(([field, data]) => {
      // Parse field path (e.g., 'personalInfo.fullName')
      const fieldParts = field.split('.');
      let currentObj = formUpdates;
      
      // Build nested structure
      for (let i = 0; i < fieldParts.length - 1; i++) {
        const part = fieldParts[i];
        if (!currentObj[part]) {
          currentObj[part] = {};
        }
        currentObj = currentObj[part];
      }
      
      // Set the value at the leaf node
      const lastPart = fieldParts[fieldParts.length - 1];
      currentObj[lastPart] = data.value;
      fieldsApplied++;
    });
    
    // Update parent component with extracted data
    if (fieldsApplied > 0) {
      onChange(formUpdates);
      
      // Show success message
      alert(`Successfully applied ${fieldsApplied} extracted fields to your form!`);
    }
  }, [extractedData, onChange]);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Upload Required Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center p-6">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <>
              {/* Field mapping info alert */}
              {showFieldMappingInfo && (
                <Alert variant="info" className="mb-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Smart Document Analysis</h4>
                      <AlertDescription>
                        We've detected information in your uploaded documents that can be used to pre-fill your forms.
                        <button 
                          onClick={handleApplyExtractedData}
                          className="ml-2 text-blue-600 font-medium hover:text-blue-800"
                        >
                          Apply extracted data
                        </button>
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              )}
              
              {/* Required documents section */}
              {requiredDocuments.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Required Documents</h3>
                  <div className="space-y-4">
                    {requiredDocuments.map(doc => (
                      <div key={doc.id}>
                        <SmartDocumentUploader
                          documentType={doc.id}
                          documentName={doc.name}
                          description={doc.description}
                          onUpload={(file, metadata) => handleUpload(doc.id, file, metadata)}
                          onAnalysisComplete={(fields, result) => 
                            handleAnalysisComplete(fields, result, doc.id)
                          }
                          required={true}
                        />
                        {uploadErrors[doc.id] && (
                          <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {uploadErrors[doc.id]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Optional documents section */}
              {optionalDocuments.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Optional Documents</h3>
                  <div className="space-y-4">
                    {optionalDocuments.map(doc => (
                      <div key={doc.id}>
                        <SmartDocumentUploader
                          documentType={doc.id}
                          documentName={doc.name}
                          description={doc.description}
                          onUpload={(file, metadata) => handleUpload(doc.id, file, metadata)}
                          onAnalysisComplete={(fields, result) => 
                            handleAnalysisComplete(fields, result, doc.id)
                          }
                          required={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Help section */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  Document Tips
                </h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>Make sure documents are clear and all text is legible</li>
                  <li>For best results, upload PDF documents when available</li>
                  <li>Personal information from your documents will be used to prefill forms</li>
                  <li>All documents are processed securely and not stored permanently</li>
                </ul>
                <button
                  onClick={() => onLearnMore?.('documentUpload')}
                  className="text-sm text-blue-600 hover:text-blue-800 mt-2"
                >
                  Learn more about document requirements
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Step4;