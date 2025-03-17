"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuction } from "../../context/AuctionContext";
import PlayerCard from "../../components/PlayerCard";
import playerData from "../../data/playerData";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Search() {
  const { players, user } = useAuction();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    team: "",
  });
  const router = useRouter();
  useEffect(() => {
    if(!localStorage.getItem("token") || !localStorage.getItem("slot") || !localStorage.getItem("id") || !localStorage.getItem("role")){
      localStorage.clear()
      router.push("/login")
      return;
    }

    if (localStorage.getItem("userScore") != null) {
      router.push("/leaderboard");
    }
  }, []);

  const allPlayers = playerData.flatMap((set) => set.players);
  const playerMap = new Map(allPlayers.map((player) => [player.name, player]));

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = !filters.role || player.type === filters.role;
    const matchesTeam = !filters.team || player.team === filters.team;
    const isValidPlayer = !(player.isLegendary || player.isUnderdog); // Exclude players who are both Legendary and Underdog

    return matchesSearch && matchesRole && matchesTeam && isValidPlayer;
  });

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-russian-violet-2 to-tekhelet bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-heliotrope">
          Search Players
        </h2>
        <div className="grid grid-cols-2 gap-4 items-center">
  <input
    type="text"
    placeholder="Search players..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="bg-russian-violet bg-opacity-50 text-white placeholder-mauve rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amethyst w-full"
  />
  <select
    value={filters.role}
    onChange={(e) => setFilters({ ...filters, role: e.target.value })}
    className="bg-russian-violet bg-opacity-50 text-white rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amethyst w-full"
  >
    <option value="">All Roles</option>
    <option value="Batsman">Batsman</option>
    <option value="Bowler">Bowler</option>
    <option value="All Rounder">All-rounder</option>
    <option value="Wicket Keeper">Wicket-keeper</option>
  </select>
</div>

      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlayers.map((player) => (
          <PlayerCard
            key={player.id}
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
            src={player?.src}
          />
        ))}
      </div>
    </div>
  );
}
