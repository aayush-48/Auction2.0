"use client";

import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";

const TeamDropdown = () => {
  return (
    <div className="relative group">
      <button className="text-white hover:text-heliotrope transition-colors focus:outline-none">
        Teams <ChevronDown className="inline-block ml-1" size={16} />
      </button>
      <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-russian-violet-2 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50">
        <div
          className="py-1"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
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
  );
};

interface NavbarProps {
  isHomePage?: boolean;
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
];

const Navbar: React.FC<NavbarProps> = ({ isHomePage = false }) => {
  const [submitted, setSubmitted] = useState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    setSubmitted(localStorage.getItem("userScore"));
  }, []);

  const router = useRouter();

  const handleLogout = () => {
    // Add any logout logic here (clearing tokens, etc.)
    localStorage.clear();
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-russian-violet-2 bg-opacity-80 backdrop-filter backdrop-blur-lg">
      <div className="w-full mx-auto px-4 py-3">
        <div className="flex items-center">
          {/* Logo section - 20% width */}
          <div className="flex items-center w-1/5">
            <div className="mr-2">
              <Image 
                src="/images/LOGO.png" 
                width={45} 
                height={45} 
                alt="IPL Logo"
                className="rounded-full"
              />
            </div>
            <Link href="/" className="text-2xl font-bold text-heliotrope">
              IPL Auction
            </Link>
          </div>

          {/* Mobile menu button - only visible on mobile */}
          <div className="md:hidden ml-auto">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Navigation links - 60% width, centered */}
          {!isHomePage && (
            <div className="hidden md:flex justify-center items-center w-3/5">
              <div className="flex justify-between w-full max-w-xl">
                <NavLink
                  href={submitted ? "/leaderboard" : "/dashboard"}
                  setSubmitted={setSubmitted}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  href={submitted ? "/leaderboard" : "/search"}
                  setSubmitted={setSubmitted}
                >
                  Search
                </NavLink>
                <NavLink
                  href={submitted ? "/leaderboard" : "/leaderboard"}
                  setSubmitted={setSubmitted}
                >
                  Leaderboard
                </NavLink>
                <NavLink
                  href={submitted ? "/leaderboard" : "/calculator"}
                  setSubmitted={setSubmitted}
                >
                  Calculator
                </NavLink>
                <TeamDropdown />
              </div>
            </div>
          )}

          {/* Right side button - 20% width, right aligned */}
          <div className="hidden md:flex justify-end w-1/5">
            {isHomePage ? (
              <Link
                href="/signup"
                className="bg-tekhelet hover:bg-french-violet text-white px-4 py-2 rounded transition-colors"
              >
                Sign In
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-tekhelet hover:bg-french-violet text-white px-4 py-2 rounded transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {!isHomePage && (
          <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} mt-4`}>
            <div className="flex flex-col space-y-3 pt-2 pb-3">
              <MobileNavLink
                href={submitted ? "/leaderboard" : "/dashboard"}
                setSubmitted={setSubmitted}
              >
                Dashboard
              </MobileNavLink>
              <MobileNavLink
                href={submitted ? "/leaderboard" : "/search"}
                setSubmitted={setSubmitted}
              >
                Search
              </MobileNavLink>
              <MobileNavLink
                href={submitted ? "/leaderboard" : "/leaderboard"}
                setSubmitted={setSubmitted}
              >
                Leaderboard
              </MobileNavLink>
              <MobileNavLink
                href={submitted ? "/leaderboard" : "/calculator"}
                setSubmitted={setSubmitted}
              >
                Calculator
              </MobileNavLink>
              <div className="border-t border-gray-700 pt-3">
                <div className="text-white font-medium mb-2">Teams</div>
                <div className="grid grid-cols-2 gap-2">
                  {IPL_TEAMS.map((team) => (
                    <Link
                      key={team.id}
                      href={team.path}
                      className="text-sm text-gray-300 hover:text-white py-1"
                    >
                      {team.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t border-gray-700">
                <button
                  onClick={handleLogout}
                  className="bg-tekhelet hover:bg-french-violet text-white px-4 py-2 rounded transition-colors w-full"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({
  href,
  children,
  setSubmitted,
}: {
  href: string;
  children: React.ReactNode;
  setSubmitted: any;
}) => (
  <Link
    href={href}
    onClick={() => setSubmitted(localStorage.getItem("userScore"))}
    className="text-white hover:text-heliotrope transition-colors"
  >
    {children}
  </Link>
);

const MobileNavLink = ({
  href,
  children,
  setSubmitted,
}: {
  href: string;
  children: React.ReactNode;
  setSubmitted: any;
}) => (
  <Link
    href={href}
    onClick={() => setSubmitted(localStorage.getItem("userScore"))}
    className="text-white hover:text-heliotrope transition-colors block px-2 py-1"
  >
    {children}
  </Link>
);

export default Navbar;