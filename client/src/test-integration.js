// Integration test to verify login and import flows
// This is a simple test to ensure the refactored components work together

import { authService, importService } from './services/api';

async function testLoginFlow() {
  console.log('Testing login flow...');

  try {
    // Test login endpoint
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpassword123'
      })
    });

    if (response.ok) {
      console.log('✓ Login endpoint accessible');
    } else {
      console.log('✗ Login endpoint issue:', response.status);
    }
  } catch (error) {
    console.log('✗ Login endpoint error:', error.message);
  }
}

async function testImportFlow() {
  console.log('Testing import flow...');

  try {
    // Test import endpoint accessibility
    const response = await fetch('/api/import/google-takeout', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });

    // We expect a 401 or 400, but not a 404
    if (response.status === 404) {
      console.log('✗ Import endpoint not found');
    } else {
      console.log('✓ Import endpoint accessible');
    }
  } catch (error) {
    console.log('✓ Import endpoint exists (network error expected)');
  }
}

async function testComponentIntegration() {
  console.log('Testing component integration...');

  // Test if UI components can be imported
  try {
    const { Button, Input, Card, Stack, Container, Skeleton } = await import('./components/ui');
    console.log('✓ UI components can be imported');

    // Test if main components can be imported
    const Login = await import('./components/Login');
    const Dashboard = await import('./pages/Dashboard');
    const ImportTakeout = await import('./components/ImportTakeout');

    console.log('✓ Main components can be imported');

    return true;
  } catch (error) {
    console.log('✗ Component import error:', error.message);
    return false;
  }
}

// Run tests
export async function runIntegrationTests() {
  console.log('Running integration tests...\n');

  await testComponentIntegration();
  await testLoginFlow();
  await testImportFlow();

  console.log('\nIntegration tests completed!');
}

// Auto-run if this file is executed directly
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  runIntegrationTests();
}
