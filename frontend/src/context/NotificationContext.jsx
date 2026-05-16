import React, { createContext, useContext } from 'react';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const showSuccess = (message, duration = 3000) => {
    toast.success(message, {
      duration,
      position: 'top-right',
    });
  };

  const showError = (message, duration = 3000) => {
    toast.error(message, {
      duration,
      position: 'top-right',
    });
  };

  const showInfo = (message, duration = 3000) => {
    toast(message, {
      duration,
      position: 'top-right',
      icon: 'ℹ️',
    });
  };

  const showWarning = (message, duration = 3000) => {
    toast((t) => (
      <div>
        <span>{message}</span>
      </div>
    ), {
      duration,
      position: 'top-right',
      icon: '⚠️',
    });
  };

  const showLoading = (message) => {
    return toast.loading(message, {
      position: 'top-right',
    });
  };

  const dismiss = (toastId) => {
    toast.dismiss(toastId);
  };

  const value = {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    dismiss,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
