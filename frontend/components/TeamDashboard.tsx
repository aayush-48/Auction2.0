"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PlayerCard from "./PlayerCard";
import type React from "react";
import { GiCricketBat, GiBowlingPin, GiAlliedStar } from "react-icons/gi";
import { getPlayersByTeam, fetchTeamPurse } from "../app/api/api";
import { useAuction, type Player } from "../context/AuctionContext";
import { Spinner } from "@/components/ui/spinner";

interface TeamDashboardProps {
  teamName: string;
  teamId: string;
}

const TeamDashboard: React.FC<TeamDashboardProps> = ({ teamName, teamId }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purse, setPurse] = useState<number | null>(null);
  const { user } = useAuction();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (user) {
          // Fetch players
          const playersResponse = await getPlayersByTeam(teamId, user.slot_num);
          setPlayers(playersResponse.data);

          // Fetch team purse
          const purseResponse = await fetchTeamPurse(teamId, user.slot_num);
          setPurse(purseResponse.data.purseValue);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teamId, user]);

  const batsmen = players.filter(
    (player) => player.type === "Batsman" || player.type === "Wicket Keeper"
  );
  const bowlers = players.filter((player) => player.type === "Bowler");
  const allRounders = players.filter((player) => player.type === "All Rounder");

  // const teamFlagSrc = `/images/teamFlags/${teamId}.png`;

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {players.map((player) => (
          <div className="flex justify-center" key={player.id}>
            <PlayerCard
              slot_num={user.slot_num}
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
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="large">
          <span>Loading team data...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-russian-violet-2 to-tekhelet bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg text-center">
        <h3 className="text-xl font-bold text-red-400 mb-2">Error</h3>
        <p className="text-white">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-b from-russian-violet-2 to-tekhelet bg-opacity-30 backdrop-filter backdrop-blur-lg md:w-64 w-full p-4 md:min-h-screen shadow-lg"
      >
        {/* Team Flag */}
        {/* <div className="flex flex-col items-center mb-4">
          <img
            src={teamFlagSrc}
            alt={`${teamName} Flag`}
            className="w-20 h-20 object-contain rounded-md shadow-lg"
          />
        </div> */}

        <h2 className="text-2xl font-bold mb-6 text-heliotrope text-center">{teamName}</h2>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-400">Total Players</p>
            <p className="text-2xl font-bold text-white">{players.length}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Total Purse</p>
            <p className="text-2xl font-bold text-white">{purse} Cr</p>
          </div>

          <div className="pt-2">
            <h4 className="text-sm text-gray-400 mb-2">Player Breakdown</h4>
            <div className="bg-russian-violet bg-opacity-50 rounded-md p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-cyan-200 flex items-center">
                  <GiCricketBat className="mr-2" /> Batsmen
                </span>
                <span className="text-white font-bold">{batsmen.length}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-cyan-200 flex items-center">
                  <GiBowlingPin className="mr-2" /> Bowlers
                </span>
                <span className="text-white font-bold">{bowlers.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-cyan-200 flex items-center">
                  <GiAlliedStar className="mr-2" /> All-rounders
                </span>
                <span className="text-white font-bold">{allRounders.length}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-heliotrope">Team Players</h2>
          <div className="text-sm text-gray-400">
            Total: <span className="font-bold text-white">{players.length} Players</span>
          </div>
        </div>

        {batsmen.length > 0 && (
          <PlayerSection title="Batsmen" players={batsmen} icon={<GiCricketBat className="w-6 h-6" />} />
        )}

        {bowlers.length > 0 && (
          <PlayerSection title="Bowlers" players={bowlers} icon={<GiBowlingPin className="w-6 h-6" />} />
        )}

        {allRounders.length > 0 && (
          <PlayerSection title="All-rounders" players={allRounders} icon={<GiAlliedStar className="w-6 h-6" />} />
        )}

        {players.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-16">
            <p className="text-xl text-gray-400">No players in this team yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDashboard;
