// src/utils/formatters.js - Add new utility
export const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    } catch (err) {
      console.error('Date formatting error:', err);
      return dateString;
    }
  };
  
  // Then use this function consistently in all date handling