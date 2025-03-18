"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { GiCricketBat } from "react-icons/gi";
import { FaBowlingBall } from "react-icons/fa";
import type React from "react";

interface PlayerCardProps {
  name: string;
  slot_num: number;
  country: string;
  gender: string;
  type: string;
  basePrice: string | number;
  finalPrice: { slot_num: number; price: number }[];
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
    rtmElite: number;
    captaincy: number;
  };
  rtmTeam?:
    | "CSK"
    | "DC"
    | "GT"
    | "KKR"
    | "LSG"
    | "MI"
    | "PBKS"
    | "RCB"
    | "RR"
    | "SRH";
  isElite?: boolean;
  src?: string;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  slot_num,
  country,
  gender,
  type,
  basePrice,
  finalPrice,
  ratings,
  rtmTeam,
  isElite,
  src,
  overallRating,
}) => {
  const finalPriceNum =
    finalPrice.find((slot) => Number(slot.slot_num) === slot_num)?.price || 0;

  const RatingBar = ({ rating, label }: { rating: number; label: string }) => (
    <div className="flex items-center mb-2">
      <span className="w-24 text-sm text-mauve">{label}</span>
      <div className="flex-grow bg-russian-violet rounded-full h-2">
        <div
          className="bg-gradient-to-r from-french-violet to-heliotrope h-2 rounded-full"
          style={{ width: `${rating * 10}%` }}
        />
      </div>
      <span className="ml-2 text-sm text-mauve">{rating}</span>
    </div>
  );

  const showBatting =
    type.toLowerCase() === "batsman" ||
    type.toLowerCase() === "wicket keeper" ||
    type.toLowerCase() === "all rounder";
  const showBowling =
    type.toLowerCase() === "bowler" || type.toLowerCase() === "all rounder";

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-br from-russian-violet-2 to-tekhelet rounded-lg p-6 shadow-lg"
    >
      <div className="flex items-center mb-4">
        <Image
          src={src || "/placeholder.svg"}
          alt={name}
          width={64}
          height={64}
          className="rounded-full mr-4"
        />
        <div>
          <h3 className="text-xl font-bold text-heliotrope">{name}</h3>
          <p className="text-sm text-mauve">{`${country} | ${gender} | ${type}`}</p>
          <p className="text-lg text-heliotrope">
            {/* Overall Rating: {calculateOverallRating()} */}
            Overall Rating: {overallRating}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-mauve">Base Price</p>
          <p className="text-xl font-bold text-white">{basePrice} Cr</p>
        </div>
        <div>
          <p className="text-sm text-mauve">Final Price</p>
          <p className="text-xl font-bold text-heliotrope">
            {finalPriceNum} Cr
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {showBatting && (
          <div>
            <h4 className="text-sm font-semibold text-mauve mb-3 flex items-center">
              <GiCricketBat className="mr-2" /> Batting Ratings
            </h4>
            <div className="space-y-2">
              <RatingBar rating={ratings.batting.powerplay} label="Powerplay" />
              <RatingBar
                rating={ratings.batting.middleOvers}
                label="Middle Overs"
              />
              <RatingBar
                rating={ratings.batting.deathOvers}
                label="Death Overs"
              />
            </div>
          </div>
        )}

        {showBowling && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-mauve mb-3 flex items-center">
              <FaBowlingBall className="mr-2" /> Bowling Ratings
            </h4>
            <div className="space-y-2">
              <RatingBar rating={ratings.bowling.powerplay} label="Powerplay" />
              <RatingBar
                rating={ratings.bowling.middleOvers}
                label="Middle Overs"
              />
              <RatingBar
                rating={ratings.bowling.deathOvers}
                label="Death Overs"
              />
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-french-violet">
          <div>
            <h4 className="text-sm text-mauve mb-1">RTM</h4>
            <p className="text-lg font-bold text-heliotrope">
              {rtmTeam || "No RTM"}
            </p>
          </div>
          <div>
            <h4 className="text-sm text-mauve mb-1">Captaincy</h4>
            <p className="text-lg font-bold text-heliotrope">
              {ratings.captaincy}
            </p>
          </div>
          {isElite && (
            <div>
              <h4 className="text-sm text-mauve mb-1">Elite</h4>
              <p className="text-lg font-bold text-heliotrope">Yes</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerCard;
