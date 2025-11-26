import { createContext, useContext, useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { authService } from '../services/authService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUnreadCount = async () => {
    // Only fetch if user is authenticated
    if (!authService.isAuthenticated()) {
      setUnreadCount(0);
      return;
    }

    try {
      setIsLoading(true);
      const data = await notificationService.getUnreadCount();
      setUnreadCount(data.count || 0);
    } catch (error) {
      // Silently fail if not authenticated or other errors
      // Don't log 403 errors as they're expected when not logged in
      if (error.response?.status !== 403 && error.response?.status !== 401) {
        console.error('Error fetching unread count:', error);
      }
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication status
    const checkAuthAndFetch = () => {
      if (authService.isAuthenticated()) {
        fetchUnreadCount();
      }
    };

    checkAuthAndFetch();
    
    // Refresh every 30 seconds only if authenticated
    const interval = setInterval(() => {
      if (authService.isAuthenticated()) {
        fetchUnreadCount();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const refreshCount = () => {
    if (authService.isAuthenticated()) {
      fetchUnreadCount();
    }
  };

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshCount, isLoading }}>
      {children}
    </NotificationContext.Provider>
  );
};

