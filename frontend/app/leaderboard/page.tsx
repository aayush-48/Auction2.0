"use client"

import { motion } from "framer-motion"
import { useAuction } from "../../context/AuctionContext"

export default function Leaderboard() {
  const { teamsOfSameSlot } = useAuction()
  const {sortedTeams} = teamsOfSameSlot
  console.log(teamsOfSameSlot);
  
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-russian-violet-2 to-tekhelet bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-heliotrope">Team Leaderboard</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-4 text-gray-400">Rank</th>
                <th className="pb-4 text-gray-400">Team</th>
                <th className="pb-4 text-gray-400">Score</th>
              </tr>
            </thead>
            <tbody>
              {teamsOfSameSlot?.sortedTeams?.map((team, index) => (
                <motion.tr
                  key={team.teamName}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`${index < 3 ? "bg-gradient-to-r from-french-violet to-amethyst bg-opacity-20" : ""}`}
                >
                  <td className="py-2 px-4 font-bold">{index + 1}</td>
                  <td className="py-2 px-4">{team.teamName}</td>
                  <td className="py-2 px-4">{team.score}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

