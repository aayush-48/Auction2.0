"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuction, type Player } from "../../context/AuctionContext"
import PlayerSelection from "../../components/PlayerSelection"
import TeamComposition from "../../components/TeamComposition"

export default function Calculator() {
  const { players } = useAuction()
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([])
  const [selectedPlayers, setSelectedPlayers] = useState<(Player | null)[]>(Array(11).fill(null))
  const [teamScore, setTeamScore] = useState(0)

  useEffect(() => {
    if (players && players.length > 0) {
      setAvailablePlayers(players)
    }
  }, [players])

  const handleSelectPlayer = (player: Player) => {
    const emptySlotIndex = selectedPlayers.findIndex((slot) => slot === null)
    if (emptySlotIndex !== -1) {
      const updatedSelectedPlayers = [...selectedPlayers]
      updatedSelectedPlayers[emptySlotIndex] = player
      setSelectedPlayers(updatedSelectedPlayers)
      setAvailablePlayers(availablePlayers.filter((p) => p.id !== player.id))
    }
  }

  const handleRemovePlayer = (index: number) => {
    const removedPlayer = selectedPlayers[index]
    if (removedPlayer) {
      const updatedSelectedPlayers = [...selectedPlayers]
      updatedSelectedPlayers[index] = null
      setSelectedPlayers(updatedSelectedPlayers)
      setAvailablePlayers([...availablePlayers, removedPlayer])
    }
  }

  const calculateTeamScore = () => {
    const filledSlots = selectedPlayers.filter((player): player is Player => player !== null)

    if (filledSlots.length !== 11) {
      alert("Please select all 11 players before calculating the score.")
      return
    }

    const baseScore = filledSlots.reduce((sum, player) => sum + player.overallRating, 0)

    // TODO: Implement bonus calculations here

    setTeamScore(baseScore)
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-french-violet bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-heliotrope">Team Calculator</h2>
        <PlayerSelection players={availablePlayers} onSelectPlayer={handleSelectPlayer} />
        <TeamComposition selectedPlayers={selectedPlayers} onRemovePlayer={handleRemovePlayer} />
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={calculateTeamScore}
            className="px-4 py-2 bg-amethyst text-white rounded hover:bg-heliotrope transition-colors"
          >
            Calculate Team Score
          </button>
          <p className="text-xl text-heliotrope">Team Score: {teamScore}</p>
        </div>
      </motion.div>
    </div>
  )
}

