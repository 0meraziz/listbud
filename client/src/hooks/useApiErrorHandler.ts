import { useCallback } from 'react';
import { useToast } from '../components/common/ToastProvider';

interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
      errors?: Record<string, string[]>;
    };
    status?: number;
    statusText?: string;
  };
  message?: string;
  code?: string;
}

interface UseApiErrorHandlerReturn {
  handleApiError: (error: ApiError) => void;
  handleNetworkError: (error: ApiError) => void;
  handleValidationError: (error: ApiError) => void;
  handleAuthError: (error: ApiError) => void;
}

export const useApiErrorHandler = (): UseApiErrorHandlerReturn => {
  const { showError, showWarning } = useToast();

  const handleApiError = useCallback((error: ApiError) => {
    console.error('API Error:', error);

    // Handle different types of errors
    const status = error.response?.status;

    switch (status) {
      case 400:
        handleValidationError(error);
        break;
      case 401:
        handleAuthError(error);
        break;
      case 403:
        showError('You don\'t have permission to perform this action');
        break;
      case 404:
        showError('The requested resource was not found');
        break;
      case 422:
        handleValidationError(error);
        break;
      case 429:
        showWarning('Too many requests. Please try again later');
        break;
      case 500:
        showError('Server error. Please try again later');
        break;
      case 503:
        showError('Service temporarily unavailable. Please try again later');
        break;
      default:
        if (error.code === 'NETWORK_ERROR' || !error.response) {
          handleNetworkError(error);
        } else {
          showError(getErrorMessage(error));
        }
        break;
    }
  }, [showError, showWarning]);

  const handleNetworkError = useCallback((error: ApiError) => {
    console.error('Network Error:', error);
    showError('Network error. Please check your internet connection and try again');
  }, [showError]);

  const handleValidationError = useCallback((error: ApiError) => {
    console.error('Validation Error:', error);

    const errors = error.response?.data?.errors;
    if (errors) {
      // Handle field-specific validation errors
      const fieldErrors = Object.entries(errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('; ');
      showError(`Validation failed: ${fieldErrors}`);
    } else {
      showError(getErrorMessage(error) || 'Invalid input. Please check your data and try again');
    }
  }, [showError]);

  const handleAuthError = useCallback((error: ApiError) => {
    console.error('Auth Error:', error);

    const message = getErrorMessage(error);
    if (message?.toLowerCase().includes('expired')) {
      showError('Your session has expired. Please log in again');
      // Optionally redirect to login
      // window.location.href = '/login';
    } else {
      showError('Authentication failed. Please log in again');
    }
  }, [showError]);

  return {
    handleApiError,
    handleNetworkError,
    handleValidationError,
    handleAuthError,
  };
};

// Utility function to extract error message from error object
const getErrorMessage = (error: ApiError): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.message) {
    return error.message;
  }

  if (error.response?.statusText) {
    return error.response.statusText;
  }

  return 'An unexpected error occurred';
};

// Hook for handling specific API operations
export const useApiOperationHandler = () => {
  const { handleApiError } = useApiErrorHandler();
  const { showSuccess } = useToast();

  const handleApiOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    successMessage?: string,
    errorMessage?: string
  ): Promise<T | null> => {
    try {
      const result = await operation();
      if (successMessage) {
        showSuccess(successMessage);
      }
      return result;
    } catch (error) {
      if (errorMessage) {
        console.error(errorMessage, error);
      }
      handleApiError(error as ApiError);
      return null;
    }
  }, [handleApiError, showSuccess]);

  return { handleApiOperation };
};

export default useApiErrorHandler;
