#!/bin/bash

echo "ListBud Development Status Check"
echo "==============================="

# Check if server is running
echo "🔍 Checking server (port 5000)..."
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Server is running"
    curl -s http://localhost:5000/health | echo "   Response: $(cat)"
else
    echo "❌ Server is not running"
fi

# Check if client is running
echo "🔍 Checking client (port 3000)..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Client is running"
else
    echo "❌ Client is not running"
fi

# Check processes
echo "🔍 Checking processes..."
SERVER_PID=$(lsof -ti:5000)
CLIENT_PID=$(lsof -ti:3000)

if [ ! -z "$SERVER_PID" ]; then
    echo "✅ Server process found (PID: $SERVER_PID)"
else
    echo "❌ No server process found"
fi

if [ ! -z "$CLIENT_PID" ]; then
    echo "✅ Client process found (PID: $CLIENT_PID)"
else
    echo "❌ No client process found"
fi

echo ""
echo "📚 Quick commands:"
echo "   Start server: cd server && npm run dev"
echo "   Start client: cd client && npm start"
echo "   Both together: npm run dev"
echo "   Kill server: kill $SERVER_PID"
echo "   Kill client: kill $CLIENT_PID"
