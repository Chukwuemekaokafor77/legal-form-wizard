// Create a new component: src/components/ui/Theme.jsx
import React from 'react';

export const ThemeProvider = ({ children }) => {
  return (
    <div className="font-sans text-gray-800 bg-gray-50">
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};

