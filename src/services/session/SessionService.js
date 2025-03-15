// src/services/session/SessionService.js
/**
 * Service for managing user session and progress
 */
class SessionService {
    /**
     * Save user progress
     * @param {Object} data - User form data to save
     * @returns {Promise<void>}
     */
    async saveProgress(data) {
      try {
        // Store progress in localStorage
        localStorage.setItem('formWizardProgress', JSON.stringify({
          answers: data,
          lastStep: window.location.hash || '#step-1',
          timestamp: new Date().toISOString()
        }));
        
        // In a real application, we would also save to a server
        console.log('Progress saved:', data);
        return Promise.resolve();
      } catch (error) {
        console.error('Error saving progress:', error);
        return Promise.reject(error);
      }
    }
  
    /**
     * Load saved progress
     * @returns {Promise<Object>} Saved progress data
     */
    async loadProgress() {
      try {
        // Load progress from localStorage
        const savedData = localStorage.getItem('formWizardProgress');
        if (!savedData) {
          return null;
        }
        
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Error loading progress:', error);
        return Promise.reject(error);
      }
    }
  
    /**
     * Clear saved progress
     * @returns {Promise<void>}
     */
    async clearProgress() {
      try {
        localStorage.removeItem('formWizardProgress');
        return Promise.resolve();
      } catch (error) {
        console.error('Error clearing progress:', error);
        return Promise.reject(error);
      }
    }
  
    /**
     * Check if user has saved progress
     * @returns {Promise<boolean>}
     */
    async hasSavedProgress() {
      try {
        const savedData = localStorage.getItem('formWizardProgress');
        return Promise.resolve(!!savedData);
      } catch (error) {
        console.error('Error checking saved progress:', error);
        return Promise.reject(error);
      }
    }
  }
  
  export default new SessionService();