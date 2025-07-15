# ListBud Development Troubleshooting Guide

## Quick Start (If having issues with npm run dev)

The `npm run dev` command uses `concurrently` to run both server and client. If you're having issues, here are alternative approaches:

### Method 1: Use the development script
```bash
./dev.sh
```

### Method 2: Check status first
```bash
./status.sh
```

### Method 3: Start manually in separate terminals

**Terminal 1 (Server):**
```bash
cd server
npm run dev
```

**Terminal 2 (Client):**
```bash
cd client
npm start
```

### Method 4: Background processes
```bash
# Start server in background
cd server && npm run dev &

# Start client in background
cd client && npm start &
```

## Common Issues and Solutions

### 1. "concurrently: command not found"
**Problem:** The concurrently package isn't installed
**Solution:**
```bash
npm install concurrently
```

### 2. Port 5000 already in use
**Problem:** Another process is using port 5000
**Solutions:**
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill

# Or change the port in server/.env
PORT=5001
```

### 3. Port 3000 already in use
**Problem:** Another process is using port 3000
**Solution:** React will automatically suggest a different port (like 3001)

### 4. Server won't start
**Problem:** Database or dependency issues
**Solutions:**
```bash
# Delete database and restart
rm server/database.sqlite
cd server && npm run dev

# Reinstall dependencies
cd server && rm -rf node_modules package-lock.json && npm install
```

### 5. Client won't start
**Problem:** React build issues
**Solutions:**
```bash
# Clear cache and reinstall
cd client && rm -rf node_modules package-lock.json && npm install

# Clear React cache
cd client && npm start --reset-cache
```

### 6. "Cannot find module" errors
**Problem:** Missing dependencies
**Solution:**
```bash
# Reinstall all dependencies
npm run install-deps
```

## Verification Steps

### 1. Check if services are running
```bash
./status.sh
```

### 2. Manual health checks
```bash
# Server health
curl http://localhost:5000/health

# Client (should return HTML)
curl http://localhost:3000
```

### 3. Test API endpoints
```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Development Workflow

### Start Development
1. `./status.sh` - Check current status
2. `./dev.sh` - Start both services
3. Open http://localhost:3000 in browser

### Stop Development
- Press Ctrl+C in the terminal running dev.sh
- Or kill processes manually: `./status.sh` shows PIDs

### Restart Services
```bash
# Quick restart
./dev.sh

# Or restart individually
cd server && npm run dev
cd client && npm start
```

## File Structure Reminder

```
listbud/
├── server/
│   ├── src/
│   ├── .env (configure PORT, JWT_SECRET, DB_PATH)
│   └── package.json
├── client/
│   ├── src/
│   └── package.json
├── dev.sh (development script)
├── status.sh (status checker)
└── package.json (root package for concurrently)
```

## Environment Variables

### Server (.env)
```
NODE_ENV=development
PORT=5000
JWT_SECRET=listbud-secret-key-2024
DB_PATH=./database.sqlite
```

### Client (optional .env)
```
REACT_APP_API_URL=http://localhost:5000
```

## Success Indicators

When everything is working:
- Server logs: "Server running on port 5000" and "Connected to SQLite database"
- Client opens browser automatically to http://localhost:3000
- You can register/login and import places
- `./status.sh` shows both services running

## Still Having Issues?

1. Check the logs in the terminal for specific error messages
2. Try the manual terminal approach (Method 3 above)
3. Delete node_modules and reinstall: `npm run install-deps`
4. Check if you have the required Node.js version (v18+)

The application should work smoothly once the services are running!
