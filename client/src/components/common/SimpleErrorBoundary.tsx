import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { RefreshCw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface SimpleErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const SimpleErrorFallback: React.FC<SimpleErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Oops! Something went wrong
          </h1>

          <p className="text-gray-600 mb-8">
            We're sorry for the inconvenience. The application crashed unexpectedly.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
              <p className="text-sm font-medium text-gray-800 mb-2">Error Details:</p>
              <p className="text-xs text-gray-600 font-mono break-all">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={resetErrorBoundary}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>

            <button
              onClick={handleGoHome}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go Home
            </button>

            <button
              onClick={handleReload}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SimpleErrorBoundaryProps {
  children: React.ReactNode;
}

const SimpleErrorBoundary: React.FC<SimpleErrorBoundaryProps> = ({ children }) => {
  const handleError = (error: Error, errorInfo: any) => {
    console.error('Error caught by SimpleErrorBoundary:', error);
    console.error('Component stack:', errorInfo.componentStack);

    // Show toast notification (if available)
    if (typeof toast !== 'undefined') {
      toast.error('Something went wrong. Please try again.');
    }

    // In production, you would send this to your error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  };

  return (
    <ErrorBoundary
      FallbackComponent={SimpleErrorFallback}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
};

export default SimpleErrorBoundary;
