// src/components/preview/FormPreview.js
import React, { useMemo } from 'react';
import { Document, Page } from 'react-pdf';
import { FormMappingService } from '../../services/forms/FormMappingService';

export const FormPreview = ({ formId, data, scale = 1.0 }) => {
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);

  // Generate form preview on data change
  const pdfUrl = useMemo(() => {
    if (!formId || !data) return null;
    
    try {
      return FormMappingService.generateFormPreview(formId, data);
    } catch (error) {
      console.error('Error generating preview:', error);
      return null;
    }
  }, [formId, data]);

  if (!pdfUrl) return <div>No preview available</div>;

  return (
    <div className="form-preview">
      <div className="form-preview-header">
        <h3>Form Preview</h3>
        <p className="text-sm text-gray-500">
          This is a live preview of how your form will look
        </p>
      </div>
      
      <div className="form-preview-content">
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            setLoading(false);
          }}
          loading={<div className="loading">Loading preview...</div>}
        >
          <Page 
            pageNumber={1} 
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
        
        {numPages > 1 && (
          <div className="text-center text-sm text-gray-500 mt-2">
            Page 1 of {numPages} shown. Complete preview available after submission.
          </div>
        )}
      </div>
    </div>
  );
};