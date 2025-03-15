// src/components/wizard/Step1.js
import React, { useState, useEffect, useMemo } from 'react';
import { legalTerms } from '../../utils/legalTerms';
import {
  ErrorMessage,
  LegalText,
  LegalTermTooltip,
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '../ui';
import {
  Briefcase,
  AlertCircle,
  Info,
  FileText,
  ChevronRight
} from 'lucide-react';

const LEGAL_CATEGORIES = {
  "Family Law": {
    icon: "👨‍👩‍👧‍👦",
    description: "Family law matters including divorce, custody, and support",
    types: [
      {
        id: "simple_divorce",
        title: "Simple or joint divorce",
        description: "A straightforward divorce process where both parties agree on all terms or there are no other issues to resolve.",
        requiresDocuments: ['marriage_certificate'],
        estimatedTime: 30,
        fields: {
          marriageDate: 'marriageInfo.date',
          marriagePlace: 'marriageInfo.place',
          separationDate: 'marriageInfo.separationDate',
        }
      },
      {
        id: "financial_planning",
        title: "Financial planning for separation",
        description: "Planning for financial independence and division of assets during separation.",
        requiresDocuments: ['financial_statements'],
        estimatedTime: 45
      },
      {
        id: "family_dispute",
        title: "Family dispute resolution options",
        description: "Exploring alternatives to court such as mediation or collaborative family law.",
        estimatedTime: 20
      },
      {
        id: "case_conference",
        title: "Case Conference",
        description: "A meeting with a judge to discuss issues and potential settlement.",
        requiresDocuments: ['case_documents'],
        estimatedTime: 60
      },
      {
        id: "settlement_conference",
        title: "Settlement Conference",
        description: "A focused meeting to try to settle all or some issues in your case.",
        requiresDocuments: ['settlement_documents'],
        estimatedTime: 90
      },
      {
        id: "motion_change",
        title: "Motion to Change",
        description: "Request to change an existing court order or agreement.",
        requiresDocuments: ['existing_order'],
        estimatedTime: 45
      },
      {
        id: "restraining_order",
        title: "Restraining Order",
        description: "Legal protection from harassment or abuse.",
        requiresDocuments: ['evidence_documents'],
        urgent: true,
        estimatedTime: 30
      },
      {
        id: "parenting_plan",
        title: "Parenting Plan",
        description: "Detailed plan for child care and decision-making responsibilities.",
        requiresDocuments: ['child_documents'],
        estimatedTime: 60
      }
    ]
  },
  "Housing Law": {
    icon: "🏠",
    description: "Housing and tenancy related legal issues",
    types: [
      {
        id: "tenant_rights",
        title: "Tenant rights",
        description: "Understanding and enforcing your rights as a tenant.",
        estimatedTime: 30
      },
      {
        id: "landlord_tenant_disputes",
        title: "Landlord-tenant disputes",
        description: "Resolving conflicts between landlords and tenants.",
        requiresDocuments: ['lease_agreement'],
        estimatedTime: 45
      }
    ]
  },
  "Abuse and Violence": {
    icon: "⚠️",
    description: "Legal assistance for domestic abuse and violence cases",
    types: [
      {
        id: "domestic_violence",
        title: "Domestic violence",
        description: "Legal protection and support for domestic violence victims.",
        urgent: true,
        estimatedTime: 30
      },
      {
        id: "restraining_orders",
        title: "Restraining orders",
        description: "Emergency protection orders against abusers.",
        urgent: true,
        estimatedTime: 30
      }
    ]
  }
};

const Step1 = ({ onChange, answers }) => {
  const [legalCategory, setLegalCategory] = useState(answers.legalCategory || "");
  const [caseType, setCaseType] = useState(answers.caseType || "");
  const [errors, setErrors] = useState({});

  const selectedCaseTypeInfo = useMemo(() => {
    if (!legalCategory || !caseType) return null;
    return LEGAL_CATEGORIES[legalCategory].types.find(t => t.id === caseType);
  }, [legalCategory, caseType]);

  const validate = () => {
    const newErrors = {};
    if (!legalCategory) newErrors.category = "Please select a legal category";
    if (!caseType) newErrors.type = "Please select a case type";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setLegalCategory(selectedCategory);
    setCaseType("");
    onChange({ legalCategory: selectedCategory, caseType: "" });
    validate();
  };

  const handleCaseTypeChange = (e) => {
    const selectedCaseType = e.target.value;
    setCaseType(selectedCaseType);
    onChange({ legalCategory, caseType: selectedCaseType });
    validate();
  };

  const renderCaseType = (type) => {
    if (legalTerms[type]) {
      return <LegalTermTooltip term={type} />;
    }
    return <LegalText>{type}</LegalText>;
  };

  useEffect(() => {
    validate();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-500" />
            Legal Category and Case Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <LegalText>
              Select your legal category and case type. Some options like Restraining Order or
              Financial Disclosure may require additional documentation. If you need help with
              Enforcement or a Variation Order, make sure you have your existing court orders ready.
            </LegalText>
          </div>

          <div className="space-y-4">
            {/* Legal Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Legal Category *
              </label>
              <select
                className={`
                  w-full rounded-lg border border-gray-300 bg-white px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${errors.category ? "border-red-500 ring-red-500" : ""}
                `}
                value={legalCategory}
                onChange={handleCategoryChange}
              >
                <option value="">Select a legal category</option>
                {Object.entries(LEGAL_CATEGORIES).map(([category, info]) => (
                  <option key={category} value={category}>
                    {info.icon} {category}
                  </option>
                ))}
              </select>
              {errors.category && <ErrorMessage message={errors.category} />}
            </div>

            {/* Case Type Selection */}
            {legalCategory && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Case Type *
                </label>
                <select
                  className={`
                    w-full rounded-lg border border-gray-300 bg-white px-3 py-2
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    ${errors.type ? "border-red-500 ring-red-500" : ""}
                  `}
                  value={caseType}
                  onChange={handleCaseTypeChange}
                >
                  <option value="">Select a case type</option>
                  {LEGAL_CATEGORIES[legalCategory].types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.urgent ? "🚨 " : ""}{type.title}
                    </option>
                  ))}
                </select>
                {errors.type && <ErrorMessage message={errors.type} />}
              </div>
            )}

            {/* Case Type Details */}
            {selectedCaseTypeInfo && (
              <Card className="bg-blue-50 border-blue-100">
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h3 className="font-medium">
                        {renderCaseType(selectedCaseTypeInfo.title)}
                        {selectedCaseTypeInfo.urgent && (
                          <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                            Urgent
                          </span>
                        )}
                      </h3>
                      <LegalText className="text-gray-600 mt-1">
                        {selectedCaseTypeInfo.description}
                      </LegalText>
                    </div>
                  </div>

                  {/* Required Documents */}
                  {selectedCaseTypeInfo.requiresDocuments && (
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-blue-500 mt-1" />
                      <div>
                        <h4 className="font-medium">Required Documents</h4>
                        <ul className="mt-1 space-y-1">
                          {selectedCaseTypeInfo.requiresDocuments.map(doc => (
                            <li key={doc} className="text-sm text-gray-600 flex items-center gap-1">
                              <ChevronRight className="w-4 h-4" />
                              {doc.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Estimated Time */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                    <Info className="w-4 h-4" />
                    Estimated time: {selectedCaseTypeInfo.estimatedTime} minutes
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Step1;
