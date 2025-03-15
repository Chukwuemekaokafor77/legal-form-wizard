// src/components/wizard/Step6.js (New)
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { CheckCircle } from 'lucide-react';

const Step6 = ({ answers, onSubmit }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Confirmation and Submission
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Please confirm that all the information provided is accurate and the documents uploaded are valid.
          </p>
          <p>
            By clicking "Submit", you acknowledge that you have reviewed all details and are ready to proceed.
          </p>

          <Button onClick={onSubmit}>Submit</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step6;
