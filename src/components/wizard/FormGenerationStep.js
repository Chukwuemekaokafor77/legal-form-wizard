// src/components/wizard/FormGenerationStep.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert, AlertDescription } from '../ui';
import {
  Loader, FileText, Download, Info,
  AlertCircle, CheckCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import FormTemplateService from '../../services/forms/FormTemplateService';
import TemplateValidationService from '../../services/forms/TemplateValidationService';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

// Template Uploader Component
const TemplateUploader = ({
  formNumber,
  onUpload,
  template,
  isUploading
}) => (
  <div className="mt-2">
    <input
      type="file"
      accept=".pdf"
      onChange={(e) => onUpload(formNumber, e.target.files[0])}
      disabled={isUploading}
      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                 file:rounded-full file:border-0 file:text-sm file:font-semibold
                 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                 disabled:opacity-50 disabled:cursor-not-allowed"
    />
    {template && (
      <div className="flex items-center space-x-2 mt-2">
        <div className="text-sm text-green-600 flex items-center">
          <CheckCircle className="w-4 h-4 mr-1" />
          Template uploaded
        </div>
      </div>
    )}
  </div>
);

// Error Boundary Component
class FormGenerationErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            An error occurred while generating forms. Please try again.
          </AlertDescription>
        </Alert>
      );
    }
    return this.props.children;
  }
}

const FormGenerationStep = ({ answers, courtType, onLearnMore, onFormsGenerated }) => {
  // State management
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requiredForms, setRequiredForms] = useState([]);
  const [generatedForms, setGeneratedForms] = useState([]);
  const [formTemplates, setFormTemplates] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [formStatuses, setFormStatuses] = useState({});
  const [showInstructions, setShowInstructions] = useState(false);

  const isGenerationReady = useMemo(() => {
    return requiredForms.every(form => formTemplates[form.form_number]);
  }, [requiredForms, formTemplates]);

  useEffect(() => {
    const loadRequiredForms = async () => {
      setLoading(true);
      setError(null);
      try {
        const forms = await FormTemplateService.getRequiredForms(answers.caseType, courtType);
        setRequiredForms(forms);
      } catch (err) {
        console.error('Error loading forms:', err);
        setError(`Error loading required forms: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadRequiredForms();
  }, [answers.caseType, courtType]);

  const handleDownload = useCallback(async (form) => {
    try {
      setError(null);
      const formData = generatedForms.find(f => f.formId === form.form_number) || form;
      const fileData = formData.pdf;
      const fileName = `${formData.formId}-${formData.title.replace(/\s+/g, '-')}`;

      const byteString = atob(fileData.split(',')[1]);
      const mimeString = fileData.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      saveAs(blob, fileName + ".pdf");

      setFormStatuses(prev => ({
        ...prev,
        [formData.formId]: {
          ...prev[formData.formId],
          downloadCount: (prev[formData.formId]?.downloadCount || 0) + 1
        }
      }));
    } catch (err) {
      console.error('Download error:', err);
      setError(`Error downloading file: ${err.message}`);
    }
  }, [generatedForms]);

  const handleTemplateUpload = useCallback(async (formNumber, file) => {
    try {
      setIsUploading(true);
      setError(null);
      const template = await FormTemplateService.loadFormTemplate(file);
      const validation = TemplateValidationService.validateTemplate(template, formNumber);

      if (!validation.isValid) {
        setError(`Invalid template: ${validation.errors.join(', ')}`);
        return;
      }

      setFormTemplates(prev => ({
        ...prev,
        [formNumber]: {
          ...template,
          file,
          formNumber
        }
      }));

      setFormStatuses(prev => ({
        ...prev,
        [formNumber]: {
          ...prev[formNumber],
          templateUploaded: true,
          uploadedAt: new Date()
        }
      }));

    } catch (err) {
      console.error('Template upload error:', err);
      setError(`Error loading template for Form ${formNumber}: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleGenerateForms = useCallback(async () => {
    if (!isGenerationReady) return;

    try {
      setGenerating(true);
      setError(null);
      const generated = [];
      const totalSteps = requiredForms.length;

      for (const [index, form] of requiredForms.entries()) {
        setGenerationProgress(((index + 1) / totalSteps) * 100);

        const template = formTemplates[form.form_number];

        if (!template) {
          setError(`Template not loaded for form ${form.form_number}`);
          return;
        }

        const pdfDoc = new jsPDF();
        pdfDoc.text(`Form ${form.form_number}: ${form.title}`, 20, 20);

        const pdfDataUri = pdfDoc.output('datauristring');

        generated.push({
          formId: form.form_number,
          title: form.title,
          pdf: pdfDataUri
        });
      }

      setGeneratedForms(generated);
      onFormsGenerated(generated);

    } catch (err) {
      console.error('Form generation error:', err);
      setError(`Error generating forms: ${err.message}`);
    } finally {
      setGenerating(false);
      setGenerationProgress(0);
    }
  }, [requiredForms, formTemplates, isGenerationReady, onFormsGenerated]);

  const toggleInstructions = () => setShowInstructions(prev => !prev);

  return (
    <FormGenerationErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Court Form Generation</span>
            <button onClick={toggleInstructions} className="text-sm text-blue-600 hover:underline flex items-center">
              <Info className="w-4 h-4 mr-1" />
              Instructions
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div className="text-center"><Loader className="inline-block animate-spin" /> Loading forms...</div>}
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

          {showInstructions && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <h3 className="font-semibold">Instructions:</h3>
              <ul className="list-disc pl-5">
                <li>Upload a PDF template for each required form.</li>
                <li>Click 'Generate Forms' to create pre-filled PDFs.</li>
              </ul>
            </div>
          )}

          {requiredForms.map(form => (
            <div key={form.form_number} className="mb-4">
              <div className="font-semibold">{form.title}</div>
              <TemplateUploader
                formNumber={form.form_number}
                onUpload={handleTemplateUpload}
                template={formTemplates[form.form_number]}
                isUploading={isUploading}
              />

              {formStatuses[form.form_number]?.templateUploaded && (
                <div className="mt-2 text-sm text-gray-500">
                  Uploaded at: {formStatuses[form.form_number]?.uploadedAt?.toLocaleTimeString()}
                </div>
              )}
            </div>
          ))}

          {isGenerationReady && (
            <>
              {generating && (
                <div className="flex items-center justify-center my-4">
                  <Loader className="mr-2 animate-spin" />
                  Generating forms... {generationProgress.toFixed(0)}%
                </div>
              )}
              <button
                onClick={handleGenerateForms}
                disabled={generating}
                className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 disabled:opacity-50"
              >
                <FileText className="w-4 h-4 mr-2 inline-block" />
                Generate Forms
              </button>
            </>
          )}

          {generatedForms.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Generated Forms</h3>
              <ul className="space-y-2">
                {generatedForms.map(form => (
                  <li key={form.formId} className="flex items-center justify-between">
                    <span>{form.title}</span>
                    <div className="space-x-2">
                      <button onClick={() => handleDownload(form)} className="text-blue-600 hover:underline flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-500">
            Having trouble? <button onClick={() => onLearnMore('formGeneration')} className="text-blue-600 hover:underline">Learn More</button>
          </div>
        </CardContent>
      </Card>
    </FormGenerationErrorBoundary>
  );
};

export default FormGenerationStep;
