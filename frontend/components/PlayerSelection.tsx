import type React from "react";
import type { Player } from "../context/AuctionContext";

interface PlayerSelectionProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
}

const PlayerSelection: React.FC<PlayerSelectionProps> = ({
  players,
  onSelectPlayer,
}) => {
  return (
    <div className="bg-russian-violet bg-opacity-50 p-4 rounded-lg mb-4">
      <h3 className="text-xl font-bold mb-4 text-heliotrope">
        Available Players
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {players.map((player) => (
          <button
            key={player._id}
            onClick={() => onSelectPlayer(player)}
            className="bg-french-violet p-3 rounded-lg text-left hover:bg-amethyst transition-colors"
          >
            <h4 className="font-bold text-white">{player.name}</h4>
            <p className="text-sm text-mauve">{player.type}</p>
            <p className="text-sm text-mauve">
              Overall: {player.overallRating}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayerSelection;
