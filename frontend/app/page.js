// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Users, FileText, Plus, ArrowRight } from "lucide-react"

// export default function HomePage() {
//   const [userName, setUserName] = useState("")
//   const [roomId, setRoomId] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()

//   const handleJoinRoom = async () => {
//     if (!userName.trim() || !roomId.trim()) {
//       alert("Please enter both username and room ID")
//       return
//     }

//     setIsLoading(true)

//     // Simulate API call delay
//     setTimeout(() => {
//       router.push(`/editor?room=${roomId}&user=${userName}`)
//     }, 1000)
//   }

//   const handleCreateRoom = async () => {
//     if (!userName.trim()) {
//       alert("Please enter your username")
//       return
//     }

//     setIsLoading(true)

//     // Generate random room ID
//     const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase()

//     setTimeout(() => {
//       router.push(`/editor?room=${newRoomId}&user=${userName}`)
//     }, 1000)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md space-y-8 animate-in fade-in-0 duration-1000">
//         {/* Header */}
//         <div className="text-center space-y-4">
//           <div className="flex justify-center">
//             <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg animate-pulse">
//               <FileText className="w-8 h-8 text-white" />
//             </div>
//           </div>
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             CodeSync
//           </h1>
//           <p className="text-gray-600 text-lg">Real-time collaborative code editor</p>
//         </div>

//         {/* Main Card */}
//         <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
//           <CardHeader className="text-center pb-4">
//             <CardTitle className="text-2xl text-gray-800">Get Started</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {/* Username Input */}
//             <div className="space-y-2">
//               <Label htmlFor="username" className="text-sm font-medium text-gray-700">
//                 Your Name
//               </Label>
//               <div className="relative">
//                 <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
//                 <Input
//                   id="username"
//                   type="text"
//                   placeholder="Enter your name"
//                   value={userName}
//                   onChange={(e) => setUserName(e.target.value)}
//                   className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
//                 />
//               </div>
//             </div>

//             {/* Room ID Input */}
//             <div className="space-y-2">
//               <Label htmlFor="roomId" className="text-sm font-medium text-gray-700">
//                 Room ID (Optional)
//               </Label>
//               <Input
//                 id="roomId"
//                 type="text"
//                 placeholder="Enter room ID to join existing room"
//                 value={roomId}
//                 onChange={(e) => setRoomId(e.target.value.toUpperCase())}
//                 className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
//               />
//             </div>

//             {/* Action Buttons */}
//             <div className="space-y-3 pt-4">
//               <Button
//                 onClick={handleJoinRoom}
//                 disabled={isLoading}
//                 className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center space-x-2">
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     <span>Joining...</span>
//                   </div>
//                 ) : (
//                   <div className="flex items-center space-x-2">
//                     <ArrowRight className="w-4 h-4" />
//                     <span>Join Room</span>
//                   </div>
//                 )}
//               </Button>

//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-200" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-4 bg-white text-gray-500">or</span>
//                 </div>
//               </div>

//               <Button
//                 onClick={handleCreateRoom}
//                 disabled={isLoading}
//                 variant="outline"
//                 className="w-full h-12 border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 font-medium rounded-lg transition-all duration-200 transform hover:scale-105 bg-transparent"
//               >
//                 <div className="flex items-center space-x-2">
//                   <Plus className="w-4 h-4" />
//                   <span>Create New Room</span>
//                 </div>
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Features */}
//         <div className="grid grid-cols-2 gap-4 text-center">
//           <div className="p-4 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm">
//             <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
//               <Users className="w-4 h-4 text-blue-600" />
//             </div>
//             <p className="text-sm text-gray-600">Real-time Collaboration</p>
//           </div>
//           <div className="p-4 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm">
//             <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
//               <FileText className="w-4 h-4 text-purple-600" />
//             </div>
//             <p className="text-sm text-gray-600">Live Code Editing</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Users, FileText, Plus, ArrowRight } from "lucide-react"

export default function HomePage() {
  const [userName, setUserName] = useState("")
  const [roomId, setRoomId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleJoinRoom = async () => {
    if (!userName.trim() || !roomId.trim()) {
      alert("Please enter both username and room ID")
      return
    }

    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      router.push(`/editor?room=${roomId}&user=${userName}`)
    }, 1000)
  }

  const handleCreateRoom = async () => {
    if (!userName.trim()) {
      alert("Please enter your username")
      return
    }

    setIsLoading(true)

    // Generate random room ID
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase()

    setTimeout(() => {
      router.push(`/editor?room=${newRoomId}&user=${userName}`)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-in fade-in-0 duration-1000">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg animate-pulse">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TextSync
          </h1>
          <p className="text-gray-600 text-lg">Real-time collaborative text editor</p>
        </div>

        {/* Main Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-gray-800">Get Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                Your Name
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Room ID Input */}
            <div className="space-y-2">
              <Label htmlFor="roomId" className="text-sm font-medium text-gray-700">
                Room ID (Optional)
              </Label>
              <Input
                id="roomId"
                type="text"
                placeholder="Enter room ID to join existing room"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={handleJoinRoom}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Joining...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4" />
                    <span>Join Room</span>
                  </div>
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>

              <Button
                onClick={handleCreateRoom}
                disabled={isLoading}
                variant="outline"
                className="w-full h-12 border-2 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 font-medium rounded-lg transition-all duration-200 transform hover:scale-105 bg-transparent"
              >
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Create New Room</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Real-time Collaboration</p>
          </div>
          <div className="p-4 bg-white/60 backdrop-blur-sm rounded-lg shadow-sm">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FileText className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Live Text Editing</p>
          </div>
        </div>
      </div>
    </div>
  )
}
