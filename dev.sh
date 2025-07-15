#!/bin/bash

echo "🚀 Starting ListBud MVP Development Environment"
echo "=============================================="

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $port is already in use"
        return 1
    fi
    return 0
}

# Check if ports are available
if ! check_port 5000; then
    echo "🔧 Server port 5000 is in use. Please stop the existing server or change the port in server/.env"
    exit 1
fi

if ! check_port 3000; then
    echo "🔧 Client port 3000 is in use. Please stop the existing client or it will start on a different port"
fi

# Start server in background
echo "🖥️  Starting server on port 5000..."
cd server
npm run dev &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Test server health
echo "🔍 Checking server health..."
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Server is running healthy"
else
    echo "❌ Server health check failed"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Start client in background
echo "🌐 Starting client on port 3000..."
cd ../client
npm start &
CLIENT_PID=$!

echo ""
echo "🎉 Both services started successfully!"
echo "📍 Server: http://localhost:5000"
echo "📍 Client: http://localhost:3000"
echo "📍 Health Check: http://localhost:5000/health"
echo ""
echo "Press Ctrl+C to stop both services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $SERVER_PID 2>/dev/null
    kill $CLIENT_PID 2>/dev/null
    echo "✅ Services stopped"
    exit 0
}

# Set up trap for cleanup
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
