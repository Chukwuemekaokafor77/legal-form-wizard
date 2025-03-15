// src/components/wizard/Step6.js
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { 
  CheckCircle, 
  ClipboardCheck, 
  Info, 
  AlertCircle,
  Lock
} from 'lucide-react';

const Step6 = ({ answers, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [confirmed, setConfirmed] = useState({
    accuracy: false,
    legalImplications: false,
    privacyConsent: false
  });

  // Check if all confirmation checkboxes are checked
  const isReadyToSubmit = Object.values(confirmed).every(Boolean);

  const handleSubmit = async () => {
    if (!isReadyToSubmit) {
      setError('Please confirm all statements before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit();
    } catch (err) {
      console.error('Error submitting forms:', err);
      setError('Failed to submit forms. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmChange = (key) => {
    setConfirmed(prev => ({
      ...prev,
      [key]: !prev[key]
    }));

    // Clear error when user checks a checkbox
    if (error) {
      setError(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-blue-500" />
            Final Confirmation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-700">Almost Done!</h3>
                  <p className="text-sm text-blue-600 mt-1">
                    Please review and confirm the following statements before submitting your forms.
                    This ensures your documents are accurate and you understand their legal implications.
                  </p>
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-700">Error</h3>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation checklist */}
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={confirmed.accuracy}
                    onChange={() => handleConfirmChange('accuracy')}
                  />
                  <div>
                    <div className="font-medium">Accuracy Confirmation</div>
                    <p className="text-sm text-gray-600 mt-1">
                      I confirm that all information provided is complete, accurate, and true to the best of my knowledge.
                      I understand that providing false information may constitute perjury.
                    </p>
                  </div>
                </label>
              </div>

              <div className="p-4 border rounded-lg">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={confirmed.legalImplications}
                    onChange={() => handleConfirmChange('legalImplications')}
                  />
                  <div>
                    <div className="font-medium">Legal Implications Acknowledgment</div>
                    <p className="text-sm text-gray-600 mt-1">
                      I understand that the documents generated will have legal implications and may affect my legal rights
                      and obligations. I acknowledge that this service does not provide legal advice and I may wish to
                      consult with a qualified legal professional before proceeding.
                    </p>
                  </div>
                </label>
              </div>

              <div className="p-4 border rounded-lg">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={confirmed.privacyConsent}
                    onChange={() => handleConfirmChange('privacyConsent')}
                  />
                  <div>
                    <div className="font-medium">Privacy Consent</div>
                    <p className="text-sm text-gray-600 mt-1">
                      I consent to the processing of my personal information for the purpose of generating legal forms.
                      I understand that my information will be handled in accordance with the Privacy Policy.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Security note */}
            <div className="flex items-start gap-2 text-sm text-gray-600 mt-4 p-3 bg-gray-50 rounded-lg">
              <Lock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <p>
                Your information is protected with industry-standard encryption and security practices.
                We do not share your data with third parties without your explicit consent.
              </p>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={!isReadyToSubmit || isSubmitting}
              className={`
                w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg 
                ${isReadyToSubmit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}
                text-white font-medium transition-colors
              `}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Submit Forms
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step6;