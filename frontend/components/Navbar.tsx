"use client"

import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import type React from "react"

// Removed DropdownMenu import

const TeamDropdown = () => {
  return (
    <div className="relative group">
      <button className="text-white hover:text-heliotrope transition-colors focus:outline-none">
        Teams <ChevronDown className="inline-block ml-1" size={16} />
      </button>
      <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-russian-violet-2 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          {IPL_TEAMS.map((team) => (
            <Link
              key={team.id}
              href={team.path}
              className="block px-4 py-2 text-sm text-white hover:bg-french-violet hover:text-white"
              role="menuitem"
            >
              {team.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

interface NavbarProps {
  isHomePage?: boolean
}

const IPL_TEAMS = [
  { id: "csk", name: "Chennai Super Kings", path: "/team/csk" },
  { id: "dc", name: "Delhi Capitals", path: "/team/dc" },
  { id: "gt", name: "Gujarat Titans", path: "/team/gt" },
  { id: "kkr", name: "Kolkata Knight Riders", path: "/team/kkr" },
  { id: "lsg", name: "Lucknow Super Giants", path: "/team/lsg" },
  { id: "mi", name: "Mumbai Indians", path: "/team/mi" },
  { id: "pbks", name: "Punjab Kings", path: "/team/pbks" },
  { id: "rcb", name: "Royal Challengers Bangalore", path: "/team/rcb" },
  { id: "rr", name: "Rajasthan Royals", path: "/team/rr" },
  { id: "srh", name: "Sunrisers Hyderabad", path: "/team/srh" },
]

const Navbar: React.FC<NavbarProps> = ({ isHomePage = false }) => {
  const router = useRouter()

  const handleLogout = () => {
    // Add any logout logic here (clearing tokens, etc.)
    router.push("/login")
  }

  return (
    <nav className="sticky top-0 z-50 bg-russian-violet-2 bg-opacity-80 backdrop-filter backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-heliotrope">
          IPL Auction
        </Link>
        {isHomePage ? (
          <Link
            href="/signup"
            className="bg-tekhelet hover:bg-french-violet text-white px-4 py-2 rounded transition-colors"
          >
            Sign In
          </Link>
        ) : (
          <>
            <div className="hidden md:flex space-x-4 items-center">
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/search">Search</NavLink>
              <NavLink href="/leaderboard">Leaderboard</NavLink>
              <NavLink href="/calculator">Calculator</NavLink>
              <TeamDropdown />
            </div>
            <button
              onClick={handleLogout}
              className="bg-tekhelet hover:bg-french-violet text-white px-4 py-2 rounded transition-colors"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-white hover:text-heliotrope transition-colors">
    {children}
  </Link>
)

export default Navbar

