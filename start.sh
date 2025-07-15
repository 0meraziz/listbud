#!/bin/bash

echo "Starting ListBud MVP..."

# Start server in background
cd server
echo "Starting server..."
npm run dev &
SERVER_PID=$!

# Wait a bit for server to start
sleep 3

# Start client in background
cd ../client
echo "Starting client..."
npm start &
CLIENT_PID=$!

echo "Server PID: $SERVER_PID"
echo "Client PID: $CLIENT_PID"

echo "Both services started!"
echo "Server: http://localhost:5000"
echo "Client: http://localhost:3000"

# Wait for any key to stop
echo "Press any key to stop both services..."
read -n 1

# Kill both processes
kill $SERVER_PID $CLIENT_PID
echo "Both services stopped."
