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

import { Suspense, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowRight, Plus } from "lucide-react"
import { Brand } from "./brand"

function HomePageContent({ invitedRoom = "" }) {
  const [userName, setUserName] = useState("")
  const [roomId, setRoomId] = useState(invitedRoom)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function openRoom(event) {
    event.preventDefault()
    const create = event.nativeEvent.submitter?.value === "create"
    const user = userName.trim()
    const room = create ? Math.random().toString(36).slice(2, 8).toUpperCase() : roomId.trim()

    if (!user || !room) {
      setError(!user ? "Enter your name to continue." : "Enter a room ID to join.")
      event.currentTarget.elements.namedItem(!user ? "username" : "roomId").focus()
      return
    }

    setError("")
    const query = new URLSearchParams({ room, user })
    startTransition(() => router.push("/editor?" + query))
  }

  return (
    <main className="home-shell">
      <div className="home-layout">
        <section aria-labelledby="home-title">
          <Brand />
          <h1 id="home-title" className="home-title">Write code <span className="text-primary">together.</span></h1>
          <p className="home-description">Create a room or join one with a room ID to edit code and text together in real time.</p>
        </section>

        <Card className="room-form">
          <CardHeader className="pb-4">
            <h2 className="text-xl font-semibold tracking-tight">{invitedRoom ? "Join the shared room" : "Enter a room"}</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={openRoom} noValidate className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username">Your name</Label>
                <Input
                  id="username"
                  name="username"
                  autoComplete="nickname"
                  required
                  placeholder="e.g. Alex"
                  value={userName}
                  onChange={(event) => setUserName(event.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomId">Room ID</Label>
                <Input
                  id="roomId"
                  name="roomId"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="Required to join an existing room"
                  value={roomId}
                  onChange={(event) => setRoomId(event.target.value.toUpperCase())}
                  className="h-11"
                />
              </div>

              {error && <p role="alert" className="text-sm text-[var(--danger)]">{error}</p>}
              <div className="grid gap-2.5 pt-1">
                <Button type="submit" value="join" variant={invitedRoom ? "default" : "outline"} className="h-11 gap-2" disabled={isPending}>
                  Join room <ArrowRight size={16} aria-hidden="true" />
                </Button>
                <Button type="submit" value="create" variant={invitedRoom ? "outline" : "default"} className="h-11 gap-2" disabled={isPending}>
                  <Plus size={16} aria-hidden="true" /> Create room
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function HomeWithInvite() {
  const invitedRoom = useSearchParams().get("room") || ""
  return <HomePageContent key={invitedRoom} invitedRoom={invitedRoom} />
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomePageContent />}>
      <HomeWithInvite />
    </Suspense>
  )
}
