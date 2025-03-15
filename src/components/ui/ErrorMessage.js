// src/components/ui/ErrorMessage.js
import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export const ErrorMessage = ({ 
  message, 
  dismissible = false,
  onDismiss,
  details,
  actions,
  className = '' 
}) => {
  // Handle different message types (string or error object)
  const errorMessage = message?.message || message;
  
  if (!errorMessage) return null;

  return (
    <div
      role="alert"
      className={`
        relative flex items-start gap-3 p-4 rounded-lg mt-2
        bg-red-50 border border-red-200
        animate-slideIn
        ${className}
      `}
    >
      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
      
      <div className="flex-1">
        <div className="text-red-700 font-medium">
          {errorMessage}
        </div>

        {details && (
          <div className="mt-1 text-sm text-red-600">
            {details}
          </div>
        )}

        {actions && (
          <div className="mt-3 flex gap-3">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="text-sm font-medium text-red-700 hover:text-red-800 underline"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="
            text-red-400 hover:text-red-500
            p-1 rounded-full hover:bg-red-100
            transition-colors
          "
          aria-label="Dismiss error message"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

// Specialized variants
export const ValidationError = ({ field, message }) => (
  <ErrorMessage
    message={`${field}: ${message}`}
    className="bg-red-50/50 border-red-100 text-sm mt-1"
  />
);

export const FormError = ({ errors, onRetry }) => {
  if (!errors || (Array.isArray(errors) ? errors.length === 0 : Object.keys(errors).length === 0)) return null;

  const errorList = Array.isArray(errors) 
    ? errors 
    : Object.entries(errors).map(([field, message]) => `${field}: ${message}`);

  return (
    <ErrorMessage
      message="Please correct the following errors:"
      details={
        <ul className="list-disc ml-5 mt-2 space-y-1">
          {errorList.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      }
      actions={onRetry ? [{ label: 'Try Again', onClick: onRetry }] : undefined}
    />
  );
};

// Add animation keyframes to your CSS
const styles = `
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideIn {
  animation: slideIn 0.2s ease-out forwards;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
