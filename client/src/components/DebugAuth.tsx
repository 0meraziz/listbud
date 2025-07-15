import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DebugAuth: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <div className="fixed top-4 right-4 bg-gray-800 text-white p-4 rounded shadow-lg text-sm">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <p>Loading: {isLoading ? 'true' : 'false'}</p>
      <p>Authenticated: {isAuthenticated ? 'true' : 'false'}</p>
      <p>User: {user ? user.email : 'null'}</p>
      <p>Token: {localStorage.getItem('token') ? 'exists' : 'null'}</p>
    </div>
  );
};

export default DebugAuth;
