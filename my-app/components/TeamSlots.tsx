import type React from "react"
import type { Player } from "../context/AuctionContext"

interface TeamSlotsProps {
  selectedPlayers: (Player | null)[]
  onRemovePlayer: (index: number) => void
}

const TeamSlots: React.FC<TeamSlotsProps> = ({ selectedPlayers, onRemovePlayer }) => {
  if (!selectedPlayers || !Array.isArray(selectedPlayers)) {
    return <div className="text-mauve">Loading team slots...</div>
  }

  return (
    <div className="bg-russian-violet bg-opacity-50 p-4 rounded-lg mb-4">
      <h3 className="text-xl font-bold mb-4 text-heliotrope">Your Team</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {selectedPlayers.map((player, index) => (
          <div key={index} className="bg-french-violet p-3 rounded-lg">
            {player ? (
              <>
                <h4 className="font-bold text-white">{player.name}</h4>
                <p className="text-sm text-mauve">{player.type}</p>
                <p className="text-sm text-mauve">Overall: {player.overallRating}</p>
                <button
                  onClick={() => onRemovePlayer(index)}
                  className="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </>
            ) : (
              <p className="text-mauve">Empty Slot</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamSlots

