// src/components/wizard/ReviewStep.js
import React, { useState, useEffect, useMemo } from 'react';
import {
  Alert,
  AlertDescription,
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '../ui';
import {
  User,
  FileText,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const documentRequirements = {
  immigration: ['Passport', 'Visa Application'],
  criminal: ['Police Report', 'Court Summons'],
  family: ['Birth Certificate', 'Marriage License'],
  corporate: ['Articles of Incorporation', 'Board Resolution']
};

const validateRequiredDocuments = (legalCategory, uploadedDocuments = []) => {
  const required = documentRequirements[legalCategory] || [];
  const uploaded = uploadedDocuments.map(doc => doc.name);
  return required.filter(doc => !uploaded.includes(doc));
};

const InfoItem = ({ label, value, icon: Icon }) => (
  <div className="flex items-start gap-3">
    {Icon && <Icon className="w-5 h-5 text-gray-400 mt-1" />}
    <div>
      <label className="text-sm text-gray-600 block">{label}</label>
      <div className="font-medium">{value || 'Not provided'}</div>
    </div>
  </div>
);

const FormPreview = ({ form, onEdit, answers }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const mappedData = useMemo(() => {
    return Object.entries(form).reduce((acc, [key, value]) => {
      const path = form[key];
      const answerValue = path?.split('.').reduce((obj, key) => obj?.[key], answers);
      acc[key] = answerValue || 'Not provided';
      return acc;
    }, {});
  }, [form, answers]);

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          <h4 className="font-medium">Form {form.form_number}: {form.title}</h4>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(form.form_number)}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 bg-white">
          <div className="space-y-2">
            {Object.entries(mappedData).map(([field, value]) => (
              <div key={field} className="grid grid-cols-2 gap-4 text-sm border-b py-2 last:border-0">
                <div className="text-gray-600 font-medium">
                  {field.replace(/([A-Z])/g, ' $1').trim()}:
                </div>
                <div>{value || 'Not provided'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ReviewStep = ({
  answers,
  onSubmit,
  isLoading,
  onEdit,
  onValidationError,
  forms
}) => {
  const [error, setError] = useState("");

  const validationStatus = useMemo(() => {
    const required = {
      personal: {
        fields: ['fullName', 'dateOfBirth', 'contact.email', 'contact.phone'],
        label: 'Personal Information'
      },
      case: {
        fields: ['province', 'legalCategory', 'caseType'],
        label: 'Case Information'
      }
    };

    return Object.entries(required).reduce((acc, [key, config]) => {
      const isValid = config.fields.every(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], answers);
        return value && value.trim();
      });

      return {
        ...acc,
        [key]: {
          isValid,
          missingFields: isValid ? [] : config.fields.filter(field => {
            const value = field.split('.').reduce((obj, key) => obj?.[key], answers);
            return !value || !value.trim();
          }),
          label: config.label
        }
      };
    }, {});
  }, [answers]);

  const validate = () => {
    // Validate form fields
    const isFieldValid = Object.values(validationStatus).every(status => status.isValid);
    if (!isFieldValid) {
      const fieldErrors = Object.entries(validationStatus)
        .filter(([_, status]) => !status.isValid)
        .map(([_, status]) => `${status.label} is incomplete`);
      
      setError(fieldErrors.join(', '));
      onValidationError?.(fieldErrors);
      return false;
    }

    // Validate documents
    const missingDocs = validateRequiredDocuments(answers.legalCategory, answers.uploadedDocuments);
    if (missingDocs.length > 0) {
      const docError = `Missing required documents: ${missingDocs.join(', ')}`;
      setError(docError);
      onValidationError?.([docError]);
      return false;
    }

    return true;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Review Your Information</h2>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <Clock className="w-4 h-4" />
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="w-5 h-5" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Personal Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            Personal Information
            {validationStatus.personal.isValid ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </CardTitle>
          {onEdit && (
            <button
              onClick={() => onEdit('personal')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem
              label="Full Name"
              value={answers.personalInfo?.fullName}
              icon={User}
            />
            <InfoItem
              label="Date of Birth"
              value={answers.personalInfo?.dateOfBirth}
              icon={Calendar}
            />
            <InfoItem
              label="Email"
              value={answers.personalInfo?.contact?.email}
              icon={Mail}
            />
            <InfoItem
              label="Phone"
              value={answers.personalInfo?.contact?.phone}
              icon={Phone}
            />
          </div>
        </CardContent>
      </Card>

      {/* Case Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-500" />
            Case Information
            {validationStatus.case.isValid ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </CardTitle>
          {onEdit && (
            <button
              onClick={() => onEdit('case')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem
              label="Province"
              value={answers.province}
              icon={MapPin}
            />
            <InfoItem
              label="Legal Category"
              value={answers.legalCategory}
              icon={Briefcase}
            />
            <InfoItem
              label="Case Type"
              value={answers.caseType}
              icon={FileText}
            />
          </div>
        </CardContent>
      </Card>

      {/* Required Forms Preview */}
      {forms?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Required Forms ({forms.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {forms.map((form) => (
                <FormPreview
                  key={form.form_number}
                  form={form}
                  onEdit={onEdit}
                  answers={answers} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <button
        onClick={() => {
          if (validate()) {
            onSubmit();
          }
        }}
        disabled={isLoading || !Object.values(validationStatus).every(status => status.isValid)}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            Generating Forms...
          </>
        ) : (
          <>
            <FileText className="w-5 h-5" />
            Generate Forms
          </>
        )}
      </button>
    </div>
  );
};

export default ReviewStep;