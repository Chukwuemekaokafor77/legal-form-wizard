// src/components/documents/SmartDocumentUploader.js
import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Loader, Sparkles } from 'lucide-react';
import DocumentAnalysisService from '../../services/documents/DocumentAnalysisService';

export const SmartDocumentUploader = ({
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
  
  const fileInputRef = useRef(null);
  const dragTimeout = useRef(null);
  
  // Handle file selection
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
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 20;
          return newProgress > 90 ? 90 : newProgress; // Cap at 90% until analysis is done
        });
      }, 300);
      
      // Analyze document
      const result = await DocumentAnalysisService.analyzeDocument(selectedFile, documentType);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setAnalysisResult(result);
      
      // Call onAnalysisComplete with extracted fields if available
      if (result && result.formFields) {
        onAnalysisComplete?.(result.formFields, result);
      }
      
      // Call onUpload with the file
      onUpload?.(selectedFile, {
        type: documentType,
        name: documentName,
        extractedData: result
      });
      
      // Show extracted data if available
      if (result && Object.keys(result).length > 0) {
        setShowExtractedData(true);
      }
    } catch (err) {
      clearInterval(progressInterval);
      console.error('Error analyzing document:', err);
      setError(`Error analyzing document: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  }, [documentType, documentName, maxSize, acceptedFormats, onUpload, onAnalysisComplete]);
  
  // Handle input change
  const handleInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileChange(selectedFile);
    }
  };
  
  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
      
      // Clear any existing timeout
      if (dragTimeout.current) {
        clearTimeout(dragTimeout.current);
      }
    } else if (e.type === 'dragleave') {
      // Set a timeout to avoid flickering when moving between child elements
      dragTimeout.current = setTimeout(() => {
        setDragActive(false);
      }, 50);
    }
  }, []);
  
  // Handle drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, [handleFileChange]);
  
  // Handle click on upload area
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  // Handle file removal
  const handleRemoveFile = () => {
    setFile(null);
    setAnalysisResult(null);
    setShowExtractedData(false);
    setError(null);
    setUploadProgress(0);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className="smart-document-uploader">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={acceptedFormats.join(',')}
        onChange={handleInputChange}
      />
      
      {/* Show upload area if no file is selected */}
      {!file && (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
            transition-colors duration-200 cursor-pointer
          `}
          onClick={handleUploadClick}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-blue-500 mb-2" />
            <h4 className="text-lg font-medium text-gray-700">
              Upload {documentName}
            </h4>
            <p className="text-sm text-gray-500 mt-1 max-w-md">
              {description || `Drag and drop or click to upload your ${documentName}.`}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Accepted formats: {acceptedFormats.map(format => format.split('/')[1].toUpperCase()).join(', ')} (Max {Math.round(maxSize / (1024 * 1024))}MB)
            </p>
            
            <div className="mt-4 px-4 py-2 bg-blue-100 rounded-full flex items-center gap-2 text-sm text-blue-700">
              <Sparkles className="w-4 h-4" />
              <span>Smart document analysis will automatically extract data</span>
            </div>
            
            {required && (
              <div className="text-xs text-red-500 mt-2">
                * Required document
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Show file info and progress when file is selected */}
      {file && (
        <div className="border rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              <FileText className="w-8 h-8 text-blue-500 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-800">{file.name}</h4>
                <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            </div>
            
            <button
              onClick={handleRemoveFile}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full ${uploadProgress === 100 ? 'bg-green-500' : 'bg-blue-500'} transition-all duration-300`}
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className={`flex items-center gap-1 ${isAnalyzing ? 'text-blue-600' : uploadProgress === 100 ? 'text-green-600' : 'text-gray-500'}`}>
              {isAnalyzing ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Analyzing document...</span>
                </>
              ) : uploadProgress === 100 ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Upload complete</span>
                </>
              ) : (
                <>
                  <span>Uploading...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </>
              )}
            </div>
            
            {!isAnalyzing && uploadProgress === 100 && (
              <button
                onClick={() => setShowExtractedData(!showExtractedData)}
                className="text-blue-600 hover:text-blue-800"
              >
                {showExtractedData ? 'Hide' : 'Show'} extracted data
              </button>
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
              
              <div className="space-y-2 text-sm">
                {Object.entries(analysisResult.formFields || {}).map(([field, value]) => (
                  <div key={field} className="grid grid-cols-2 gap-2">
                    <div className="text-gray-600">{field.split('.').join(' › ')}</div>
                    <div className="font-medium">{value.toString()}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 text-xs text-gray-500">
                This data will be used to prefill your forms.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartDocumentUploader;