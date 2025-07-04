# 🚀 Real-Time Collaborative Code Editor

A beautiful, real-time collaborative code editor built with the MERN stack and WebSocket technology.

## 📋 Prerequisites

Before starting, make sure you have installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

## 🏗️ Project Structure

\`\`\`
realtime-editor/
├── frontend/          # React/Next.js Frontend (Port 3000)
├── backend/           # Node.js/Express Backend (Port 3001)
└── README.md
\`\`\`

## ⚡ Quick Start Guide

### Step 1: Clone and Setup Project Structure

\`\`\`bash
# Create main project directory
mkdir realtime-editor
cd realtime-editor

# Create frontend and backend directories
mkdir frontend backend
\`\`\`

### Step 2: Setup Frontend (React/Next.js)

\`\`\`bash
# Navigate to frontend directory
cd frontend

# Copy all frontend files from the code project above
# Then install dependencies
npm install --legacy-peer-deps

# If you get dependency conflicts, use:
npm install --force
\`\`\`

### Step 3: Setup Backend (Node.js/Express)

\`\`\`bash
# Navigate to backend directory (from project root)
cd backend

# Copy server.js and package.json from the code project above
# Then install dependencies
npm install

# Install nodemon globally for development (optional)
npm install -g nodemon
\`\`\`

### Step 4: Setup MongoDB

#### Option A: Local MongoDB Installation

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB service
3. MongoDB will run on `mongodb://localhost:27017`

**macOS:**
\`\`\`bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
\`\`\`

**Linux (Ubuntu):**
\`\`\`bash
# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb
\`\`\`

#### Option B: MongoDB with Docker (Easiest)

\`\`\`bash
# Run MongoDB in Docker container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Check if container is running
docker ps
\`\`\`

#### Option C: MongoDB Atlas (Cloud - Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account and cluster
3. Get connection string
4. Update `server.js` with your connection string:
\`\`\`javascript
mongoose.connect("your-mongodb-atlas-connection-string")
\`\`\`

## 🚀 Running the Application

### Terminal 1: Start MongoDB (if using local installation)

\`\`\`bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongodb

# Or if using Docker
docker start mongodb
\`\`\`

### Terminal 2: Start Backend Server

\`\`\`bash
# Navigate to backend directory
cd realtime-editor/backend

# Start the backend server
npm run dev

# You should see:
# ✅ Connected to MongoDB
# 🚀 Server running on http://localhost:3001
\`\`\`

### Terminal 3: Start Frontend Server

\`\`\`bash
# Navigate to frontend directory
cd realtime-editor/frontend

# Start the frontend development server
npm run dev

# You should see:
# ▲ Next.js 14.0.0
# - Local: http://localhost:3000
\`\`\`

## 🎯 Testing the Application

1. **Open your browser** and go to `http://localhost:3000`
2. **Enter your name** and either:
   - Enter a Room ID to join existing room
   - Click "Create New Room" to generate new room
3. **Share the Room ID** with others to collaborate
4. **Start coding** and see real-time changes!

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. **Frontend dependency conflicts**
\`\`\`bash
# Try these commands in order:
npm install --legacy-peer-deps
# or
npm install --force
# or
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
\`\`\`

#### 2. **"next is not recognized" error**
\`\`\`bash
# Use npx to run next
npx next dev
# or install next globally
npm install -g next
\`\`\`

#### 3. **MongoDB connection error**
\`\`\`bash
# Check if MongoDB is running
# Windows: Check Services for MongoDB
# macOS/Linux: 
sudo systemctl status mongodb
# Docker:
docker ps | grep mongo
\`\`\`

#### 4. **Port already in use**
\`\`\`bash
# Kill process on port 3000
npx kill-port 3000
# Kill process on port 3001
npx kill-port 3001
\`\`\`

#### 5. **WebSocket connection failed**
- Make sure backend server is running on port 3001
- Check if firewall is blocking the connection
- Verify CORS settings in server.js

## 📱 Features

- ✅ Real-time collaborative editing
- ✅ Live user presence indicators
- ✅ Beautiful, responsive UI
- ✅ Room-based collaboration
- ✅ Auto-save functionality
- ✅ Code execution (JavaScript)
- ✅ Download code files
- ✅ MongoDB data persistence

## 🛠️ Development Commands

### Frontend Commands
\`\`\`bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
\`\`\`

### Backend Commands
\`\`\`bash
cd backend
npm run dev      # Start with nodemon (auto-restart)
npm start        # Start production server
\`\`\`

## 🌐 API Endpoints

- `GET http://localhost:3001/health` - Health check
- `GET http://localhost:3001/api/rooms/:roomId` - Get room info
- `POST http://localhost:3001/api/rooms` - Create new room

## 🎨 Customization

### Adding New Features
- **Chat System**: Add chat alongside code editor
- **File Management**: Support multiple files per room
- **Language Support**: Add syntax highlighting for more languages
- **Themes**: Add dark/light theme toggle

### Styling
- Modify Tailwind classes in components
- Update colors in `tailwind.config.js`
- Add custom animations in `globals.css`

## 📦 Deployment

### Frontend (Vercel)
\`\`\`bash
cd frontend
npm run build
# Deploy to Vercel, Netlify, or any static hosting
\`\`\`

### Backend (Railway/Heroku)
\`\`\`bash
cd backend
# Add start script to package.json
# Deploy to Railway, Heroku, or any Node.js hosting
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

---

## 🆘 Need Help?

If you encounter any issues:

1. Check the troubleshooting section above
2. Make sure all prerequisites are installed
3. Verify MongoDB is running
4. Check that both servers are running on correct ports
5. Look at browser console and terminal for error messages

**Happy Coding! 🚀**
#   R e a l _ T i m e _ E d i t o r  
 #   R e a l _ T i m e _ E d i t o r  
 