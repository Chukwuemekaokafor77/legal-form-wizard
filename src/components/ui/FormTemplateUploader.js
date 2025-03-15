// src/components/ui/FormTemplateUploader.js
import React, { useState, useCallback } from 'react';
import { Upload, AlertCircle, FileText, Loader, X, Check } from 'lucide-react';
import FormTemplateService from '../../services/forms/FormTemplateService';

export const FormTemplateUploader = ({ 
  onTemplateLoad, 
  onError,
  maxSize = 10, // in MB
  acceptedFormats = ['.pdf'],
  allowMultiple = false,
  description
}) => {
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFile = useCallback((file) => {
    if (!file) return { valid: false, error: 'No file provided' };

    // Check file type
    const fileType = file.name.toLowerCase().split('.').pop();
    if (!acceptedFormats.some(format => format.includes(fileType))) {
      return { 
        valid: false, 
        error: `Invalid file type. Please upload ${acceptedFormats.join(' or ')} file` 
      };
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return { 
        valid: false, 
        error: `File size exceeds ${maxSize}MB limit` 
      };
    }

    return { valid: true };
  }, [acceptedFormats, maxSize]);

  const processFile = async (file) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      onError(validation.error);
      return;
    }

    try {
      setLoading(true);
      const template = await FormTemplateService.loadFormTemplate(file);
      
      const fileInfo = {
        id: Date.now(),
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'success',
        template
      };

      if (!allowMultiple) {
        setUploadedFiles([fileInfo]);
      } else {
        setUploadedFiles(prev => [...prev, fileInfo]);
      }

      onTemplateLoad({
        file,
        ...template
      });
    } catch (error) {
      onError(error.message);
      setUploadedFiles(prev => [
        ...prev,
        {
          id: Date.now(),
          name: file.name,
          status: 'error',
          error: error.message
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (!files?.length) return;

    if (allowMultiple) {
      await Promise.all([...files].map(processFile));
    } else {
      await processFile(files[0]);
    }
  }, [allowMultiple]);

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files?.length) return;

    if (allowMultiple) {
      await Promise.all([...files].map(processFile));
    } else {
      await processFile(files[0]);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const getFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative p-4 border-2 border-dashed rounded-lg
          transition-colors duration-200
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400'
          }
        `}
      >
        <input
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileChange}
          disabled={loading}
          className="hidden"
          id="template-upload"
          multiple={allowMultiple}
        />
        
        <label
          htmlFor="template-upload"
          className={`
            block text-center p-6 cursor-pointer
            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50/50'}
          `}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader className="w-6 h-6 animate-spin text-blue-500" />
              <span>Loading template...</span>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-blue-600 text-lg mb-2">
                {dragActive 
                  ? 'Drop your file here' 
                  : 'Click or drag file to upload'
                }
              </div>
              {description ? (
                <div className="text-sm text-gray-500">{description}</div>
              ) : (
                <div className="text-sm text-gray-500">
                  Upload a {acceptedFormats.join(' or ')} form template
                  (Max {maxSize}MB)
                </div>
              )}
            </>
          )}
        </label>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map(file => (
            <div 
              key={file.id}
              className={`
                flex items-center justify-between p-3 rounded-lg
                ${file.status === 'error' 
                  ? 'bg-red-50 border border-red-100' 
                  : 'bg-green-50 border border-green-100'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <FileText className={`
                  w-5 h-5
                  ${file.status === 'error' ? 'text-red-500' : 'text-green-500'}
                `} />
                <div>
                  <div className="font-medium">{file.name}</div>
                  {file.status !== 'error' && (
                    <div className="text-sm text-gray-600">
                      {getFileSize(file.size)}
                    </div>
                  )}
                  {file.status === 'error' && (
                    <div className="text-sm text-red-600">
                      {file.error}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {file.status === 'success' ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                  title="Remove file"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};