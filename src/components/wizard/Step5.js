// src/components/wizard/Step5.js (Review & Edit)
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui';
import { CheckCircle, AlertCircle } from 'lucide-react';

const ReviewItem = ({ label, value }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-b py-2 last:border-0">
    <div className="text-gray-600 font-medium">{label}:</div>
    <div>{value || 'Not provided'}</div>
  </div>
);

const Step5 = ({ answers, prevStep, nextStep }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review and Edit Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <ReviewItem label="Full Name" value={answers.personalInfo?.fullName} />
          <ReviewItem label="Date of Birth" value={answers.personalInfo?.dateOfBirth} />
          <ReviewItem label="Email" value={answers.personalInfo?.contact?.email} />
          <ReviewItem label="Phone" value={answers.personalInfo?.contact?.phone} />

          <h3 className="text-lg font-semibold mt-4">Case Information</h3>
          <ReviewItem label="Province" value={answers.province} />
          <ReviewItem label="Legal Category" value={answers.legalCategory} />
          <ReviewItem label="Case Type" value={answers.caseType} />
          <ReviewItem label="Case Description" value={answers.caseDescription} />

          <h3 className="text-lg font-semibold mt-4">Uploaded Documents</h3>
          {Object.entries(answers.uploadedDocuments || {}).map(([docId, file]) => (
            <div key={docId} className="text-sm">
              {docId}: {file.name}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button onClick={prevStep} variant="secondary">
          Previous
        </Button>
        <Button onClick={nextStep}>Confirm and Continue</Button>
      </div>
    </div>
  );
};

export default Step5;
