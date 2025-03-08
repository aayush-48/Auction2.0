"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PlayerCard from "./PlayerCard";
import type React from "react";
import { GiCricketBat, GiBowlingPin, GiAlliedStar } from "react-icons/gi";
import { getPlayersByTeam } from "../app/api/api";
import { useAuction, type Player } from "../context/AuctionContext";

interface TeamDashboardProps {
  teamName: string;
  teamId: string;
}

const TeamDashboard: React.FC<TeamDashboardProps> = ({ teamName, teamId }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuction();
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);
        if (user) {
          const response = await getPlayersByTeam(teamId, user.slot_num);
          setPlayers(response.data);
        }
      } catch (error) {
        console.error("Error fetching players:", error);
        setError("Failed to fetch players. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [teamId, user]);

  const batsmen = players.filter(
    (player) => player.type === "Batsman" || player.type === "Wicket-keeper"
  );
  const bowlers = players.filter((player) => player.type === "Bowler");
  const allRounders = players.filter((player) => player.type === "All-rounder");

  const PlayerSection = ({
    title,
    players,
    icon,
  }: {
    title: string;
    players: Player[];
    icon: React.ReactNode;
  }) => (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4 text-heliotrope flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            {...player}
            rtmTeam={
              player.rtmTeam as
                | "CSK"
                | "DC"
                | "GT"
                | "KKR"
                | "LSG"
                | "MI"
                | "PBKS"
                | "RCB"
                | "RR"
                | "SRH"
            }
            isElite={player.ratings.rtmElite > 8}
          />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-russian-violet-2 to-tekhelet bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-heliotrope">
          {teamName} Dashboard
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Total Players</p>
            <p className="text-3xl font-bold text-white">{players.length}</p>
          </div>
          {/* <div>
            <p className="text-sm text-gray-400">Team Value</p>
            <p className="text-3xl font-bold text-white">
              $
              {players
                .reduce((sum, player) => sum + player.finalPrice, 0)
                .toLocaleString()}
            </p>
          </div> */}
        </div>
      </motion.div>

      <h2 className="text-2xl font-bold mb-4 text-heliotrope">Team Players</h2>

      <PlayerSection
        title="Batsmen"
        players={batsmen}
        icon={<GiCricketBat className="w-6 h-6" />}
      />
      <PlayerSection
        title="Bowlers"
        players={bowlers}
        icon={<GiBowlingPin className="w-6 h-6" />}
      />
      <PlayerSection
        title="All-rounders"
        players={allRounders}
        icon={<GiAlliedStar className="w-6 h-6" />}
      />
    </div>
  );
};

export default TeamDashboard;
