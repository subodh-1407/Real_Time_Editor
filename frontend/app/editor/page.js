// "use client"

// import { useState, useEffect, useRef, Suspense } from "react"
// import { useSearchParams, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Users, Copy, Check, Home, Download, Play, AlertCircle } from "lucide-react"
// import io from "socket.io-client"

// function EditorContent() {
//   const searchParams = useSearchParams()
//   const router = useRouter()
//   const [code, setCode] = useState(
//     '// Welcome to CodeSync!\n// Start typing to see real-time collaboration in action\n\nfunction hello() {\n  console.log("Hello, World!");\n}\n\nhello();',
//   )
//   const [users, setUsers] = useState([])
//   const [isConnected, setIsConnected] = useState(false)
//   const [connectionError, setConnectionError] = useState("")
//   const [copied, setCopied] = useState(false)
//   const socketRef = useRef(null)
//   const textareaRef = useRef(null)

//   const roomId = searchParams.get("room") || ""
//   const userName = searchParams.get("user") || ""

//   useEffect(() => {
//     if (!roomId || !userName) {
//       router.push("/")
//       return
//     }

//     console.log("Attempting to connect to backend...")

//     // Initialize Socket.io connection with better error handling
//     socketRef.current = io("http://localhost:3001", {
//       transports: ["websocket", "polling"],
//       timeout: 5000,
//       forceNew: true,
//     })

//     socketRef.current.on("connect", () => {
//       setIsConnected(true)
//       setConnectionError("")
//       console.log("✅ Connected to server")

//       // Join room
//       socketRef.current.emit("join-room", { roomId, userName })
//     })

//     socketRef.current.on("connect_error", (error) => {
//       setIsConnected(false)
//       setConnectionError("Failed to connect to backend server")
//       console.error("❌ Connection error:", error)
//       console.log("💡 Make sure the backend server is running on http://localhost:3001")
//     })

//     socketRef.current.on("room-joined", (data) => {
//       setCode(data.code)
//       setUsers(data.users)
//       console.log("✅ Joined room successfully")
//     })

//     socketRef.current.on("code-change", (data) => {
//       setCode(data.code)
//     })

//     socketRef.current.on("user-joined", (data) => {
//       setUsers((prev) => [...prev, data.user])
//       console.log(`👤 ${data.user.name} joined the room`)
//     })

//     socketRef.current.on("user-left", (data) => {
//       setUsers((prev) => prev.filter((u) => u.id !== data.userId))
//       console.log(`👋 ${data.userName} left the room`)
//     })

//     socketRef.current.on("disconnect", () => {
//       setIsConnected(false)
//       console.log("❌ Disconnected from server")
//     })

//     socketRef.current.on("error", (error) => {
//       console.error("Socket error:", error)
//       setConnectionError("Socket connection error: " + error.message)
//     })

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect()
//       }
//     }
//   }, [roomId, userName, router])

//   const handleCodeChange = (newCode) => {
//     setCode(newCode)
//     if (socketRef.current && isConnected) {
//       socketRef.current.emit("code-change", {
//         roomId,
//         code: newCode,
//         userId: socketRef.current.id,
//       })
//     }
//   }

//   const copyRoomId = () => {
//     navigator.clipboard.writeText(roomId)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2000)
//   }

//   const runCode = () => {
//     try {
//       // Create a new function and execute the code
//       const func = new Function(code)
//       func()
//       alert("Code executed! Check the browser console for output.")
//     } catch (error) {
//       alert(`Error: ${error.message}`)
//     }
//   }

//   const downloadCode = () => {
//     const blob = new Blob([code], { type: "text/javascript" })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = `code-${roomId}.js`
//     a.click()
//     URL.revokeObjectURL(url)
//   }

//   const testBackendConnection = async () => {
//     try {
//       const response = await fetch("http://localhost:3001/test")
//       const data = await response.json()
//       alert("Backend connection successful: " + data.message)
//     } catch (error) {
//       alert("Backend connection failed: " + error.message)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center space-x-4">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => router.push("/")}
//                 className="text-gray-600 hover:text-gray-900"
//               >
//                 <Home className="w-4 h-4 mr-2" />
//                 Home
//               </Button>
//               <div className="h-6 w-px bg-gray-300" />
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm text-gray-600">Room:</span>
//                 <Badge
//                   variant="secondary"
//                   className="cursor-pointer hover:bg-gray-200 transition-colors"
//                   onClick={copyRoomId}
//                 >
//                   {roomId}
//                   {copied ? <Check className="w-3 h-3 ml-1 text-green-600" /> : <Copy className="w-3 h-3 ml-1" />}
//                 </Badge>
//               </div>
//             </div>

//             <div className="flex items-center space-x-4">
//               {/* Connection Status */}
//               <div className="flex items-center space-x-2">
//                 <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
//                 <span className="text-sm text-gray-600">{isConnected ? "Connected" : "Disconnected"}</span>
//                 {!isConnected && (
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={testBackendConnection}
//                     className="text-orange-600 border-orange-200 hover:bg-orange-50 bg-transparent"
//                   >
//                     <AlertCircle className="w-4 h-4 mr-2" />
//                     Test Backend
//                   </Button>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={runCode}
//                 className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
//               >
//                 <Play className="w-4 h-4 mr-2" />
//                 Run
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={downloadCode}
//                 className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
//               >
//                 <Download className="w-4 h-4 mr-2" />
//                 Download
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Connection Error Banner */}
//       {connectionError && (
//         <div className="bg-red-50 border-l-4 border-red-400 p-4">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <AlertCircle className="h-5 w-5 text-red-400" />
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-red-700">{connectionError}</p>
//               <p className="text-xs text-red-600 mt-1">
//                 Make sure the backend server is running: <code>cd backend && npm run dev</code>
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Active Users Sidebar */}
//           <div className="lg:col-span-1">
//             <Card className="shadow-sm">
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-lg flex items-center">
//                   <Users className="w-5 h-5 mr-2 text-blue-600" />
//                   Active Users ({users.length})
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 {users.length === 0 ? (
//                   <p className="text-sm text-gray-500 text-center py-4">
//                     {isConnected ? "No users connected" : "Connecting..."}
//                   </p>
//                 ) : (
//                   users.map((user) => (
//                     <div
//                       key={user.id}
//                       className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                       <Avatar className="w-8 h-8">
//                         <AvatarFallback className={`${user.color} text-white text-xs`}>
//                           {user.name.charAt(0).toUpperCase()}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-medium text-gray-900 truncate">
//                           {user.name}
//                           {user.name === userName && <span className="text-xs text-gray-500 ml-1">(You)</span>}
//                         </p>
//                         <div className="flex items-center space-x-1">
//                           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//                           <span className="text-xs text-gray-500">Online</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Code Editor */}
//           <div className="lg:col-span-3">
//             <Card className="shadow-sm h-[calc(100vh-200px)]">
//               <CardHeader className="pb-3">
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="text-lg">Code Editor</CardTitle>
//                   <div className="flex items-center space-x-2">
//                     <Badge variant="outline" className="text-xs">
//                       JavaScript
//                     </Badge>
//                     <Badge
//                       variant="outline"
//                       className={`text-xs ${isConnected ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
//                     >
//                       {isConnected ? "Live" : "Offline"}
//                     </Badge>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="p-0 h-full">
//                 <div className="relative h-full">
//                   <textarea
//                     ref={textareaRef}
//                     value={code}
//                     onChange={(e) => handleCodeChange(e.target.value)}
//                     className="w-full h-full p-4 font-mono text-sm border-0 resize-none focus:outline-none focus:ring-0"
//                     placeholder="Start typing your code here..."
//                     style={{
//                       minHeight: "calc(100vh - 280px)",
//                       background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
//                       color: "#00ff88",
//                       caretColor: "#00ff88",
//                     }}
//                   />

//                   {/* Line numbers overlay */}
//                   <div className="absolute left-0 top-0 p-4 pointer-events-none select-none font-mono text-sm text-gray-600">
//                     {code.split("\n").map((_, index) => (
//                       <div key={index} className="leading-6">
//                         {index + 1}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function EditorPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//           <div className="text-center">
//             <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//             <p className="text-gray-600">Loading editor...</p>
//           </div>
//         </div>
//       }
//     >
//       <EditorContent />
//     </Suspense>
//   )
// }


// "use client"

// import { useState, useEffect, useRef, Suspense } from "react"
// import { useSearchParams, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Users, Copy, Check, Home, Download, AlertCircle } from "lucide-react"
// import io from "socket.io-client"

// function EditorContent() {
//   const searchParams = useSearchParams()
//   const router = useRouter()
//   const [text, setText] = useState(
//     "Welcome to TextSync!\nStart typing to see real-time collaboration in action.\n\nThis is a collaborative text editor where multiple users can edit the same document simultaneously.\n\nYou can:\n- Write notes\n- Draft documents\n- Collaborate on text\n- Share ideas\n\nEnjoy writing together!",
//   )
//   const [users, setUsers] = useState([])
//   const [isConnected, setIsConnected] = useState(false)
//   const [connectionError, setConnectionError] = useState("")
//   const [copied, setCopied] = useState(false)
//   const socketRef = useRef(null)
//   const textareaRef = useRef(null)

//   const roomId = searchParams.get("room") || ""
//   const userName = searchParams.get("user") || ""

//   useEffect(() => {
//     if (!roomId || !userName) {
//       router.push("/")
//       return
//     }

//     console.log("Attempting to connect to backend...")

//     // Initialize Socket.io connection with better error handling
//     socketRef.current = io("http://localhost:3001", {
//       transports: ["websocket", "polling"],
//       timeout: 5000,
//       forceNew: true,
//     })

//     socketRef.current.on("connect", () => {
//       setIsConnected(true)
//       setConnectionError("")
//       console.log("✅ Connected to server")

//       // Join room
//       socketRef.current.emit("join-room", { roomId, userName })
//     })

//     socketRef.current.on("connect_error", (error) => {
//       setIsConnected(false)
//       setConnectionError("Failed to connect to backend server")
//       console.error("❌ Connection error:", error)
//       console.log("💡 Make sure the backend server is running on http://localhost:3001")
//     })

//     socketRef.current.on("room-joined", (data) => {
//       setText(data.code)
//       setUsers(data.users)
//       console.log("✅ Joined room successfully")
//     })

//     socketRef.current.on("code-change", (data) => {
//       setText(data.code)
//     })

//     socketRef.current.on("user-joined", (data) => {
//       setUsers((prev) => [...prev, data.user])
//       console.log(`👤 ${data.user.name} joined the room`)
//     })

//     socketRef.current.on("user-left", (data) => {
//       setUsers((prev) => prev.filter((u) => u.id !== data.userId))
//       console.log(`👋 ${data.userName} left the room`)
//     })

//     socketRef.current.on("disconnect", () => {
//       setIsConnected(false)
//       console.log("❌ Disconnected from server")
//     })

//     socketRef.current.on("error", (error) => {
//       console.error("Socket error:", error)
//       setConnectionError("Socket connection error: " + error.message)
//     })

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect()
//       }
//     }
//   }, [roomId, userName, router])

//   const handleTextChange = (newText) => {
//     setText(newText)
//     if (socketRef.current && isConnected) {
//       socketRef.current.emit("code-change", {
//         roomId,
//         code: newText,
//         userId: socketRef.current.id,
//       })
//     }
//   }

//   const copyRoomId = () => {
//     navigator.clipboard.writeText(roomId)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2000)
//   }

//   const downloadText = () => {
//     const blob = new Blob([text], { type: "text/plain" })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = `document-${roomId}.txt`
//     a.click()
//     URL.revokeObjectURL(url)
//   }

//   const testBackendConnection = async () => {
//     try {
//       const response = await fetch("http://localhost:3001/test")
//       const data = await response.json()
//       alert("Backend connection successful: " + data.message)
//     } catch (error) {
//       alert("Backend connection failed: " + error.message)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center space-x-4">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => router.push("/")}
//                 className="text-gray-600 hover:text-gray-900"
//               >
//                 <Home className="w-4 h-4 mr-2" />
//                 Home
//               </Button>
//               <div className="h-6 w-px bg-gray-300" />
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm text-gray-600">Room:</span>
//                 <Badge
//                   variant="secondary"
//                   className="cursor-pointer hover:bg-gray-200 transition-colors"
//                   onClick={copyRoomId}
//                 >
//                   {roomId}
//                   {copied ? <Check className="w-3 h-3 ml-1 text-green-600" /> : <Copy className="w-3 h-3 ml-1" />}
//                 </Badge>
//               </div>
//             </div>

//             <div className="flex items-center space-x-4">
//               {/* Connection Status */}
//               <div className="flex items-center space-x-2">
//                 <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
//                 <span className="text-sm text-gray-600">{isConnected ? "Connected" : "Disconnected"}</span>
//                 {!isConnected && (
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={testBackendConnection}
//                     className="text-orange-600 border-orange-200 hover:bg-orange-50 bg-transparent"
//                   >
//                     <AlertCircle className="w-4 h-4 mr-2" />
//                     Test Backend
//                   </Button>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={downloadText}
//                 className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
//               >
//                 <Download className="w-4 h-4 mr-2" />
//                 Download
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Connection Error Banner */}
//       {connectionError && (
//         <div className="bg-red-50 border-l-4 border-red-400 p-4">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <AlertCircle className="h-5 w-5 text-red-400" />
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-red-700">{connectionError}</p>
//               <p className="text-xs text-red-600 mt-1">
//                 Make sure the backend server is running: <code>cd backend && npm run dev</code>
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Active Users Sidebar */}
//           <div className="lg:col-span-1">
//             <Card className="shadow-sm">
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-lg flex items-center">
//                   <Users className="w-5 h-5 mr-2 text-blue-600" />
//                   Active Users ({users.length})
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 {users.length === 0 ? (
//                   <p className="text-sm text-gray-500 text-center py-4">
//                     {isConnected ? "No users connected" : "Connecting..."}
//                   </p>
//                 ) : (
//                   users.map((user) => (
//                     <div
//                       key={user.id}
//                       className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                       <Avatar className="w-8 h-8">
//                         <AvatarFallback className={`${user.color} text-white text-xs`}>
//                           {user.name.charAt(0).toUpperCase()}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-medium text-gray-900 truncate">
//                           {user.name}
//                           {user.name === userName && <span className="text-xs text-gray-500 ml-1">(You)</span>}
//                         </p>
//                         <div className="flex items-center space-x-1">
//                           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//                           <span className="text-xs text-gray-500">Online</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Text Editor */}
//           <div className="lg:col-span-3">
//             <Card className="shadow-sm h-[calc(100vh-200px)]">
//               <CardHeader className="pb-3">
//                 <div className="flex items-center justify-between">
//                   <CardTitle className="text-lg">Text Editor</CardTitle>
//                   <div className="flex items-center space-x-2">
//                     <Badge variant="outline" className="text-xs">
//                       Plain Text
//                     </Badge>
//                     <Badge
//                       variant="outline"
//                       className={`text-xs ${isConnected ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
//                     >
//                       {isConnected ? "Live" : "Offline"}
//                     </Badge>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="p-0 h-full">
//                 <div className="relative h-full">
//                   <textarea
//                     ref={textareaRef}
//                     value={text}
//                     onChange={(e) => handleTextChange(e.target.value)}
//                     className="w-full h-full p-6 text-base border-0 resize-none focus:outline-none focus:ring-0 bg-white text-gray-800 leading-relaxed"
//                     placeholder="Start typing your text here..."
//                     style={{
//                       minHeight: "calc(100vh - 280px)",
//                       fontFamily: "system-ui, -apple-system, sans-serif",
//                       lineHeight: "1.6",
//                     }}
//                   />
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default function EditorPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//           <div className="text-center">
//             <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//             <p className="text-gray-600">Loading editor...</p>
//           </div>
//         </div>
//       }
//     >
//       <EditorContent />
//     </Suspense>
//   )
// }
"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Copy, Check, Home, Download, AlertCircle } from "lucide-react"
import io from "socket.io-client"

function EditorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [text, setText] = useState(
    "Welcome to TextSync!\nStart typing to see real-time collaboration in action.\n\nThis is a collaborative text editor where multiple users can edit the same document simultaneously.\n\nYou can:\n- Write notes\n- Draft documents\n- Collaborate on text\n- Share ideas\n\nEnjoy writing together!",
  )
  const [users, setUsers] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState("")
  const [copied, setCopied] = useState(false)
  const socketRef = useRef(null)
  const textareaRef = useRef(null)

  const roomId = searchParams.get("room") || ""
  const userName = searchParams.get("user") || ""

  // Get backend URL from environment or use localhost for development
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

  useEffect(() => {
    if (!roomId || !userName) {
      router.push("/")
      return
    }

    console.log("Attempting to connect to backend:", BACKEND_URL)

    // Initialize Socket.io connection with better error handling
    socketRef.current = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
      timeout: 5000,
      forceNew: true,
    })

    socketRef.current.on("connect", () => {
      setIsConnected(true)
      setConnectionError("")
      console.log("✅ Connected to server")

      // Join room
      socketRef.current.emit("join-room", { roomId, userName })
    })

    socketRef.current.on("connect_error", (error) => {
      setIsConnected(false)
      setConnectionError("Failed to connect to backend server")
      console.error("❌ Connection error:", error)
      console.log("💡 Make sure the backend server is running")
    })

    socketRef.current.on("room-joined", (data) => {
      setText(data.code)
      setUsers(data.users)
      console.log("✅ Joined room successfully")
    })

    socketRef.current.on("code-change", (data) => {
      setText(data.code)
    })

    socketRef.current.on("user-joined", (data) => {
      setUsers((prev) => [...prev, data.user])
      console.log(`👤 ${data.user.name} joined the room`)
    })

    socketRef.current.on("user-left", (data) => {
      setUsers((prev) => prev.filter((u) => u.id !== data.userId))
      console.log(`👋 ${data.userName} left the room`)
    })

    socketRef.current.on("disconnect", () => {
      setIsConnected(false)
      console.log("❌ Disconnected from server")
    })

    socketRef.current.on("error", (error) => {
      console.error("Socket error:", error)
      setConnectionError("Socket connection error: " + error.message)
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [roomId, userName, router, BACKEND_URL])

  const handleTextChange = (newText) => {
    setText(newText)
    if (socketRef.current && isConnected) {
      socketRef.current.emit("code-change", {
        roomId,
        code: newText,
        userId: socketRef.current.id,
      })
    }
  }

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadText = () => {
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `document-${roomId}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const testBackendConnection = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/test`)
      const data = await response.json()
      alert("Backend connection successful: " + data.message)
    } catch (error) {
      alert("Backend connection failed: " + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="text-gray-600 hover:text-gray-900"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Room:</span>
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={copyRoomId}
                >
                  {roomId}
                  {copied ? <Check className="w-3 h-3 ml-1 text-green-600" /> : <Copy className="w-3 h-3 ml-1" />}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-sm text-gray-600">{isConnected ? "Connected" : "Disconnected"}</span>
                {!isConnected && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={testBackendConnection}
                    className="text-orange-600 border-orange-200 hover:bg-orange-50 bg-transparent"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Test Backend
                  </Button>
                )}
              </div>

              {/* Action Buttons */}
              <Button
                variant="outline"
                size="sm"
                onClick={downloadText}
                className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Connection Error Banner */}
      {connectionError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{connectionError}</p>
              <p className="text-xs text-red-600 mt-1">Backend URL: {BACKEND_URL}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Active Users Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Active Users ({users.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {users.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    {isConnected ? "No users connected" : "Connecting..."}
                  </p>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={`${user.color} text-white text-xs`}>
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                          {user.name === userName && <span className="text-xs text-gray-500 ml-1">(You)</span>}
                        </p>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-xs text-gray-500">Online</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Text Editor */}
          <div className="lg:col-span-3">
            <Card className="shadow-sm h-[calc(100vh-200px)]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Text Editor</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      Plain Text
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${isConnected ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                    >
                      {isConnected ? "Live" : "Offline"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-full">
                <div className="relative h-full">
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="w-full h-full p-6 text-base border-0 resize-none focus:outline-none focus:ring-0 bg-white text-gray-800 leading-relaxed"
                    placeholder="Start typing your text here..."
                    style={{
                      minHeight: "calc(100vh - 280px)",
                      fontFamily: "system-ui, -apple-system, sans-serif",
                      lineHeight: "1.6",
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading editor...</p>
          </div>
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  )
}
