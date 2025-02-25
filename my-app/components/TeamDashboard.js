"use client"

import { motion } from "framer-motion"
import { useAuction } from "../context/AuctionContext"
import PlayerCard from "./PlayerCard"
import { GiCricketBat, GiBowlingPin, GiAlliedStar } from "react-icons/gi"
import React from "react" // Import React

const TeamDashboard = ({ teamName, teamId }) => {
  const { players, loading, error } = useAuction()

  if (loading) {
    return <div className="text-white text-center mt-8">Loading...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>
  }

  const teamPlayers = players.filter((player) => player.team === teamId)
  const batsmen = teamPlayers.filter((player) => player.type === "Batsman" || player.type === "Wicket-keeper")
  const bowlers = teamPlayers.filter((player) => player.type === "Bowler")
  const allRounders = teamPlayers.filter((player) => player.type === "All-rounder")

  const PlayerSection = ({ title, players, icon }) => (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4 text-heliotrope flex items-center">
        {React.createElement(icon, { className: "w-6 h-6 mr-2" })}
        <span>{title}</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <PlayerCard key={player._id} {...player} rtmTeam={player.rtmTeam} isElite={player.ratings.rtmElite > 8} />
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-russian-violet-2 to-tekhelet bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-heliotrope">{teamName} Dashboard</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Total Players</p>
            <p className="text-3xl font-bold text-white">{teamPlayers.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Team Value</p>
            <p className="text-3xl font-bold text-white">
              ${teamPlayers.reduce((sum, player) => sum + player.finalPrice, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>

      <h2 className="text-2xl font-bold mb-4 text-heliotrope">Team Players</h2>

      <PlayerSection title="Batsmen" players={batsmen} icon={GiCricketBat} />
      <PlayerSection title="Bowlers" players={bowlers} icon={GiBowlingPin} />
      <PlayerSection title="All-rounders" players={allRounders} icon={GiAlliedStar} />
    </div>
  )
}

export default TeamDashboard

