import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Loader2 } from 'lucide-react';
import { generateCourtForms } from '../../forms/generators/nb-form-generator'; // Import form generation
import { saveAs } from 'file-saver'; // Import file-saver for downloads

const FormGenerationStep = ({ answers }) => {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [generatedForms, setGeneratedForms] = useState([]);

  // useEffect to clear generated forms on answer changes
  useEffect(() => {
    setGeneratedForms([]);
  }, [answers]);

  const handleGenerateForms = async () => {
    setGenerating(true);
    setError(null);

    try {
      // Determine circumstances based on answers
      const circumstances = {
        hasChildren: answers.childrenInfo && answers.childrenInfo.length > 0,
        hasFinancialClaims: answers.reliefSought?.includes('support') || answers.reliefSought?.includes('property'),
        isJointApplication: answers.caseType === 'Simple or joint divorce' && answers.isJointApplication,
      };

      // Generate the forms
      const forms = await generateCourtForms(answers, circumstances);
      setGeneratedForms(forms);

      // Download each form
      forms.forEach(form => {
        const { formId, title, pdf } = form;
        const filename = `NB-Form-${formId}-${title.replace(/\s+/g, '-')}.pdf`;

        // Convert data URI to Blob
        const byteString = atob(pdf.split(',')[1]);
        const mimeString = pdf.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });

        // Use file-saver to download the blob
        saveAs(blob, filename);
      });
    } catch (err) {
      setError('Error generating forms. Please try again or contact support.');
      console.error('Form generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="card">
      <h2>Generate Court Forms</h2>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Required Forms</h3>
        <p className="mb-4">Based on your responses, the following forms will be generated:</p>
        <ul className="list-disc pl-5 space-y-2">
          {answers.caseType === 'Simple or joint divorce' && (
            <>
              <li>Form 72B: Petition for Divorce</li>
              {answers.childrenInfo?.length > 0 && <li>Form 72J: Financial Statement</li>}
              {!answers.isJointApplication && <li>Form 72U: Affidavit of Service</li>}
            </>
          )}
          {answers.caseType === 'Separation with other issues' && (
            <>
              <li>Form 72A: Notice of Action with Statement of Claim</li>
              {answers.reliefSought?.includes('support') && <li>Form 72J: Financial Statement</li>}
              <li>Form 72U: Affidavit of Service</li>
            </>
          )}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Important Information</h3>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <ul className="list-disc pl-4 space-y-2">
            <li>Forms will be pre-filled with the information you provided</li>
            <li>Review all forms carefully before filing with the court</li>
            <li>Some forms may require notarization or commissioning</li>
            <li>Make copies of all forms for your records</li>
            <li>Court filing fees may apply</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleGenerateForms}
          disabled={generating}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
        >
          {generating ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Generating Forms...
            </>
          ) : (
            'Generate Court Forms'
          )}
        </button>

        {generatedForms.length > 0 && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <p className="font-semibold text-green-700">Forms have been generated successfully!</p>
            <p className="text-green-600 mt-2">The following forms have been downloaded:</p>
            <ul className="list-disc pl-4 mt-2">
              {generatedForms.map(form => (
                <li key={form.formId} className="text-green-600">
                  Form {form.formId}: {form.title}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-sm text-gray-500 mt-4">
          For assistance with filing these forms, contact the court registry at your local courthouse
          or consult with a legal professional.
        </div>
      </div>
    </div>
  );
};

export default FormGenerationStep;
