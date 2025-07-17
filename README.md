# ListBud - MVP

A minimal viable product for organizing Google Maps saved places using Google Takeout data.

## Features
- 🔐 Simple authentication (email/password)
- 📥 Import Google Maps saved places from Google Takeout
- 🔍 Search and filter places by name, address, or categories
- 🏷️ Basic categorization system
- 💾 Local SQLite database storage
- 📱 Responsive design with custom CSS utilities

## Tech Stack
- **Frontend**: React with TypeScript, Custom CSS utilities
- **Backend**: Node.js with Express
- **Database**: SQLite (local)
- **Authentication**: JWT tokens

## Quick Start

### 1. Install Dependencies
```bash
# Install all dependencies (server + client)
npm run install-deps
```

### 2. Start Development

**Option 1: Use the development script (recommended)**
```bash
./dev.sh
```

**Option 2: Start both services with npm**
```bash
npm run dev
```

**Option 3: Start individually (if you have terminal issues)**
```bash
# Terminal 1: Start server
npm run server

# Terminal 2: Start client
npm run client
```

**Option 4: Manual start**
```bash
# Terminal 1: Start server
cd server && npm run dev

# Terminal 2: Start client
cd client && npm start
```

### 3. Access the Application
- **Client**: http://localhost:3000
- **Server**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## Getting Your Google Maps Data

### Step 1: Request Your Data
1. Go to [Google Takeout](https://takeout.google.com/)
2. Click "Deselect all" then find and select "Saved"
3. Choose format: CSV
4. Click "Next step" → "Create export"
5. Wait for the download link (can take a few minutes to hours)

### Step 2: Extract and Import
1. Download and extract the archive
2. Navigate to `Takeout/Saved/Saved Places/`
3. Look for CSV files (usually named like "Saved Places.csv")
4. In ListBud, click "Import Places" and upload the CSV file

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Places
- `GET /api/places` - Get all places for user
- `POST /api/places` - Create new place
- `GET /api/places/search` - Search places
- `DELETE /api/places/:id` - Delete place

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `POST /api/categories/:categoryId/places/:placeId` - Add category to place

### Import
- `POST /api/import/google-takeout` - Import from Google Takeout CSV

## Project Structure
```
listbud/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   └── package.json
├── server/          # Node.js backend
│   ├── src/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── database.ts
│   │   └── index.ts
│   └── package.json
├── shared/          # Shared types
├── package.json     # Root package.json
└── README.md
```

## Development Notes

### Database
- Uses SQLite for local development
- Database file: `server/database.sqlite`
- Schema auto-creates on first run

### Authentication
- Simple JWT-based authentication
- Tokens stored in localStorage
- 7-day expiration

### Error Handling
- Client shows user-friendly error messages
- Server logs errors to console
- Rate limiting enabled (100 requests/15 minutes)

## Troubleshooting

### Common Issues

1. **"concurrently: command not found"**
   - Solution: `npm install concurrently`

2. **Tailwind CSS PostCSS errors**
   - **Solution**: Tailwind CSS has been removed to avoid PostCSS conflicts
   - The app uses custom CSS utilities that provide the same styling
   - No additional configuration needed - just start the app normally

3. **Port already in use**
   - Change ports in `server/.env` (PORT=5000)
   - Or kill existing processes

4. **Import fails**
   - Check CSV file format
   - Ensure file is from Google Takeout Maps export
   - Check file size (max 10MB)

5. **Database errors**
   - Delete `server/database.sqlite` to reset
   - Restart server to recreate tables

6. **Authentication issues**
   - Clear browser localStorage
   - Check JWT_SECRET in `server/.env`

### Development Commands

```bash
# Check service status
./status.sh

# Build client for production
npm run build

# Test server endpoints
curl -X GET http://localhost:5000/health

# View database
sqlite3 server/database.sqlite
```

### Additional Troubleshooting

If you encounter any issues:

1. **Check logs**: Look at terminal output for specific error messages
2. **Restart services**: Stop and restart both server and client
3. **Clear cache**: Delete `node_modules` and reinstall dependencies
4. **Check ports**: Ensure ports 3000 and 5000 are available

For detailed troubleshooting, see `TROUBLESHOOTING.md`.

## Future Enhancements

- [ ] Google Maps visualization
- [ ] Export functionality
- [ ] Bulk operations
- [ ] Advanced filtering
- [ ] Categories with icons
- [ ] Collaborative lists
- [ ] Mobile app
- [ ] Cloud deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project as a starting point for your own applications!

# ListBud - MVP to Beta Transition

A production-ready enhancement of Google Maps saved places organization with advanced search, categorization, and user experience features.

## 🎯 **Current Status: Week 2 - User Experience Enhancements**
- ✅ **MVP**: Complete and functional
- ✅ **Infrastructure**: Production-ready (PostgreSQL, Docker, Security)
- ✅ **Error Handling**: Complete system implemented
- 🔄 **Performance**: Optimization in progress
- 🔄 **Analytics**: Planning stage

## 📋 **Project Management**
For detailed progress tracking, roadmaps, and documentation, see the [`project-management/`](./project-management/) folder:
- [📊 Progress Tracker](./project-management/PROGRESS_TRACKER.md) - Current development status
- [📋 Project Plan](./project-management/project_plan.md) - Complete project roadmap
- [🗂️ Project Hub](./project-management/README.md) - All project management files

---
