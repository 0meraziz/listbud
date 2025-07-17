import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppErrorBoundary from './components/common/ErrorBoundary';
import ToastProvider from './components/common/ToastProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import DebugAuth from './components/DebugAuth';

function App() {
  return (
    <AppErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              {process.env.NODE_ENV === 'development' && <DebugAuth />}
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </AppErrorBoundary>
  );
}

export default App;
