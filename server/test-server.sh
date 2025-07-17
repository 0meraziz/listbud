#!/bin/bash

echo "🚀 Starting ListBud Server Test..."

# Start the server in the background
npm run dev &
SERVER_PID=$!

# Wait for server to start
sleep 5

echo "📡 Testing health endpoints..."

# Test health endpoint
echo "1. Testing /health"
curl -s http://localhost:5000/health

echo -e "\n2. Testing /health/detailed"
curl -s http://localhost:5000/health/detailed

echo -e "\n3. Testing /ready"
curl -s http://localhost:5000/ready

echo -e "\n4. Testing /live"
curl -s http://localhost:5000/live

echo -e "\n🔒 Testing authentication endpoints..."

# Test registration
echo "5. Testing user registration"
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'

echo -e "\n6. Testing user login"
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }'

echo -e "\n✅ Test completed!"

# Kill the server
kill $SERVER_PID
