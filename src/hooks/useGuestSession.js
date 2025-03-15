// src/hooks/useGuestSession.js
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { UserService } from '../services/UserService';

// Constants
const GUEST_SESSION_DURATION = 4 * 60 * 60 * 1000; // 4 hours
const WARNING_THRESHOLD = 15 * 60 * 1000; // 15 minutes
const CRITICAL_THRESHOLD = 5 * 60 * 1000; // 5 minutes
const UPDATE_INTERVAL = 1000; // 1 second
const RENEW_BUFFER = 2 * 60 * 1000; // 2 minutes

const useGuestSession = ({ 
  onExpire, 
  onWarning, 
  onCritical,
  autoRenew = false,
  persistKey = 'guestSession'
} = {}) => {
  const [state, setState] = useState({
    isGuest: false,
    guestSessionStartTime: null,
    sessionStatus: 'inactive', // 'inactive', 'active', 'warning', 'critical', 'expired'
    error: null,
    isLoading: true
  });
  
  const timerRef = useRef(null);
  const renewRequestRef = useRef(null);
  const abortControllerRef = useRef(new AbortController());

  // Memoized time calculations
  const { timeRemaining, formattedTime } = useMemo(() => {
    const remaining = state.guestSessionStartTime 
      ? Math.max(0, GUEST_SESSION_DURATION - (Date.now() - state.guestSessionStartTime))
      : 0;

    const hours = Math.floor(remaining / 3_600_000);
    const minutes = Math.floor((remaining % 3_600_000) / 60_000);
    const seconds = Math.floor((remaining % 60_000) / 1000);

    return {
      timeRemaining: remaining,
      formattedTime: {
        hours,
        minutes,
        seconds,
        clock: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
        descriptive: hours > 0 
          ? `${hours}h ${minutes}m`
          : `${minutes}m ${seconds}s`
      }
    };
  }, [state.guestSessionStartTime]);

  // Status transitions
  useEffect(() => {
    if (!state.guestSessionStartTime || state.sessionStatus === 'expired') return;

    const updateStatus = (newStatus) => {
      if (newStatus !== state.sessionStatus) {
        setState(prev => ({ ...prev, sessionStatus: newStatus }));
      }
    };

    if (timeRemaining <= CRITICAL_THRESHOLD) {
      updateStatus('critical');
      onCritical?.();
    } else if (timeRemaining <= WARNING_THRESHOLD) {
      updateStatus('warning');
      onWarning?.();
    } else if (timeRemaining <= 0) {
      handleExpiration();
    }
  }, [timeRemaining, state.sessionStatus]);

  // Auto-renew logic
  useEffect(() => {
    if (autoRenew && timeRemaining <= RENEW_BUFFER) {
      renewSession();
    }
  }, [autoRenew, timeRemaining]);

  // Session persistence
  useEffect(() => {
    if (state.guestSessionStartTime) {
      localStorage.setItem(persistKey, JSON.stringify({
        startTime: state.guestSessionStartTime,
        status: state.sessionStatus
      }));
    }
  }, [state.guestSessionStartTime, state.sessionStatus]);

  // Initialize session from storage
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const savedSession = localStorage.getItem(persistKey);
        if (savedSession) {
          const { startTime, status } = JSON.parse(savedSession);
          if (Date.now() - startTime < GUEST_SESSION_DURATION) {
            setState(prev => ({
              ...prev,
              guestSessionStartTime: startTime,
              sessionStatus: status,
              isLoading: false
            }));
            return;
          }
        }

        const userStatus = await UserService.getUserStatus({
          signal: abortControllerRef.current.signal
        });
        
        setState(prev => ({
          ...prev,
          isGuest: userStatus.isGuest,
          guestSessionStartTime: userStatus.sessionStartTime,
          isLoading: false
        }));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setState(prev => ({ ...prev, error: err.message, isLoading: false }));
        }
      }
    };

    initializeSession();
    return () => abortControllerRef.current.abort();
  }, []);

  // Timer management
  useEffect(() => {
    if (state.sessionStatus === 'active') {
      timerRef.current = setInterval(() => {
        setState(prev => ({ ...prev }));
      }, UPDATE_INTERVAL);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.sessionStatus]);

  const handleExpiration = useCallback(() => {
    setState(prev => ({
      ...prev,
      sessionStatus: 'expired',
      guestSessionStartTime: null
    }));
    localStorage.removeItem(persistKey);
    onExpire?.();
    UserService.expireGuestSession();
  }, [onExpire]);

  const startGuestSession = useCallback(async () => {
    try {
      const startTime = Date.now();
      await UserService.startGuestSession(startTime);
      
      setState(prev => ({
        ...prev,
        isGuest: true,
        guestSessionStartTime: startTime,
        sessionStatus: 'active',
        error: null
      }));
    } catch (err) {
      setState(prev => ({ ...prev, error: err.message }));
    }
  }, []);

  const renewSession = useCallback(async () => {
    if (renewRequestRef.current) return;

    try {
      renewRequestRef.current = true;
      const startTime = Date.now();
      await UserService.renewGuestSession(startTime);
      
      setState(prev => ({
        ...prev,
        guestSessionStartTime: startTime,
        sessionStatus: 'active',
        error: null
      }));
    } catch (err) {
      setState(prev => ({ ...prev, error: err.message }));
    } finally {
      renewRequestRef.current = false;
    }
  }, []);

  return {
    ...state,
    timeRemaining,
    formattedTime,
    canRenew: state.sessionStatus !== 'expired' && !autoRenew,
    startGuestSession,
    renewSession,
    resetSession: () => {
      setState(prev => ({ ...prev, sessionStatus: 'inactive', guestSessionStartTime: null }));
      localStorage.removeItem(persistKey);
    }
  };
};

export default useGuestSession;
