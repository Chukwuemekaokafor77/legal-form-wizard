// Enhance the SmartDocumentUploader component
// src/components/documents/EnhancedDocumentUploader.jsx

import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Loader, Sparkles, Eye } from 'lucide-react';

export const EnhancedDocumentUploader = ({
  documentType,
  documentName,
  description,
  onUpload,
  onAnalysisComplete,
  maxSize = 10 * 1024 * 1024, // 10MB in bytes
  acceptedFormats = ['application/pdf', 'image/jpeg', 'image/png'],
  required = false
}) => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showExtractedData, setShowExtractedData] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const fileInputRef = useRef(null);
  
  // Handle file selection with visual progress
  const handleFileChange = useCallback(async (selectedFile) => {
    if (!selectedFile) return;
    
    // Validate file type
    if (!acceptedFormats.includes(selectedFile.type)) {
      setError(`Invalid file type. Please upload ${acceptedFormats.map(format => format.split('/')[1].toUpperCase()).join(', ')}`);
      return;
    }
    
    // Validate file size
    if (selectedFile.size > maxSize) {
      setError(`File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`);
      return;
    }
    
    try {
      setFile(selectedFile);
      setError(null);
      setIsAnalyzing(true);
      setUploadProgress(0);
      
      // Generate preview URL for the file
      if (selectedFile.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else if (selectedFile.type === 'application/pdf') {
        // For PDFs, we might need a PDF viewer or thumbnail
        setPreviewUrl(URL.createObjectURL(selectedFile));
      }
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 20;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);
      
      // Simulate document analysis
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        // Mock analysis result
        const mockAnalysisResult = {
          confidence: 0.85,
          formFields: {
            'personalInfo.fullName': 'John Smith',
            'personalInfo.dateOfBirth': '1985-06-15',
            'contactInfo.email': 'john.smith@example.com',
            'addressInfo.street': '123 Main St',
            'addressInfo.city': 'Toronto',
            'addressInfo.province': 'Ontario'
          }
        };
        
        setAnalysisResult(mockAnalysisResult);
        onAnalysisComplete?.(mockAnalysisResult.formFields, mockAnalysisResult);
        setIsAnalyzing(false);
        setShowExtractedData(true);
        
        // Call onUpload with the file
        onUpload?.(selectedFile, {
          type: documentType,
          name: documentName,
          extractedData: mockAnalysisResult
        });
      }, 2500);
      
    } catch (err) {
      console.error('Error analyzing document:', err);
      setError(`Error analyzing document: ${err.message}`);
      setIsAnalyzing(false);
    }
  }, [documentType, documentName, maxSize, acceptedFormats, onUpload, onAnalysisComplete]);
  
  // UI for the uploader
  return (
    <div className="enhanced-document-uploader bg-white rounded-lg border shadow-sm p-4">
      <div className="mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <FileText className="text-blue-500" size={20} />
          {documentName}
          {required && <span className="text-red-500 text-sm">*Required</span>}
        </h3>
        {description && (
          <p className="text-gray-600 text-sm mt-1">{description}</p>
        )}
      </div>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={acceptedFormats.join(',')}
        onChange={(e) => handleFileChange(e.target.files[0])}
      />
      
      {/* Upload area */}
      {!file ? (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
            cursor-pointer
          `}
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            handleFileChange(e.dataTransfer.files[0]);
          }}
        >
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-12 h-12 text-blue-500" />
            <h4 className="text-lg font-medium text-gray-700">
              Upload {documentName}
            </h4>
            <p className="text-sm text-gray-500 max-w-md">
              Drag and drop or click to upload. We'll automatically extract information to help fill your forms.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Accepted formats: {acceptedFormats.map(format => format.split('/')[1].toUpperCase()).join(', ')} (Max {Math.round(maxSize / (1024 * 1024))}MB)
            </p>
            
            <div className="mt-4 px-4 py-2 bg-blue-100 rounded-full flex items-center gap-2 text-sm text-blue-700">
              <Sparkles className="w-4 h-4" />
              <span>Smart document analysis will automatically extract data</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          {/* File info and preview */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-grow">
              <div className="flex items-start gap-3">
                <FileText className="w-8 h-8 text-blue-500 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-800">{file.name}</h4>
                  <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  
                  {uploadProgress < 100 && (
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => {
                    setFile(null);
                    setAnalysisResult(null);
                    setShowExtractedData(false);
                    setError(null);
                    setUploadProgress(0);
                    if (previewUrl) {
                      URL.revokeObjectURL(previewUrl);
                      setPreviewUrl(null);
                    }
                  }}
                  className="ml-auto text-gray-400 hover:text-gray-600 p-1"
                  aria-label="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Status indicator */}
              <div className="mt-3">
                {isAnalyzing ? (
                  <div className="flex items-center gap-2 text-blue-700">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Analyzing document...</span>
                  </div>
                ) : uploadProgress === 100 ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Document analyzed successfully</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>Uploading... {Math.round(uploadProgress)}%</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Document preview */}
            {previewUrl && (
              <div className="flex-shrink-0 w-28 h-28 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {file.type.startsWith('image/') ? (
                  <img src={previewUrl} alt="Document preview" className="max-w-full max-h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <FileText size={32} />
                    <div className="mt-1 text-xs">Preview</div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mt-3 flex items-start gap-2 text-red-600 text-sm p-2 bg-red-50 rounded">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {/* Extracted data */}
          {showExtractedData && analysisResult && (
            <div className="mt-4 border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span>Extracted Information</span>
                </h5>
                <div className="text-xs text-gray-500">
                  Confidence: {Math.round(analysisResult.confidence * 100)}%
                </div>
              </div>
              
              <div className="space-y-2 max-h-40 overflow-y-auto text-sm">
                {Object.entries(analysisResult.formFields || {}).map(([field, value]) => (
                  <div key={field} className="grid grid-cols-2 gap-2 border-b border-gray-100 pb-1">
                    <div className="text-gray-600 overflow-hidden text-ellipsis whitespace-nowrap">
                      {field.split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' › ')}
                    </div>
                    <div className="font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                      {value?.toString() || ''}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => onAnalysisComplete?.(analysisResult.formFields, analysisResult)}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  Apply to Form
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};