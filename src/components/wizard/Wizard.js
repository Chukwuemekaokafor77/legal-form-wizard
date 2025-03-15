// src/components/wizard/Wizard.js
import React, { useState } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4'; // Import new step
import Step5 from './Step5'; // Import review step
import Step6 from './Step6'; // Import confirmation step
import StepWrapper from './StepWrapper';
import { Button } from '../ui';

const Wizard = () => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const totalSteps = 6; // Update total steps

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleChange = (newAnswers) => {
    setAnswers(prev => ({ ...prev, ...newAnswers }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 onChange={handleChange} answers={answers} />;
      case 2:
        return <Step2 onChange={handleChange} answers={answers} />;
      case 3:
        return <Step3 onChange={handleChange} answers={answers} />;
      case 4:
        return <Step4 onChange={handleChange} answers={answers} />; // New step
      case 5:
        return <Step5 answers={answers} />; // Review step
      case 6:
        return <Step6 answers={answers} />; // Confirmation step
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <StepWrapper step={step} totalSteps={totalSteps}>
      {renderStep()}

      <div className="mt-6 flex justify-between">
        <Button onClick={prevStep} disabled={step === 1}>
          Previous
        </Button>
        <Button onClick={nextStep} disabled={step === totalSteps}>
          Next
        </Button>
      </div>
    </StepWrapper>
  );
};

export default Wizard;
