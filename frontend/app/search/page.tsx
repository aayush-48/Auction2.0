"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useAuction } from "../../context/AuctionContext"
import PlayerCard from "../../components/PlayerCard"
import playerData from "../../data/playerData"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Search() {
  const { players } = useAuction()
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    role: "",
    team: "",
  })
  const router = useRouter()
  useEffect(() =>{
        console.log(localStorage.getItem("userScore") === null);
        
        if( localStorage.getItem("userScore") != null ){
          router.push("/leaderboard")
        }
  } , [])

  const allPlayers = playerData.flatMap((set) => set.players)
  const playerMap = new Map(allPlayers.map((player) => [player.name, player]))

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = !filters.role || player.type === filters.role
    const matchesTeam = !filters.team || player.team === filters.team

    return matchesSearch && matchesRole && matchesTeam
  })

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-russian-violet-2 to-tekhelet bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-heliotrope">Search Players</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-russian-violet bg-opacity-50 text-white placeholder-mauve rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amethyst"
          />
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="bg-russian-violet bg-opacity-50 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amethyst"
          >
            <option value="">All Roles</option>
            <option value="Batsman">Batsman</option>
            <option value="Bowler">Bowler</option>
            <option value="All-rounder">All-rounder</option>
            <option value="Wicket-keeper">Wicket-keeper</option>
          </select>
          <select
            value={filters.team}
            onChange={(e) => setFilters({ ...filters, team: e.target.value })}
            className="bg-russian-violet bg-opacity-50 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amethyst"
          >
            <option value="">All Teams</option>
            <option value="MI">Mumbai Indians</option>
            <option value="CSK">Chennai Super Kings</option>
            <option value="RCB">Royal Challengers Bangalore</option>
            <option value="KKR">Kolkata Knight Riders</option>
            <option value="DC">Delhi Capitals</option>
            <option value="PBKS">Punjab Kings</option>
            <option value="RR">Rajasthan Royals</option>
            <option value="SRH">Sunrisers Hyderabad</option>
            <option value="GT">Gujarat Titans</option>
            <option value="LSG">Lucknow Super Giants</option>
          </select>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlayers.map((player) => (
          <PlayerCard
            key={player.id}
            {...player}
            rtmTeam={player.rtmTeam as "CSK" | "DC" | "GT" | "KKR" | "LSG" | "MI" | "PBKS" | "RCB" | "RR" | "SRH"}
            isElite={player.ratings.rtmElite > 8}
            src={playerMap.get(player.name)?.src}
          />
        ))}
      </div>
    </div>
  )
}

