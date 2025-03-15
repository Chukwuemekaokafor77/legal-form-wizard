// src/services/UserService.js
/**
 * Service for managing user accounts and authentication
 */
class UserService {
    constructor() {
      this.isAuthenticated = false;
      this.currentUser = null;
      
      // Check local storage for existing session on init
      this.checkAuthStatus();
    }
  
    /**
     * Check if the user is authenticated
     * @returns {boolean}
     */
    isUserAuthenticated() {
      return this.isAuthenticated;
    }
  
    /**
     * Check authentication status from localStorage
     * @private
     */
    checkAuthStatus() {
      const userToken = localStorage.getItem('userToken');
      const userData = localStorage.getItem('userData');
      
      if (userToken && userData) {
        try {
          this.currentUser = JSON.parse(userData);
          this.isAuthenticated = true;
        } catch (e) {
          console.error('Error parsing user data:', e);
          this.logout(); // Clear invalid data
        }
      }
    }
  
    /**
     * Get current user's status
     * @param {Object} options - Request options
     * @returns {Promise<Object>} User status information
     */
    async getUserStatus(options = {}) {
      // In a real app, this would make an API call
      // For now, we'll return mock data based on local storage
      
      const isGuest = !this.isAuthenticated;
      const guestSessionData = localStorage.getItem('guestSession');
      let sessionStartTime = null;
      
      if (guestSessionData) {
        try {
          const parsed = JSON.parse(guestSessionData);
          sessionStartTime = parsed.startTime;
        } catch (e) {
          console.error('Error parsing guest session data:', e);
        }
      }
      
      return {
        isGuest,
        isAuthenticated: this.isAuthenticated,
        sessionStartTime,
        user: this.isAuthenticated ? this.currentUser : null
      };
    }
  
    /**
     * Start a guest session
     * @param {number} startTime - Unix timestamp for session start
     * @returns {Promise<void>}
     */
    async startGuestSession(startTime) {
      localStorage.setItem('guestSession', JSON.stringify({
        startTime: startTime || Date.now(),
        id: `guest-${Math.random().toString(36).substr(2, 9)}`
      }));
      
      return Promise.resolve();
    }
  
    /**
     * Renew a guest session
     * @param {number} startTime - New start time for session
     * @returns {Promise<void>}
     */
    async renewGuestSession(startTime) {
      const sessionData = localStorage.getItem('guestSession');
      
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData);
          localStorage.setItem('guestSession', JSON.stringify({
            ...parsed,
            startTime: startTime || Date.now()
          }));
        } catch (e) {
          console.error('Error parsing guest session data:', e);
          await this.startGuestSession(startTime);
        }
      } else {
        await this.startGuestSession(startTime);
      }
      
      return Promise.resolve();
    }
  
    /**
     * Expire the guest session
     * @returns {Promise<void>}
     */
    async expireGuestSession() {
      localStorage.removeItem('guestSession');
      return Promise.resolve();
    }
  
    /**
     * Log in a user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} Logged in user data
     */
    async login(email, password) {
      // In a real app, this would make an API call
      // For now, we'll simulate a successful login
      
      if (!email || !password) {
        return Promise.reject(new Error('Email and password are required'));
      }
      
      // Mock successful login
      const userData = {
        id: '123456',
        email,
        name: email.split('@')[0],
        role: 'user'
      };
      
      // Store auth data
      localStorage.setItem('userToken', 'mock-token-123456');
      localStorage.setItem('userData', JSON.stringify(userData));
      
      this.isAuthenticated = true;
      this.currentUser = userData;
      
      return Promise.resolve(userData);
    }
  
    /**
     * Create a new user account
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} Created user data
     */
    async register(userData) {
      // In a real app, this would make an API call
      
      if (!userData.email || !userData.password) {
        return Promise.reject(new Error('Email and password are required'));
      }
      
      // Mock successful registration
      const createdUser = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        email: userData.email,
        name: userData.name || userData.email.split('@')[0],
        role: 'user'
      };
      
      // Auto-login after registration
      localStorage.setItem('userToken', `mock-token-${createdUser.id}`);
      localStorage.setItem('userData', JSON.stringify(createdUser));
      
      this.isAuthenticated = true;
      this.currentUser = createdUser;
      
      return Promise.resolve(createdUser);
    }
  
    /**
     * Log out the current user
     * @returns {Promise<void>}
     */
    async logout() {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      
      this.isAuthenticated = false;
      this.currentUser = null;
      
      return Promise.resolve();
    }
  }
  
  export default new UserService();