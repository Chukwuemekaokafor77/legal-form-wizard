// src/components/wizard/Step5.js
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { 
  User, 
  FileText, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  Edit
} from 'lucide-react';

const InfoSection = ({ title, icon: Icon, data, onEdit }) => {
  if (!data || Object.keys(data).length === 0) return null;
  
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-blue-500" />}
          {title}
        </CardTitle>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
          {Object.entries(data).map(([key, value]) => {
            // Skip empty values and objects/arrays
            if (!value || typeof value === 'object') return null;
            
            return (
              <div key={key} className="flex flex-col">
                <span className="text-sm text-gray-500">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <span className="font-medium">{value.toString()}</span>
              </div>
            );
          })}
          
          {/* Handle nested objects */}
          {Object.entries(data).map(([key, value]) => {
            if (typeof value !== 'object' || !value || Array.isArray(value)) return null;
            
            return (
              <div key={key} className="col-span-2 mt-2 border-t pt-2">
                <h4 className="font-medium mb-2">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 pl-2">
                  {Object.entries(value).map(([subKey, subValue]) => {
                    if (!subValue) return null;
                    
                    return (
                      <div key={subKey} className="flex flex-col">
                        <span className="text-sm text-gray-500">
                          {subKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className="font-medium">{subValue.toString()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const DocumentSummary = ({ documents }) => {
  if (!documents || Object.keys(documents).length === 0) return null;
  
  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          Uploaded Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(documents).map(([docId, doc]) => (
            <div key={docId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div>
                <div className="font-medium">{doc.name || docId}</div>
                <div className="text-sm text-gray-500">
                  {doc.size ? formatFileSize(doc.size) : ''}
                  {doc.uploadedAt ? ` • Uploaded ${new Date(doc.uploadedAt).toLocaleString()}` : ''}
                </div>
              </div>
              <div className="text-green-600 text-sm font-medium">Verified</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const Step5 = ({ answers, onLearnMore }) => {
  // Navigate to previous wizard steps to edit
  const handleEditSection = (section) => {
    // This would typically navigate to specific steps
    // For now, just log the section
    console.log(`Edit ${section} section`);
    
    // Navigation would be implemented with react-router or a step management system
    // window.location.hash = `#${section}`;
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Review Your Information</h2>
      
      <InfoSection
        title="Personal Information"
        icon={User}
        data={answers.personalInfo}
        onEdit={() => handleEditSection('personal-info')}
      />
      
      <InfoSection
        title="Case Information"
        icon={Briefcase}
        data={{
          province: answers.province,
          legalCategory: answers.legalCategory,
          caseType: answers.caseType,
          caseDescription: answers.caseDescription
        }}
        onEdit={() => handleEditSection('case-information')}
      />
      
      {answers.marriageInfo && (
        <InfoSection
          title="Marriage Information"
          icon={Calendar}
          data={answers.marriageInfo}
          onEdit={() => handleEditSection('marriage-info')}
        />
      )}
      
      <DocumentSummary documents={answers.uploadedDocuments} />
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="font-medium mb-2">Important:</div>
        <p className="text-sm text-gray-700">
          Please carefully review all information above. Once you proceed to the next step, 
          this information will be used to generate your legal forms. Make sure everything 
          is accurate and complete.
        </p>
        <button
          onClick={() => onLearnMore?.('review-information')}
          className="text-sm text-blue-600 hover:text-blue-800 mt-2"
        >
          Learn more about court form requirements
        </button>
      </div>
    </div>
  );
};

export default Step5;