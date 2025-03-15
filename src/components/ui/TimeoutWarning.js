import React, { useState, useEffect, useCallback } from 'react';
import { Clock, AlertTriangle, RefreshCw, Save } from 'lucide-react';

export const TimeoutWarning = ({ 
  timeoutMinutes = 240,
  warningMinutes = 5,
  onTimeout,
  onExtend,
  onSave,
  className = ''
}) => {
  const [timeRemaining, setTimeRemaining] = useState(timeoutMinutes * 60);
  const [showWarning, setShowWarning] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

  // Format time into a readable format
  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }, []);

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onTimeout?.();
          return 0;
        }

        const newTime = prev - 1;

        // Show warning when time reaches the warning threshold
        if (newTime === warningMinutes * 60) {
          setShowWarning(true);
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeout, warningMinutes]);

  // Handle session extension
  const handleExtend = async () => {
    try {
      setIsExtending(true);
      await onExtend?.();
      setTimeRemaining(timeoutMinutes * 60); // Reset timer
      setShowWarning(false);
    } catch (error) {
      console.error('Failed to extend session:', error);
    } finally {
      setIsExtending(false);
    }
  };

  // Determine the warning level based on time remaining
  const getWarningLevel = () => {
    const minutesLeft = timeRemaining / 60;
    if (minutesLeft <= 1) return 'critical';
    if (minutesLeft <= 3) return 'urgent';
    return 'warning';
  };

  if (!showWarning) return null;

  const warningLevel = getWarningLevel();
  
  // Define styles for different warning levels
  const colors = {
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      button: 'bg-yellow-600 hover:bg-yellow-700',
      progress: 'bg-yellow-500'
    },
    urgent: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-800',
      button: 'bg-orange-600 hover:bg-orange-700',
      progress: 'bg-orange-500'
    },
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      button: 'bg-red-600 hover:bg-red-700',
      progress: 'bg-red-500'
    }
  };

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 animate-slideUp ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div 
        className={`
          relative overflow-hidden
          ${colors[warningLevel].bg} 
          ${colors[warningLevel].border}
          border rounded-lg shadow-lg w-80 sm:w-96
        `}
        aria-labelledby="timeout-warning-title"
        aria-describedby="timeout-warning-description"
      >
        {/* Header */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className={`w-5 h-5 ${colors[warningLevel].text}`} />
            <h4 
              id="timeout-warning-title" 
              className={`font-semibold ${colors[warningLevel].text}`}
            >
              Session Timeout Warning
            </h4>
          </div>

          <p 
            id="timeout-warning-description" 
            className={`text-sm ${colors[warningLevel].text} mb-3`}
          >
            Your session will expire in {formatTime(timeRemaining)}.
            {warningLevel === 'critical' && " All unsaved progress will be lost."}
          </p>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleExtend}
              disabled={isExtending}
              className={`
                flex items-center gap-1 px-3 py-2 rounded
                text-white text-sm font-medium
                transition-colors duration-200
                ${colors[warningLevel].button}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              aria-label="Extend session"
            >
              <RefreshCw className={`w-4 h-4 ${isExtending ? 'animate-spin' : ''}`} />
              {isExtending ? 'Extending...' : 'Extend Session'}
            </button>

            {onSave && (
              <button
                onClick={onSave}
                className="
                  flex items-center gap-1 px-3 py-2 rounded
                  bg-white text-gray-700 text-sm font-medium
                  border border-gray-300 hover:bg-gray-50
                  transition-colors duration-200
                "
                aria-label="Save progress"
              >
                <Save className="w-4 h-4" />
                Save Progress
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-[0.25rem] bg-gray-[100]">
          <div 
            className={`h-full transition-all duration-[1000ms] ${colors[warningLevel].progress}`}
            style={{
              width: `${(timeRemaining / (timeoutMinutes * 60)) * 100}%`
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};

// Add animation styles for slide-up effect
const styles = `
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideUp {
  animation: slideUp .3s ease-out forwards;
}
`;

// Inject styles into the document head dynamically
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
