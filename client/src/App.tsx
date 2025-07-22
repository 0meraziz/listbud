import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppErrorBoundary from './components/common/ErrorBoundary';
import SimpleErrorBoundary from './components/common/SimpleErrorBoundary';
import ToastProvider from './components/common/ToastProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import ModernDashboard from './pages/ModernDashboard';
import EnhancedModernDashboard from './pages/EnhancedModernDashboard';
import { DashboardIntegration } from './pages/DashboardIntegration';
import DebugAuth from './components/DebugAuth';

function App() {
  return (
    <SimpleErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <AppErrorBoundary>
              <div className="App">
                {process.env.NODE_ENV === 'development' && <DebugAuth />}
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/redesign"
                    element={
                      <ProtectedRoute>
                        <DashboardIntegration />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/redesign/folders/:folderId"
                    element={
                      <ProtectedRoute>
                        <DashboardIntegration />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/redesign/places/:placeId"
                    element={
                      <ProtectedRoute>
                        <DashboardIntegration />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <EnhancedModernDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/modern"
                    element={
                      <ProtectedRoute>
                        <EnhancedModernDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/enhanced"
                    element={
                      <ProtectedRoute>
                        <EnhancedModernDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/folders/:folderId"
                    element={
                      <ProtectedRoute>
                        <EnhancedModernDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/places/:placeId"
                    element={
                      <ProtectedRoute>
                        <EnhancedModernDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/legacy"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/old"
                    element={
                      <ProtectedRoute>
                        <ModernDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/" element={<Navigate to="/enhanced" replace />} />
                  <Route path="*" element={<Navigate to="/enhanced" replace />} />
                </Routes>
              </div>
            </AppErrorBoundary>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </SimpleErrorBoundary>
  );
}

export default App;
