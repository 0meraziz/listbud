import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './common/ToastProvider';
import { useApiErrorHandler } from '../hooks/useApiErrorHandler';
import { Button, Input, Card, Stack, Container } from './ui';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const { register } = useAuth();
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const { handleApiError } = useApiErrorHandler();

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await register(email, password, name);
      showSuccess('Account created successfully! Welcome to ListBud.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (err: any) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <Container size="sm">
        <div className="max-w-md w-full mx-auto">
          <Card padding="lg">
            <Stack spacing="lg">
              <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <UserPlus className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">ListBud</span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Create your account
                </h2>
                <p className="text-gray-600">
                  Join ListBud to organize your saved places
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <Stack spacing="md">
                  <Input
                    label="Full name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    leftIcon={User}
                    error={errors.name}
                    autoComplete="name"
                  />

                  <Input
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    leftIcon={Mail}
                    error={errors.email}
                    autoComplete="email"
                  />

                  <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    leftIcon={Lock}
                    error={errors.password}
                    autoComplete="new-password"
                  />

                  <Input
                    label="Confirm password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    leftIcon={Lock}
                    error={errors.confirmPassword}
                    autoComplete="new-password"
                  />

                  <Button
                    type="submit"
                    fullWidth
                    loading={isLoading}
                    leftIcon={UserPlus}
                  >
                    Create Account
                  </Button>
                </Stack>
              </form>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </Stack>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default Register;
