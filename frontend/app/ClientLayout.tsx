"use client"

import Navbar from "../components/Navbar"
//import Footer from "../components/Footer"
import { AuctionProvider } from "../context/AuctionContext"
import type React from "react"
import { usePathname } from "next/navigation"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginOrAdminPage = pathname === "/login" || pathname === "/admin"

  return (
    <AuctionProvider>
      {!isLoginOrAdminPage && <Navbar />}
      <main>{children}</main>
      {!isLoginOrAdminPage }
    </AuctionProvider>
  )
}

