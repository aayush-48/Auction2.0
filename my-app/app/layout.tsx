import "./globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import ClientLayout from "./ClientLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Oculus IPL Auction",
  description: "Build Your Dream Team & Compete to Win in the Oculus IPL Auction!",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-br from-russian-violet to-russian-violet-2 min-h-screen text-white`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

