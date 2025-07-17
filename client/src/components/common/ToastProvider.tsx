import React, { createContext, useContext, useCallback } from 'react';
import toast, { Toaster, ToastOptions } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastContextType {
  showToast: (message: string, type?: ToastType, options?: ToastOptions) => void;
  showSuccess: (message: string, options?: ToastOptions) => void;
  showError: (message: string, options?: ToastOptions) => void;
  showWarning: (message: string, options?: ToastOptions) => void;
  showInfo: (message: string, options?: ToastOptions) => void;
  dismiss: (toastId?: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'error':
      return <XCircle className="w-5 h-5 text-red-500" />;
    case 'warning':
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    case 'info':
      return <Info className="w-5 h-5 text-blue-500" />;
    default:
      return null;
  }
};

const customToastStyles = {
  success: {
    background: '#10b981',
    color: 'white',
  },
  error: {
    background: '#ef4444',
    color: 'white',
  },
  warning: {
    background: '#f59e0b',
    color: 'white',
  },
  info: {
    background: '#3b82f6',
    color: 'white',
  },
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const showToast = useCallback((message: string, type: ToastType = 'info', options: ToastOptions = {}) => {
    const defaultOptions: ToastOptions = {
      duration: 4000,
      position: 'top-right',
      style: customToastStyles[type],
      icon: getToastIcon(type),
      ...options,
    };

    switch (type) {
      case 'success':
        toast.success(message, defaultOptions);
        break;
      case 'error':
        toast.error(message, defaultOptions);
        break;
      case 'warning':
        toast(message, { ...defaultOptions, icon: getToastIcon('warning') });
        break;
      case 'info':
      default:
        toast(message, defaultOptions);
        break;
    }
  }, []);

  const showSuccess = useCallback((message: string, options?: ToastOptions) => {
    showToast(message, 'success', options);
  }, [showToast]);

  const showError = useCallback((message: string, options?: ToastOptions) => {
    showToast(message, 'error', options);
  }, [showToast]);

  const showWarning = useCallback((message: string, options?: ToastOptions) => {
    showToast(message, 'warning', options);
  }, [showToast]);

  const showInfo = useCallback((message: string, options?: ToastOptions) => {
    showToast(message, 'info', options);
  }, [showToast]);

  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  }, []);

  const dismissAll = useCallback(() => {
    toast.dismiss();
  }, []);

  const contextValue: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismiss,
    dismissAll,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
          },
        }}
      />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Utility hook for API error handling
export const useApiErrorHandler = () => {
  const { showError } = useToast();

  const handleApiError = useCallback((error: any) => {
    console.error('API Error:', error);

    let errorMessage = 'An unexpected error occurred';

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    showError(errorMessage);
  }, [showError]);

  return { handleApiError };
};

export default ToastProvider;
