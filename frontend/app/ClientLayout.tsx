"use client"

import Navbar from "../components/Navbar"

import { AuctionProvider } from "../context/AuctionContext"
import type React from "react"
import { usePathname } from "next/navigation"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  return (
    <AuctionProvider>
      {!isLoginPage && <Navbar />}
      <main>{children}</main>
      {!isLoginPage }
    </AuctionProvider>
  )
}

