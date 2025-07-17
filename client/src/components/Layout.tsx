import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Container } from './ui';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <Container>
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                ListBud
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <span className="text-sm text-gray-700">
                    Welcome, {user.name}
                  </span>
                  <Button
                    onClick={logout}
                    variant="ghost"
                    size="sm"
                    leftIcon={LogOut}
                    className="text-red-600 hover:text-red-800"
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </Container>
      </nav>

      <main>
        <Container className="py-6">
          {children}
        </Container>
      </main>
    </div>
  );
};

export default Layout;
