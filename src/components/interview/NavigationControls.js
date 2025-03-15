// src/components/interview/NavigationControls.js
import React from 'react';
import { ArrowLeft, ArrowRight, Loader } from 'lucide-react';

const NavigationControls = ({
  onNext,
  onPrevious,
  canGoNext = true,
  canGoPrevious = true,
  isLastQuestion = false,
  isSubmitting = false,
  locale = 'en'
}) => {
  const translations = {
    previous: {
      en: 'Previous',
      fr: 'Précédent'
    },
    next: {
      en: 'Next',
      fr: 'Suivant'
    },
    submit: {
      en: 'Submit',
      fr: 'Soumettre'
    },
    submitting: {
      en: 'Submitting...',
      fr: 'Soumission...'
    }
  };

  return (
    <div className="flex justify-between items-center mt-8">
      <button
        type="button"
        onClick={onPrevious}
        disabled={!canGoPrevious || isSubmitting}
        className={`
          flex items-center gap-2 px-4 py-2 rounded
          transition-colors duration-200
          ${canGoPrevious
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
          disabled:opacity-50
        `}
        aria-label={translations.previous[locale] || translations.previous.en}
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        {translations.previous[locale] || translations.previous.en}
      </button>
      
      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext || isSubmitting}
        className={`
          flex items-center gap-2 px-4 py-2 rounded
          transition-colors duration-200
          bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        aria-label={
          isSubmitting
            ? translations.submitting[locale] || translations.submitting.en
            : isLastQuestion
              ? translations.submit[locale] || translations.submit.en
              : translations.next[locale] || translations.next.en
        }
      >
        {isSubmitting ? (
          <>
            <Loader className="w-4 h-4 animate-spin" aria-hidden="true" />
            {translations.submitting[locale] || translations.submitting.en}
          </>
        ) : (
          <>
            {isLastQuestion
              ? translations.submit[locale] || translations.submit.en
              : translations.next[locale] || translations.next.en}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </>
        )}
      </button>
    </div>
  );
};

export default NavigationControls;