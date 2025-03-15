// src/components/i18n/LanguageSwitcher.js
import React from 'react';
import { useLanguage } from '../../services/i18n/LanguageService';

/**
 * Language switcher component for changing the application language
 */
const LanguageSwitcher = ({ type = 'dropdown', showFlags = true, className = '' }) => {
  const { 
    currentLanguage, 
    changeLanguage, 
    supportedLanguages,
    t
  } = useLanguage();
  
  const renderDropdown = () => (
    <select
      value={currentLanguage}
      onChange={(e) => changeLanguage(e.target.value)}
      className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      aria-label={t('common.selectLanguage')}
    >
      {Object.entries(supportedLanguages).map(([code, lang]) => (
        <option key={code} value={code}>
          {showFlags && lang.flag} {lang.nativeName}
        </option>
      ))}
    </select>
  );
  
  const renderButtons = () => (
    <div className={`flex gap-2 ${className}`}>
      {Object.entries(supportedLanguages).map(([code, lang]) => (
        <button
          key={code}
          onClick={() => changeLanguage(code)}
          className={`px-3 py-1.5 rounded-lg border transition-colors
            ${currentLanguage === code 
              ? 'bg-blue-100 border-blue-300 text-blue-800' 
              : 'border-gray-300 hover:bg-gray-100'
            }`}
          aria-label={`Change language to ${lang.name}`}
          aria-pressed={currentLanguage === code}
        >
          {showFlags && <span className="mr-2">{lang.flag}</span>}
          {lang.nativeName}
        </button>
      ))}
    </div>
  );
  
  const renderFlags = () => (
    <div className={`flex gap-2 ${className}`}>
      {Object.entries(supportedLanguages).map(([code, lang]) => (
        <button
          key={code}
          onClick={() => changeLanguage(code)}
          className={`p-1.5 rounded-lg border transition-colors
            ${currentLanguage === code 
              ? 'bg-blue-100 border-blue-300' 
              : 'border-gray-300 hover:bg-gray-100'
            }`}
          aria-label={`Change language to ${lang.name}`}
          aria-pressed={currentLanguage === code}
          title={lang.name}
        >
          <span className="text-xl">{lang.flag}</span>
        </button>
      ))}
    </div>
  );
  
  switch (type) {
    case 'buttons':
      return renderButtons();
    case 'flags':
      return renderFlags();
    case 'dropdown':
    default:
      return renderDropdown();
  }
};

export default LanguageSwitcher;