// src/components/wizard/Step3.js
import React, { useState, useEffect, useMemo } from 'react';
import { ErrorMessage } from '../ui';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import {
  FileText,
  AlertCircle,
  HelpCircle,
  CheckCircle,
  Calendar,
  Clock
} from 'lucide-react';

const Step3 = ({ onChange, answers }) => {
  const [caseDescription, setCaseDescription] = useState(answers.caseDescription || "");
  const [error, setError] = useState("");
  const [showGuidelines, setShowGuidelines] = useState(false);
  const characterLimit = 1000;
  const minCharacters = 50;

  const charCount = useMemo(() => caseDescription.length, [caseDescription]);
  const isValidLength = charCount === 0 || (charCount >= minCharacters && charCount <= characterLimit);

  const validate = () => {
    let isValid = true;
    if (caseDescription && (charCount < minCharacters || charCount > characterLimit)) {
      setError(`Description must be between ${minCharacters} and ${characterLimit} characters if provided`);
      isValid = false;
    } else {
      setError("");
    }
    return isValid;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setCaseDescription(value);
    const isValid = validate();
    onChange({ caseDescription: value, isValid: isValid }); // Callback with validity
  };

  useEffect(() => {
    const isValid = validate();
    onChange({ caseDescription: caseDescription, isValid: isValid }); // Initial validity
  }, []);

  // Calculate progress color
  const getProgressColor = () => {
    if (charCount === 0) return 'bg-gray-200';
    if (charCount < minCharacters) return 'bg-red-500';
    if (charCount > characterLimit) return 'bg-red-500';
    if (charCount > characterLimit * 0.9) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const guidelines = [
    "Focus on relevant facts and timeline",
    "Include important dates and events",
    "Mention any previous legal actions",
    "State your desired outcome",
    "Avoid emotional language",
    "Be clear and concise"
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Case Description
            </div>
            <button
              onClick={() => setShowGuidelines(!showGuidelines)}
              className="text-gray-500 hover:text-gray-700"
              title="Writing Guidelines"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showGuidelines && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                Writing Guidelines
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                {guidelines.map((guideline, index) => (
                  <li key={index}>{guideline}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brief description of your case (optional):
              </label>
              <textarea
                className={`
                  w-full h-48 rounded-lg border border-gray-300 p-3
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${error ? "border-red-500 ring-red-500" : ""}
                `}
                value={caseDescription}
                onChange={handleChange}
                placeholder="Please provide a brief description of your case..."
              />
            </div>

            {/* Character Count and Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className={`font-medium ${isValidLength ? 'text-gray-600' : 'text-red-600'}`}>
                    {charCount} / {characterLimit} characters
                  </span>
                </div>
                {charCount > 0 && (
                  <span className={`
                    text-xs px-2 py-0.5 rounded-full
                    ${charCount < minCharacters ? 'bg-red-100 text-red-600' :
                      charCount > characterLimit ? 'bg-red-100 text-red-600' :
                        'bg-green-100 text-green-600'}
                  `}>
                    {charCount < minCharacters ? `${minCharacters - charCount} more needed` :
                      charCount > characterLimit ? `${charCount - characterLimit} over limit` :
                        'Valid length'}
                  </span>
                )}
              </div>

              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getProgressColor()}`}
                  style={{
                    width: `${Math.min((charCount / characterLimit) * 100, 100)}%`
                  }}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Writing Tips */}
            <div className="text-sm text-gray-500 space-y-1">
              <p className="font-medium">Tips:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Be specific about dates and events</li>
                <li>Include relevant details only</li>
                <li>Double-check all information</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step3;
