"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuction } from "../../context/AuctionContext";
import PlayerCard from "../../components/PlayerCard";
import playerData from "../../data/playerData";
import { useRouter } from "next/navigation";
import { GiCricketBat, GiBowlingPin, GiAlliedStar } from "react-icons/gi";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

export default function Search() {
  const { players, user } = useAuction();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    team: "",
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (
      !localStorage.getItem("token") ||
      !localStorage.getItem("slot") ||
      !localStorage.getItem("id") ||
      !localStorage.getItem("role")
    ) {
      localStorage.clear();
      router.push("/login");
      return;
    }

    if (localStorage.getItem("userScore") != null) {
      router.push("/leaderboard");
    }
    
    setLoading(false);
  }, []);

  const allPlayers = playerData.flatMap((set) => set.players);
  const playerMap = new Map(allPlayers.map((player) => [player.name, player]));

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole = !filters.role || player.type === filters.role;
    const matchesTeam = !filters.team || player.team === filters.team;
    const isValidPlayer = !(player.isLegendary || player.isUnderdog);

    return matchesSearch && matchesRole && matchesTeam && isValidPlayer;
  });
  
  // Show loading spinner if data is still being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="large">
          <span>Loading players...</span>
        </Spinner>
      </div>
    );
  }

  const batsmen = filteredPlayers.filter(player => player.type === "Batsman" || player.type === "Wicket Keeper");
  const bowlers = filteredPlayers.filter(player => player.type === "Bowler");
  const allRounders = filteredPlayers.filter(player => player.type === "All Rounder");

  const PlayerSection = ({ title, players, icon }) => (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4 text-heliotrope flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {players.map(player => (
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
              isElite={player.ratings?.rtmElite > 8}
              src={player?.src}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-b from-russian-violet-2 to-tekhelet bg-opacity-30 backdrop-filter backdrop-blur-lg md:w-64 w-full p-4 md:min-h-screen shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-heliotrope">Search Filters</h2>
        
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-400">Player Search</p>
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-russian-violet bg-opacity-50 text-white placeholder-mauve rounded-md px-3 py-2 mt-2 text-sm focus:outline-none focus:ring-2 focus:ring-amethyst w-full"
            />
          </div>
          
          <div>
            <p className="text-sm text-gray-400">Role Filter</p>
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="bg-russian-violet bg-opacity-50 text-white rounded-md px-3 py-2 mt-2 text-sm focus:outline-none focus:ring-2 focus:ring-amethyst w-full"
            >
              <option value="">All Roles</option>
              <option value="Batsman">Batsman</option>
              <option value="Bowler">Bowler</option>
              <option value="All Rounder">All-rounder</option>
              <option value="Wicket Keeper">Wicket-keeper</option>
            </select>
          </div>
          
          <div>
            <p className="text-sm text-gray-400">Results</p>
            <p className="text-2xl font-bold text-white">{filteredPlayers.length} Players</p>
          </div>
          
          <div className="pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setFilters({ role: "", team: "" });
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-heliotrope">Available Players</h2>
          <div className="text-sm text-gray-400">
            Total Results: <span className="font-bold text-white">{filteredPlayers.length}</span>
          </div>
        </div>
        
        {batsmen.length > 0 && (
          <PlayerSection 
            title="Batsmen" 
            players={batsmen} 
            icon={<GiCricketBat className="w-6 h-6" />} 
          />
        )}
        
        {bowlers.length > 0 && (
          <PlayerSection 
            title="Bowlers" 
            players={bowlers} 
            icon={<GiBowlingPin className="w-6 h-6" />} 
          />
        )}
        
        {allRounders.length > 0 && (
          <PlayerSection 
            title="All-rounders" 
            players={allRounders} 
            icon={<GiAlliedStar className="w-6 h-6" />} 
          />
        )}
        
        {filteredPlayers.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-16">
            <p className="text-xl text-gray-400 mb-4">No players match your search criteria</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setFilters({ role: "", team: "" });
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}