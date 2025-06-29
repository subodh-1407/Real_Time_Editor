// import { Inter } from "next/font/google"
// import "./globals.css"

// const inter = Inter({ subsets: ["latin"] })

// export const metadata = {
//   title: "CodeSync - Real-time Collaborative Editor",
//   description: "A beautiful real-time collaborative code editor built with React and Node.js",
// }

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>{children}</body>
//     </html>
//   )
// }
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "TextSync - Real-time Collaborative Text Editor",
  description: "A beautiful real-time collaborative text editor built with React and Node.js",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
