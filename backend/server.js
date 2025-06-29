// const express = require("express")
// const http = require("http")
// const socketIo = require("socket.io")
// const mongoose = require("mongoose")
// const cors = require("cors")

// const app = express()
// const server = http.createServer(app)
// const io = socketIo(server, {
//   cors: {
//     origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
//     methods: ["GET", "POST"],
//     credentials: true
//   },
// })

// // Middleware
// app.use(cors({
//   origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
//   credentials: true
// }))
// app.use(express.json())

// // Add a root route to test if server is working
// app.get("/", (req, res) => {
//   res.json({
//     message: "🚀 CodeSync Backend Server is running!",
//     status: "OK",
//     timestamp: new Date().toISOString(),
//     endpoints: {
//       health: "/health",
//       rooms: "/api/rooms",
//       socketio: "Socket.io enabled"
//     }
//   })
// })

// // MongoDB Connection
// mongoose
//   .connect("mongodb://localhost:27017/realtime-editor", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("✅ Connected to MongoDB")
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err)
//     console.log("💡 Make sure MongoDB is running on your system")
//     console.log("💡 You can still test the app without MongoDB - it will work with in-memory storage")
//   })

// // Room Schema
// const roomSchema = new mongoose.Schema({
//   roomId: { type: String, required: true, unique: true },
//   code: {
//     type: String,
//     default:
//       '// Welcome to CodeSync!\n// Start typing to see real-time collaboration in action\n\nfunction hello() {\n  console.log("Hello, World!");\n}\n\nhello();',
//   },
//   users: [
//     {
//       id: String,
//       name: String,
//       color: String,
//       joinedAt: { type: Date, default: Date.now },
//     },
//   ],
//   createdAt: { type: Date, default: Date.now },
//   lastModified: { type: Date, default: Date.now },
// })

// const Room = mongoose.model("Room", roomSchema)

// // In-memory storage as fallback
// const inMemoryRooms = new Map()

// // Store active connections
// const activeConnections = new Map()

// // Helper function to get or create room
// async function getOrCreateRoom(roomId) {
//   try {
//     if (mongoose.connection.readyState === 1) {
//       // MongoDB is connected
//       let room = await Room.findOne({ roomId })
//       if (!room) {
//         room = new Room({ roomId })
//         await room.save()
//       }
//       return room
//     } else {
//       // Use in-memory storage
//       if (!inMemoryRooms.has(roomId)) {
//         inMemoryRooms.set(roomId, {
//           roomId,
//           code: '// Welcome to CodeSync!\n// Start typing to see real-time collaboration in action\n\nfunction hello() {\n  console.log("Hello, World!");\n}\n\nhello();',
//           users: [],
//           createdAt: new Date(),
//           lastModified: new Date()
//         })
//       }
//       return inMemoryRooms.get(roomId)
//     }
//   } catch (error) {
//     console.error("Error with room operations:", error)
//     // Fallback to in-memory
//     if (!inMemoryRooms.has(roomId)) {
//       inMemoryRooms.set(roomId, {
//         roomId,
//         code: '// Welcome to CodeSync!\n// Start typing to see real-time collaboration in action\n\nfunction hello() {\n  console.log("Hello, World!");\n}\n\nhello();',
//         users: [],
//         createdAt: new Date(),
//         lastModified: new Date()
//       })
//     }
//     return inMemoryRooms.get(roomId)
//   }
// }

// // Socket.io connection handling
// io.on("connection", (socket) => {
//   console.log("👤 User connected:", socket.id)

//   // Join room
//   socket.on("join-room", async (data) => {
//     const { roomId, userName } = data
//     console.log(`🚪 ${userName} trying to join room ${roomId}`)

//     try {
//       // Get or create room
//       const room = await getOrCreateRoom(roomId)

//       // Generate user color
//       const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500", "bg-yellow-500", "bg-pink-500"]
//       const userColor = colors[Math.floor(Math.random() * colors.length)]

//       // Add user to room
//       const user = {
//         id: socket.id,
//         name: userName,
//         color: userColor,
//       }

//       // Remove existing user with same name and add new one
//       room.users = room.users.filter((u) => u.name !== userName)
//       room.users.push(user)

//       // Save room if using MongoDB
//       if (mongoose.connection.readyState === 1) {
//         await room.save()
//       }

//       // Join socket room
//       socket.join(roomId)

//       // Store connection info
//       activeConnections.set(socket.id, { roomId, userName, user })

//       // Send current code to user
//       socket.emit("room-joined", {
//         code: room.code,
//         users: room.users,
//       })

//       // Notify others about new user
//       socket.to(roomId).emit("user-joined", { user })

//       console.log(`✅ ${userName} joined room ${roomId}`)
//     } catch (error) {
//       console.error("❌ Error joining room:", error)
//       socket.emit("error", { message: "Failed to join room" })
//     }
//   })

//   // Handle code changes
//   socket.on("code-change", async (data) => {
//     const { roomId, code, userId } = data

//     try {
//       if (mongoose.connection.readyState === 1) {
//         // Update in MongoDB
//         await Room.findOneAndUpdate(
//           { roomId },
//           {
//             code,
//             lastModified: new Date(),
//           },
//         )
//       } else {
//         // Update in memory
//         if (inMemoryRooms.has(roomId)) {
//           const room = inMemoryRooms.get(roomId)
//           room.code = code
//           room.lastModified = new Date()
//         }
//       }

//       // Broadcast to all users in room except sender
//       socket.to(roomId).emit("code-change", {
//         code,
//         userId,
//       })
//     } catch (error) {
//       console.error("❌ Error updating code:", error)
//     }
//   })

//   // Handle disconnect
//   socket.on("disconnect", async () => {
//     console.log("👋 User disconnected:", socket.id)

//     const connectionInfo = activeConnections.get(socket.id)
//     if (connectionInfo) {
//       const { roomId, userName } = connectionInfo

//       try {
//         // Remove user from room
//         if (mongoose.connection.readyState === 1) {
//           await Room.findOneAndUpdate({ roomId }, { $pull: { users: { id: socket.id } } })
//         } else {
//           // Remove from in-memory storage
//           if (inMemoryRooms.has(roomId)) {
//             const room = inMemoryRooms.get(roomId)
//             room.users = room.users.filter(u => u.id !== socket.id)
//           }
//         }

//         // Notify others about user leaving
//         socket.to(roomId).emit("user-left", {
//           userId: socket.id,
//           userName,
//         })

//         activeConnections.delete(socket.id)
//         console.log(`👋 ${userName} left room ${roomId}`)
//       } catch (error) {
//         console.error("❌ Error handling disconnect:", error)
//       }
//     }
//   })
// })

// // REST API endpoints
// app.get("/api/rooms/:roomId", async (req, res) => {
//   try {
//     const room = await getOrCreateRoom(req.params.roomId)
//     res.json(room)
//   } catch (error) {
//     res.status(500).json({ error: "Server error" })
//   }
// })

// app.post("/api/rooms", async (req, res) => {
//   try {
//     const { roomId } = req.body

//     if (mongoose.connection.readyState === 1) {
//       let room = await Room.findOne({ roomId })
//       if (room) {
//         return res.status(400).json({ error: "Room already exists" })
//       }
//       room = new Room({ roomId })
//       await room.save()
//       res.status(201).json(room)
//     } else {
//       if (inMemoryRooms.has(roomId)) {
//         return res.status(400).json({ error: "Room already exists" })
//       }
//       const room = {
//         roomId,
//         code: '// Welcome to CodeSync!\n// Start typing to see real-time collaboration in action\n\nfunction hello() {\n  console.log("Hello, World!");\n}\n\nhello();',
//         users: [],
//         createdAt: new Date(),
//         lastModified: new Date()
//       }
//       inMemoryRooms.set(roomId, room)
//       res.status(201).json(room)
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Server error" })
//   }
// })

// // Health check endpoint
// app.get("/health", (req, res) => {
//   res.json({
//     status: "OK",
//     timestamp: new Date().toISOString(),
//     message: "🚀 CodeSync Backend is running!",
//     activeConnections: activeConnections.size,
//     mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
//     inMemoryRooms: inMemoryRooms.size
//   })
// })

// // Test endpoint
// app.get("/test", (req, res) => {
//   res.json({
//     message: "Backend server is working!",
//     timestamp: new Date().toISOString()
//   })
// })

// const PORT = process.env.PORT || 3001

// server.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`)
//   console.log(`📊 Health check: http://localhost:${PORT}/health`)
//   console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`)
//   console.log(`💡 Root endpoint: http://localhost:${PORT}/`)
//   console.log(`💡 MongoDB status: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Will use in-memory storage'}`)
// })

// // Handle server errors
// server.on('error', (error) => {
//   if (error.code === 'EADDRINUSE') {
//     console.error(`❌ Port ${PORT} is already in use`)
//     console.log(`💡 Try running: npx kill-port ${PORT}`)
//     console.log(`💡 Or use a different port: PORT=3002 npm run dev`)
//   } else {
//     console.error('❌ Server error:', error)
//   }
// })

// const express = require("express")
// const http = require("http")
// const socketIo = require("socket.io")
// const mongoose = require("mongoose")
// const cors = require("cors")

// const app = express()
// const server = http.createServer(app)
// const io = socketIo(server, {
//   cors: {
//     origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// })

// // Middleware
// app.use(
//   cors({
//     origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
//     credentials: true,
//   }),
// )
// app.use(express.json())

// // Add a root route to test if server is working
// app.get("/", (req, res) => {
//   res.json({
//     message: "🚀 TextSync Backend Server is running!",
//     status: "OK",
//     timestamp: new Date().toISOString(),
//     endpoints: {
//       health: "/health",
//       rooms: "/api/rooms",
//       socketio: "Socket.io enabled",
//     },
//   })
// })

// // MongoDB Connection
// mongoose
//   .connect("mongodb://localhost:27017/realtime-text-editor", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("✅ Connected to MongoDB")
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB connection error:", err)
//     console.log("💡 Make sure MongoDB is running on your system")
//     console.log("💡 You can still test the app without MongoDB - it will work with in-memory storage")
//   })

// // Room Schema
// const roomSchema = new mongoose.Schema({
//   roomId: { type: String, required: true, unique: true },
//   text: {
//     type: String,
//     default:
//       "Welcome to TextSync!\nStart typing to see real-time collaboration in action.\n\nThis is a collaborative text editor where multiple users can edit the same document simultaneously.\n\nYou can:\n- Write notes\n- Draft documents\n- Collaborate on text\n- Share ideas\n\nEnjoy writing together!",
//   },
//   users: [
//     {
//       id: String,
//       name: String,
//       color: String,
//       joinedAt: { type: Date, default: Date.now },
//     },
//   ],
//   createdAt: { type: Date, default: Date.now },
//   lastModified: { type: Date, default: Date.now },
// })

// const Room = mongoose.model("Room", roomSchema)

// // In-memory storage as fallback
// const inMemoryRooms = new Map()

// // Store active connections
// const activeConnections = new Map()

// // Helper function to get or create room
// async function getOrCreateRoom(roomId) {
//   try {
//     if (mongoose.connection.readyState === 1) {
//       // MongoDB is connected
//       let room = await Room.findOne({ roomId })
//       if (!room) {
//         room = new Room({ roomId })
//         await room.save()
//       }
//       return room
//     } else {
//       // Use in-memory storage
//       if (!inMemoryRooms.has(roomId)) {
//         inMemoryRooms.set(roomId, {
//           roomId,
//           text: "Welcome to TextSync!\nStart typing to see real-time collaboration in action.\n\nThis is a collaborative text editor where multiple users can edit the same document simultaneously.\n\nYou can:\n- Write notes\n- Draft documents\n- Collaborate on text\n- Share ideas\n\nEnjoy writing together!",
//           users: [],
//           createdAt: new Date(),
//           lastModified: new Date(),
//         })
//       }
//       return inMemoryRooms.get(roomId)
//     }
//   } catch (error) {
//     console.error("Error with room operations:", error)
//     // Fallback to in-memory
//     if (!inMemoryRooms.has(roomId)) {
//       inMemoryRooms.set(roomId, {
//         roomId,
//         text: "Welcome to TextSync!\nStart typing to see real-time collaboration in action.\n\nThis is a collaborative text editor where multiple users can edit the same document simultaneously.\n\nYou can:\n- Write notes\n- Draft documents\n- Collaborate on text\n- Share ideas\n\nEnjoy writing together!",
//         users: [],
//         createdAt: new Date(),
//         lastModified: new Date(),
//       })
//     }
//     return inMemoryRooms.get(roomId)
//   }
// }

// // Socket.io connection handling
// io.on("connection", (socket) => {
//   console.log("👤 User connected:", socket.id)

//   // Join room
//   socket.on("join-room", async (data) => {
//     const { roomId, userName } = data
//     console.log(`🚪 ${userName} trying to join room ${roomId}`)

//     try {
//       // Get or create room
//       const room = await getOrCreateRoom(roomId)

//       // Generate user color
//       const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500", "bg-yellow-500", "bg-pink-500"]
//       const userColor = colors[Math.floor(Math.random() * colors.length)]

//       // Add user to room
//       const user = {
//         id: socket.id,
//         name: userName,
//         color: userColor,
//       }

//       // Remove existing user with same name and add new one
//       room.users = room.users.filter((u) => u.name !== userName)
//       room.users.push(user)

//       // Save room if using MongoDB
//       if (mongoose.connection.readyState === 1) {
//         await room.save()
//       }

//       // Join socket room
//       socket.join(roomId)

//       // Store connection info
//       activeConnections.set(socket.id, { roomId, userName, user })

//       // Send current text to user
//       socket.emit("room-joined", {
//         code: room.text,
//         users: room.users,
//       })

//       // Notify others about new user
//       socket.to(roomId).emit("user-joined", { user })

//       console.log(`✅ ${userName} joined room ${roomId}`)
//     } catch (error) {
//       console.error("❌ Error joining room:", error)
//       socket.emit("error", { message: "Failed to join room" })
//     }
//   })

//   // Handle text changes
//   socket.on("code-change", async (data) => {
//     const { roomId, code, userId } = data

//     try {
//       if (mongoose.connection.readyState === 1) {
//         // Update in MongoDB
//         await Room.findOneAndUpdate(
//           { roomId },
//           {
//             text: code,
//             lastModified: new Date(),
//           },
//         )
//       } else {
//         // Update in memory
//         if (inMemoryRooms.has(roomId)) {
//           const room = inMemoryRooms.get(roomId)
//           room.text = code
//           room.lastModified = new Date()
//         }
//       }

//       // Broadcast to all users in room except sender
//       socket.to(roomId).emit("code-change", {
//         code,
//         userId,
//       })
//     } catch (error) {
//       console.error("❌ Error updating text:", error)
//     }
//   })

//   // Handle disconnect
//   socket.on("disconnect", async () => {
//     console.log("👋 User disconnected:", socket.id)

//     const connectionInfo = activeConnections.get(socket.id)
//     if (connectionInfo) {
//       const { roomId, userName } = connectionInfo

//       try {
//         // Remove user from room
//         if (mongoose.connection.readyState === 1) {
//           await Room.findOneAndUpdate({ roomId }, { $pull: { users: { id: socket.id } } })
//         } else {
//           // Remove from in-memory storage
//           if (inMemoryRooms.has(roomId)) {
//             const room = inMemoryRooms.get(roomId)
//             room.users = room.users.filter((u) => u.id !== socket.id)
//           }
//         }

//         // Notify others about user leaving
//         socket.to(roomId).emit("user-left", {
//           userId: socket.id,
//           userName,
//         })

//         activeConnections.delete(socket.id)
//         console.log(`👋 ${userName} left room ${roomId}`)
//       } catch (error) {
//         console.error("❌ Error handling disconnect:", error)
//       }
//     }
//   })
// })

// // REST API endpoints
// app.get("/api/rooms/:roomId", async (req, res) => {
//   try {
//     const room = await getOrCreateRoom(req.params.roomId)
//     res.json(room)
//   } catch (error) {
//     res.status(500).json({ error: "Server error" })
//   }
// })

// app.post("/api/rooms", async (req, res) => {
//   try {
//     const { roomId } = req.body

//     if (mongoose.connection.readyState === 1) {
//       let room = await Room.findOne({ roomId })
//       if (room) {
//         return res.status(400).json({ error: "Room already exists" })
//       }
//       room = new Room({ roomId })
//       await room.save()
//       res.status(201).json(room)
//     } else {
//       if (inMemoryRooms.has(roomId)) {
//         return res.status(400).json({ error: "Room already exists" })
//       }
//       const room = {
//         roomId,
//         text: "Welcome to TextSync!\nStart typing to see real-time collaboration in action.\n\nThis is a collaborative text editor where multiple users can edit the same document simultaneously.\n\nYou can:\n- Write notes\n- Draft documents\n- Collaborate on text\n- Share ideas\n\nEnjoy writing together!",
//         users: [],
//         createdAt: new Date(),
//         lastModified: new Date(),
//       }
//       inMemoryRooms.set(roomId, room)
//       res.status(201).json(room)
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Server error" })
//   }
// })

// // Health check endpoint
// app.get("/health", (req, res) => {
//   res.json({
//     status: "OK",
//     timestamp: new Date().toISOString(),
//     message: "🚀 TextSync Backend is running!",
//     activeConnections: activeConnections.size,
//     mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
//     inMemoryRooms: inMemoryRooms.size,
//   })
// })

// // Test endpoint
// app.get("/test", (req, res) => {
//   res.json({
//     message: "Backend server is working!",
//     timestamp: new Date().toISOString(),
//   })
// })

// const PORT = process.env.PORT || 3001

// server.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`)
//   console.log(`📊 Health check: http://localhost:${PORT}/health`)
//   console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`)
//   console.log(`💡 Root endpoint: http://localhost:${PORT}/`)
//   console.log(`💡 MongoDB status: ${mongoose.connection.readyState === 1 ? "Connected" : "Will use in-memory storage"}`)
// })

// // Handle server errors
// server.on("error", (error) => {
//   if (error.code === "EADDRINUSE") {
//     console.error(`❌ Port ${PORT} is already in use`)
//     console.log(`💡 Try running: npx kill-port ${PORT}`)
//     console.log(`💡 Or use a different port: PORT=3002 npm run dev`)
//   } else {
//     console.error("❌ Server error:", error)
//   }
// })

const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()
const server = http.createServer(app)

// Get allowed origins from environment variables
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL, // This will be your Vercel URL
].filter(Boolean)

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
})

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
)
app.use(express.json())

// Add a root route to test if server is working
app.get("/", (req, res) => {
  res.json({
    message: "🚀 TextSync Backend Server is running!",
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      health: "/health",
      rooms: "/api/rooms",
      socketio: "Socket.io enabled",
    },
  })
})

// MongoDB Connection - Use environment variable for production
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/realtime-text-editor"

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB")
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err)
    console.log("💡 Using in-memory storage as fallback")
  })

// Room Schema
const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  text: {
    type: String,
    default:
      "",
  },
  users: [
    {
      id: String,
      name: String,
      color: String,
      joinedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  lastModified: { type: Date, default: Date.now },
})

const Room = mongoose.model("Room", roomSchema)

// In-memory storage as fallback
const inMemoryRooms = new Map()

// Store active connections
const activeConnections = new Map()

// Helper function to get or create room
async function getOrCreateRoom(roomId) {
  try {
    if (mongoose.connection.readyState === 1) {
      // MongoDB is connected
      let room = await Room.findOne({ roomId })
      if (!room) {
        room = new Room({ roomId })
        await room.save()
      }
      return room
    } else {
      // Use in-memory storage
      if (!inMemoryRooms.has(roomId)) {
        inMemoryRooms.set(roomId, {
          roomId,
          text: "",
          users: [],
          createdAt: new Date(),
          lastModified: new Date(),
        })
      }
      return inMemoryRooms.get(roomId)
    }
  } catch (error) {
    console.error("Error with room operations:", error)
    // Fallback to in-memory
    if (!inMemoryRooms.has(roomId)) {
      inMemoryRooms.set(roomId, {
        roomId,
        text: "",
        users: [],
        createdAt: new Date(),
        lastModified: new Date(),
      })
    }
    return inMemoryRooms.get(roomId)
  }
}

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("👤 User connected:", socket.id)

  // Join room
  socket.on("join-room", async (data) => {
    const { roomId, userName } = data
    console.log(`🚪 ${userName} trying to join room ${roomId}`)

    try {
      // Get or create room
      const room = await getOrCreateRoom(roomId)

      // Generate user color
      const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500", "bg-yellow-500", "bg-pink-500"]
      const userColor = colors[Math.floor(Math.random() * colors.length)]

      // Add user to room
      const user = {
        id: socket.id,
        name: userName,
        color: userColor,
      }

      // Remove existing user with same name and add new one
      room.users = room.users.filter((u) => u.name !== userName)
      room.users.push(user)

      // Save room if using MongoDB
      if (mongoose.connection.readyState === 1) {
        await room.save()
      }

      // Join socket room
      socket.join(roomId)

      // Store connection info
      activeConnections.set(socket.id, { roomId, userName, user })

      // Send current text to user
      socket.emit("room-joined", {
        code: room.text,
        users: room.users,
      })

      // Notify others about new user
      socket.to(roomId).emit("user-joined", { user })

      console.log(`✅ ${userName} joined room ${roomId}`)
    } catch (error) {
      console.error("❌ Error joining room:", error)
      socket.emit("error", { message: "Failed to join room" })
    }
  })

  // Handle text changes
  socket.on("code-change", async (data) => {
    const { roomId, code, userId } = data

    try {
      if (mongoose.connection.readyState === 1) {
        // Update in MongoDB
        await Room.findOneAndUpdate(
          { roomId },
          {
            text: code,
            lastModified: new Date(),
          },
        )
      } else {
        // Update in memory
        if (inMemoryRooms.has(roomId)) {
          const room = inMemoryRooms.get(roomId)
          room.text = code
          room.lastModified = new Date()
        }
      }

      // Broadcast to all users in room except sender
      socket.to(roomId).emit("code-change", {
        code,
        userId,
      })
    } catch (error) {
      console.error("❌ Error updating text:", error)
    }
  })

  // Handle disconnect
  socket.on("disconnect", async () => {
    console.log("👋 User disconnected:", socket.id)

    const connectionInfo = activeConnections.get(socket.id)
    if (connectionInfo) {
      const { roomId, userName } = connectionInfo

      try {
        // Remove user from room
        if (mongoose.connection.readyState === 1) {
          await Room.findOneAndUpdate({ roomId }, { $pull: { users: { id: socket.id } } })
        } else {
          // Remove from in-memory storage
          if (inMemoryRooms.has(roomId)) {
            const room = inMemoryRooms.get(roomId)
            room.users = room.users.filter((u) => u.id !== socket.id)
          }
        }

        // Notify others about user leaving
        socket.to(roomId).emit("user-left", {
          userId: socket.id,
          userName,
        })

        activeConnections.delete(socket.id)
        console.log(`👋 ${userName} left room ${roomId}`)
      } catch (error) {
        console.error("❌ Error handling disconnect:", error)
      }
    }
  })
})

// REST API endpoints
app.get("/api/rooms/:roomId", async (req, res) => {
  try {
    const room = await getOrCreateRoom(req.params.roomId)
    res.json(room)
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

app.post("/api/rooms", async (req, res) => {
  try {
    const { roomId } = req.body

    if (mongoose.connection.readyState === 1) {
      let room = await Room.findOne({ roomId })
      if (room) {
        return res.status(400).json({ error: "Room already exists" })
      }
      room = new Room({ roomId })
      await room.save()
      res.status(201).json(room)
    } else {
      if (inMemoryRooms.has(roomId)) {
        return res.status(400).json({ error: "Room already exists" })
      }
      const room = {
        roomId,
        text: "",
        users: [],
        createdAt: new Date(),
        lastModified: new Date(),
      }
      inMemoryRooms.set(roomId, room)
      res.status(201).json(room)
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" })
  }
})

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    message: "🚀 TextSync Backend is running!",
    activeConnections: activeConnections.size,
    mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    inMemoryRooms: inMemoryRooms.size,
    environment: process.env.NODE_ENV || "development",
  })
})

// Test endpoint
app.get("/test", (req, res) => {
  res.json({
    message: "Backend server is working!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`)
  console.log(`💡 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`💡 MongoDB status: ${mongoose.connection.readyState === 1 ? "Connected" : "Will use in-memory storage"}`)
})

// Handle server errors
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use`)
  } else {
    console.error("❌ Server error:", error)
  }
})
