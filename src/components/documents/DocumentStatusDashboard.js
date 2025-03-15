// src/components/documents/DocumentStatusDashboard.js
import React, { useMemo } from 'react';
import { CheckCircle, AlertCircle, Clock, HelpCircle, Download } from 'lucide-react';
import { pathwayRequirements } from '../../data/pathwayRequirements';

export const DocumentStatusDashboard = ({ 
  legalCategory,
  uploadedDocuments = [],
  onUploadRequest,
  onViewDocument,
  onHelpRequest
}) => {
  const requiredDocuments = useMemo(() => {
    const pathway = pathwayRequirements[legalCategory];
    if (!pathway) return [];
    return pathway.requiredDocuments || [];
  }, [legalCategory]);
  
  const documentStatus = useMemo(() => {
    const statusMap = {};
    
    // Initialize all required documents
    requiredDocuments.forEach(doc => {
      statusMap[doc.id] = {
        id: doc.id,
        name: doc.name,
        description: doc.description,
        status: 'missing', // missing, pending, verified, rejected
        optional: doc.optional || false,
        uploadedAt: null,
        verifiedAt: null,
        rejectionReason: null,
        document: null
      };
    });
    
    // Update with uploaded documents
    uploadedDocuments.forEach(doc => {
      if (statusMap[doc.type]) {
        statusMap[doc.type] = {
          ...statusMap[doc.type],
          status: doc.verified ? 'verified' : doc.rejected ? 'rejected' : 'pending',
          uploadedAt: doc.uploadedAt,
          verifiedAt: doc.verifiedAt,
          rejectionReason: doc.rejectionReason,
          document: doc
        };
      }
    });
    
    return statusMap;
  }, [requiredDocuments, uploadedDocuments]);
  
  const statusCounts = useMemo(() => {
    return Object.values(documentStatus).reduce((counts, doc) => {
      if (doc.optional) {
        counts.optional += 1;
        
        if (doc.status === 'verified') {
          counts.optionalUploaded += 1;
        }
      } else {
        counts.required += 1;
        
        if (doc.status === 'verified') {
          counts.requiredUploaded += 1;
        } else if (doc.status === 'pending') {
          counts.pending += 1;
        } else if (doc.status === 'rejected') {
          counts.rejected += 1;
        }
      }
      
      return counts;
    }, { 
      required: 0, 
      optional: 0, 
      requiredUploaded: 0, 
      optionalUploaded: 0,
      pending: 0,
      rejected: 0
    });
  }, [documentStatus]);
  
  const getProgressPercentage = () => {
    if (statusCounts.required === 0) return 100;
    return Math.round((statusCounts.requiredUploaded / statusCounts.required) * 100);
  };
  
  const getDocumentIcon = (doc) => {
    switch (doc.status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };
  
  return (
    <div className="document-status-dashboard p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Document Status</h3>
        
        <div className="text-sm">
          <span className="font-medium">{statusCounts.requiredUploaded} of {statusCounts.required}</span> required documents uploaded
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mb-4">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getProgressPercentage() < 100 ? 'bg-blue-500' : 'bg-green-500'}`}
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>
      
      {/* Status summary */}
      <div className="grid grid-cols-4 gap-2 mb-4 text-center text-sm">
        <div className="bg-green-50 p-2 rounded">
          <div className="font-medium">{statusCounts.requiredUploaded}</div>
          <div className="text-gray-600">Verified</div>
        </div>
        <div className="bg-yellow-50 p-2 rounded">
          <div className="font-medium">{statusCounts.pending}</div>
          <div className="text-gray-600">Pending</div>
        </div>
        <div className="bg-red-50 p-2 rounded">
          <div className="font-medium">{statusCounts.rejected}</div>
          <div className="text-gray-600">Rejected</div>
        </div>
        <div className="bg-blue-50 p-2 rounded">
          <div className="font-medium">{statusCounts.optionalUploaded} / {statusCounts.optional}</div>
          <div className="text-gray-600">Optional</div>
        </div>
      </div>
      
      {/* Document list */}
      <div className="space-y-2">
        {Object.values(documentStatus).map(doc => (
          <div 
            key={doc.id} 
            className={`
              flex items-start gap-3 p-3 rounded-lg
              ${doc.status === 'verified' ? 'bg-green-50' :
                doc.status === 'pending' ? 'bg-yellow-50' :
                doc.status === 'rejected' ? 'bg-red-50' : 'bg-gray-50'}
            `}
          >
            {getDocumentIcon(doc)}
            
            <div className="flex-grow">
              <div className="font-medium flex items-center gap-2">
                {doc.name}
                {doc.optional && (
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                    Optional
                  </span>
                )}
              </div>
              
              <div className="text-sm text-gray-600 mt-1">
                {doc.description}
              </div>
              
              {doc.status === 'rejected' && (
                <div className="text-sm text-red-600 mt-1">
                  Reason: {doc.rejectionReason}
                </div>
              )}
              
              {doc.status === 'pending' && (
                <div className="text-sm text-yellow-600 mt-1">
                  Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                </div>
              )}
            </div>
            
            <div className="flex-shrink-0">
              {doc.status === 'missing' ? (
                <button
                  onClick={() => onUploadRequest(doc.id)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Upload
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => onViewDocument(doc.document)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onUploadRequest(doc.id)}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Replace
                  </button>
                </div>
              )}
              
              <button
                onClick={() => onHelpRequest(doc.id)}
                className="mt-1 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Help</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 