'use client';

import { useState } from 'react';
import { GiCricketBat } from "react-icons/gi";
import { FaBowlingBall } from "react-icons/fa";

interface PlayerCardProps {
  name: string;
  type: string;
  basePrice: string | number;
  src?: string;
  ratings: {
    batting: {
      powerplay: number;
      middleOvers: number;
      deathOvers: number;
    };
    bowling: {
      powerplay: number;
      middleOvers: number;
      deathOvers: number;
    };
  };
}

const RatingBar = ({ rating, label }: { rating: number; label: string }) => (
  <div className="flex items-center mb-2">
    <span className="w-24 text-sm text-amber-200">{label}</span>
    <div className="flex-grow bg-purple-900/30 rounded-full h-2 shadow-[0_0_10px_rgba(251,191,36,0.3)]">
      <div
        className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.5)]"
        style={{ width: `${rating * 10}%` }}
      />
    </div>
    <span className="ml-2 text-sm text-amber-200">{rating}</span>
  </div>
);

const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  type,
  basePrice,
  src,
  ratings
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const formatPrice = (price: string | number) => {
    if (typeof price === "string") {
      return price.replace("cr", ".00 Cr");
    }
    return `${(price / 10000000).toFixed(2)} Cr`;
  };

  const showBatting = type.toLowerCase() === "batsman" || type.toLowerCase() === "all rounder";
  const showBowling = type.toLowerCase() === "bowler" || type.toLowerCase() === "all rounder";

  return (
    <div
      className="relative w-[350px] h-[450px] cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
        }}
      >
        {/* Front of card */}
        <div
          className="absolute w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 border-2 border-amber-400"
          style={{ 
            backfaceVisibility: "hidden",
            boxShadow: `
              0 0 25px rgba(251, 191, 36, 0.5),
              0 0 50px rgba(251, 191, 36, 0.3),
              inset 0 0 30px rgba(251, 191, 36, 0.3)
            `
          }}
        >
          <div className="w-full h-full p-6 flex flex-col items-center bg-gradient-to-br from-purple-900/40 to-transparent">
            <div className="w-48 h-48 rounded-full overflow-hidden mb-6 ring-4 ring-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]">
              <img
                src={src || "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=400"}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-amber-200 mb-2 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">{name}</h2>
            <p className="text-lg text-amber-200/90 mb-4">{type}</p>
            <div className="mt-auto">
              <p className="text-sm text-amber-200/90">Base Price</p>
              <p className="text-2xl font-bold text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">{formatPrice(basePrice)}</p>
            </div>
            <p className="text-sm text-amber-200/90 mt-4">Click to see ratings</p>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 border-2 border-amber-400"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            boxShadow: `
              0 0 25px rgba(251, 191, 36, 0.5),
              0 0 50px rgba(251, 191, 36, 0.3),
              inset 0 0 30px rgba(251, 191, 36, 0.3)
            `
          }}
        >
          <div className="w-full h-full p-6 flex flex-col bg-gradient-to-br from-purple-900/40 to-transparent">
            <h3 className="text-xl font-bold text-amber-200 mb-6 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">Player Ratings</h3>
           
            {showBatting && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-amber-200 mb-3 flex items-center">
                  <GiCricketBat className="mr-2 text-amber-400" /> Batting Ratings
                </h4>
                <div className="space-y-2">
                  <RatingBar rating={ratings.batting.powerplay} label="Powerplay" />
                  <RatingBar rating={ratings.batting.middleOvers} label="Middle Overs" />
                  <RatingBar rating={ratings.batting.deathOvers} label="Death Overs" />
                </div>
              </div>
            )}

            {showBowling && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-amber-200 mb-3 flex items-center">
                  <FaBowlingBall className="mr-2 text-amber-400" /> Bowling Ratings
                </h4>
                <div className="space-y-2">
                  <RatingBar rating={ratings.bowling.powerplay} label="Powerplay" />
                  <RatingBar rating={ratings.bowling.middleOvers} label="Middle Overs" />
                  <RatingBar rating={ratings.bowling.deathOvers} label="Death Overs" />
                </div>
              </div>
            )}

            <p className="text-sm text-amber-200/90 mt-auto text-center">Click to see player info</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;