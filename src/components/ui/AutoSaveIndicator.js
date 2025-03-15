// src/components/ui/AutoSaveIndicator.js
import React from 'react';
import { Save, Check, AlertCircle, Loader } from 'lucide-react';

const statusConfig = {
  saving: {
    icon: Loader,
    text: 'Saving...',
    className: 'text-blue-600 bg-blue-50',
    iconClassName: 'animate-spin'
  },
  saved: {
    icon: Check,
    text: 'All changes saved',
    className: 'text-green-600 bg-green-50',
    iconClassName: 'animate-appear'
  },
  error: {
    icon: AlertCircle,
    text: 'Error saving',
    className: 'text-red-600 bg-red-50',
    iconClassName: 'animate-bounce'
  },
  idle: {
    icon: Save,
    text: 'Changes will auto-save',
    className: 'text-gray-600 bg-gray-50',
    iconClassName: ''
  }
};

export const AutoSaveIndicator = ({ status }) => {
  const statusDisplay = statusConfig[status];
  if (!statusDisplay) return null;

  const { icon: Icon, text, className, iconClassName } = statusDisplay;

  return (
    <div 
      className={`
        flex items-center gap-2 text-sm rounded-full px-3 py-1.5
        transition-all duration-200 ease-in-out
        ${className}
      `}
      role="status"
      aria-live="polite"
    >
      <Icon 
        className={`h-4 w-4 ${iconClassName}`} 
        aria-hidden="true"
      />
      <span className="font-medium">{text}</span>
    </div>
  );
};

// Add keyframe animations to your CSS
const styles = `
@keyframes appear {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-appear {
  animation: appear 0.2s ease-out forwards;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default AutoSaveIndicator;
