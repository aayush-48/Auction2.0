"use client"

import { motion } from "framer-motion"
import { useAuction } from "../../context/AuctionContext"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Leaderboard() {
  const { teamsOfSameSlot } = useAuction()
  const { sortedTeams } = teamsOfSameSlot
  console.log(teamsOfSameSlot)
  const router = useRouter()

  useEffect(() => {
    if (
      !localStorage.getItem("token") ||
      !localStorage.getItem("slot") ||
      !localStorage.getItem("id") ||
      !localStorage.getItem("role")
    ) {
      localStorage.clear()
      router.push("/login")
      return
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative h-full flex flex-col justify-center items-center"
      >
        <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 transition-all duration-300">
          Team Leaderboard
        </h2>
        <div className="w-full max-w-4xl space-y-6">
          {sortedTeams?.map((team, index) => (
            <motion.div
              key={team.teamName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-lg relative"
              style={{
                background: `
                  linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01)),
                  linear-gradient(to bottom right, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5))
                `,
                border: "1px solid rgba(192, 192, 192, 0.3)", // Fixed border
                boxShadow: "0 0 10px rgba(0, 255, 255, 0.3), inset 0 0 5px rgba(0, 255, 255, 0.2)", // Fixed boxShadow
              }}
            >
              {/* Subtle cyan glow effect for all teams */}
              <div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  boxShadow: "0 0 15px rgba(0, 255, 255, 0.4)", // Fixed outer cyan glow
                  zIndex: -1,
                }}
              />
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  {/* Display ranking for all teams */}
                  <span className={`text-xl font-bold ${index === 0 ? "text-cyan-300" : "text-gray-300"}`}>
                    #{index + 1} {/* Rank position */}
                  </span>
                  {/* Medal emoji for the first team only */}
                  {index === 0 && (
                    <span className="text-2xl font-bold text-cyan-300">
                      🥇
                    </span>
                  )}
                  <span className={`text-xl ${index === 0 ? "text-cyan-300 font-semibold" : "text-gray-300"}`}>
                    {team.teamName}
                  </span>
                </div>
                <span className={`text-xl ${index === 0 ? "text-cyan-300 font-semibold" : "text-gray-300"}`}>
                  Score: {team.score}
                </span>
              </div>
              {/* Metallic border line */}
              <div className="mt-4 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
