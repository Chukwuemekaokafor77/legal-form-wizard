// src/components/ui/SaveProgressButton.js
import React, { useState, useEffect } from 'react';
import { Save, Check, AlertCircle, Loader } from 'lucide-react';

export const SaveProgressButton = ({ 
  onSave, 
  saving = false,
  lastSaved,
  variant = 'primary',
  size = 'default',
  showTimestamp = true,
  className = ''
}) => {
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let timer;
    if (saveStatus === 'success' || saveStatus === 'error') {
      timer = setTimeout(() => {
        setSaveStatus('idle');
        setErrorMessage('');
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [saveStatus]);

  const handleSave = async () => {
    try {
      setSaveStatus('saving');
      await onSave();
      setSaveStatus('success');
    } catch (error) {
      setSaveStatus('error');
      setErrorMessage(error.message || 'Failed to save progress');
    }
  };

  const formatLastSaved = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return `Last saved ${date.toLocaleTimeString()}`;
  };

  const variants = {
    primary: {
      base: 'bg-blue-600 text-white hover:bg-blue-700',
      disabled: 'bg-blue-300'
    },
    secondary: {
      base: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      disabled: 'bg-gray-50'
    },
    outline: {
      base: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
      disabled: 'border-blue-300 text-blue-300'
    }
  };

  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    default: 'px-4 py-2',
    large: 'px-6 py-3 text-lg'
  };

  const getStatusStyles = () => {
    switch (saveStatus) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      case 'error':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return variants[variant].base;
    }
  };

  return (
    <div className="inline-flex flex-col items-end">
      <button
        onClick={handleSave}
        disabled={saving || saveStatus === 'saving'}
        className={`
          flex items-center justify-center gap-2
          rounded font-medium transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          disabled:cursor-not-allowed
          ${sizes[size]}
          ${saving || saveStatus === 'saving' ? variants[variant].disabled : getStatusStyles()}
          ${className}
        `}
        aria-live="polite"
        aria-busy={saving || saveStatus === 'saving'}
      >
        {saving || saveStatus === 'saving' ? (
          <>
            <Loader className="w-4 h-4 animate-spin" aria-hidden="true" />
            <span>Saving...</span>
          </>
        ) : saveStatus === 'success' ? (
          <>
            <Check className="w-4 h-4" aria-hidden="true" />
            <span>Saved!</span>
          </>
        ) : saveStatus === 'error' ? (
          <>
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
            <span>Retry</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4" aria-hidden="true" />
            <span>Save Progress</span>
          </>
        )}
      </button>

      {showTimestamp && (lastSaved || saveStatus === 'success') && (
        <span className="text-xs text-gray-500 mt-1" aria-live="polite">
          {formatLastSaved(lastSaved)}
        </span>
      )}

      {saveStatus === 'error' && errorMessage && (
        <div 
          className="mt-2 text-sm text-red-600 flex items-center gap-1" 
          role="alert"
        >
          <AlertCircle className="w-4 h-4" aria-hidden="true" />
          {errorMessage}
        </div>
      )}
    </div>
  );
};
