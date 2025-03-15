// src/components/ui/Alert.js
import React from 'react';
import { AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';

export const Alert = ({
  children,
  variant = 'default',
  className = '',
  icon: CustomIcon,
  onClose,
  title,
}) => {
  const variants = {
    default: {
      containerStyles: 'bg-gray-100 border-gray-400 text-gray-700',
      icon: Info,
    },
    info: {
      containerStyles: 'bg-blue-50 border-blue-400 text-blue-700',
      icon: Info,
    },
    success: {
      containerStyles: 'bg-green-50 border-green-400 text-green-700',
      icon: CheckCircle,
    },
    warning: {
      containerStyles: 'bg-yellow-50 border-yellow-400 text-yellow-700',
      icon: AlertCircle,
    },
    destructive: {
      containerStyles: 'bg-red-50 border-red-400 text-red-700',
      icon: XCircle,
    },
  };

  const { containerStyles, icon: DefaultIcon } = variants[variant] || variants.default;
  const Icon = CustomIcon || DefaultIcon;

  return (
    <div
      role="alert"
      aria-live={variant === 'destructive' ? 'assertive' : 'polite'}
      className={`
        relative flex items-start gap-3 border-l-4 p-4 rounded-md shadow-sm 
        ${containerStyles} 
        ${className}
      `}
    >
      {Icon && <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />}
      <div className="flex-1">
        {title && <AlertTitle>{title}</AlertTitle>}
        {children}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-current opacity-70 hover:opacity-100"
          aria-label="Close alert"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export const AlertDescription = ({ children, className = '' }) => {
  return (
    <div className={`text-sm leading-relaxed ${className}`}>
      {children}
    </div>
  );
};

export const AlertTitle = ({ children, className = '' }) => {
  return (
    <h5 className={`font-medium mb-1 text-base ${className}`}>
      {children}
    </h5>
  );
};
