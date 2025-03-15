// src/components/ui/GuestUserBanner.js
import React, { useState, useEffect } from 'react';
import { Timer, UserPlus, AlertTriangle, X } from 'lucide-react';

export const GuestUserBanner = ({ 
  timeRemaining,
  onCreateAccount,
  onDismiss,
  showWarningAt = 300000 // 5 minutes in milliseconds
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showUrgent, setShowUrgent] = useState(false);

  const formatTime = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    };
  };

  useEffect(() => {
    if (timeRemaining <= showWarningAt) {
      setShowUrgent(true);
      setIsDismissed(false);
    }
  }, [timeRemaining, showWarningAt]);

  if (isDismissed && !showUrgent) return null;

  const time = formatTime(timeRemaining);
  const isTimeRunningLow = timeRemaining <= showWarningAt;

  return (
    <div className={`
      relative border rounded-lg p-4 mb-6 animate-slideIn
      ${isTimeRunningLow 
        ? 'bg-red-50 border-red-200' 
        : 'bg-blue-50 border-blue-200'
      }
    `}>
      {/* Time Display */}
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {isTimeRunningLow ? (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          ) : (
            <Timer className="w-5 h-5 text-blue-500" />
          )}
        </div>

        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h3 className={`
              font-medium
              ${isTimeRunningLow ? 'text-red-700' : 'text-blue-700'}
            `}>
              Guest Session
            </h3>
            <div className={`
              inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
              ${isTimeRunningLow 
                ? 'bg-red-100 text-red-800' 
                : 'bg-blue-100 text-blue-800'
              }
            `}>
              Time Remaining: {time.hours}:{time.minutes}:{time.seconds}
            </div>
          </div>

          <p className={`
            text-sm mb-3
            ${isTimeRunningLow ? 'text-red-600' : 'text-blue-600'}
          `}>
            {isTimeRunningLow
              ? "Your session is about to expire. Create an account now to save your progress."
              : "You are using the application as a guest. Create an account to save your progress and access all features."}
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={onCreateAccount}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                transition-colors duration-200
                ${isTimeRunningLow
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              <UserPlus className="w-4 h-4" />
              Create Account
            </button>
          </div>
        </div>

        {!isTimeRunningLow && onDismiss && (
          <button
            onClick={() => {
              setIsDismissed(true);
              onDismiss();
            }}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1"
            aria-label="Dismiss banner"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-1 bg-gray-100">
          <div 
            className={`
              h-full transition-all duration-1000 ease-out
              ${isTimeRunningLow ? 'bg-red-500' : 'bg-blue-500'}
            `}
            style={{
              width: `${(timeRemaining / (4 * 3600000)) * 100}%` // 4 hours max
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Add keyframes to your CSS
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
  animation: slideIn 0.3s ease-out forwards;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}