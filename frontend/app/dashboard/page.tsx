"use client";

import { motion } from "framer-motion";
import { useAuction } from "../../context/AuctionContext";
import PlayerCard from "../../components/PlayerCard";
import { useRouter } from "next/navigation";
import { GiCricketBat, GiBowlingPin, GiAlliedStar, GiPowerLightning } from "react-icons/gi";
import type React from "react";
import { Spinner } from "@/components/ui/spinner";
import { getPlayersByUser, getTeamById, getUserPurse } from "../api/api"; 
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const fetchUserPlayers = async (id: string) => {
  const response = await getPlayersByUser(id);
  return response.data;
};

const fetchPurse = async (id: string) => {
  const response = await getUserPurse(id); 
  return response.data.purseValue;
};

export default function Dashboard() {
  const { user, loading } = useAuction(); // Ensure useAuction() has a loading state
  const [players, setPlayers] = useState([]);
  const [flag, setFlag] = useState(false);
  const [purse, setPurse] = useState(0); 
  const [team, setTeam] = useState({});
  const router = useRouter();

  // Ensure user is loaded from localStorage if missing
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!user && storedUser) {
      setUser(JSON.parse(storedUser)); // Assuming setUser is available from context
    }
  }, [user]);

  useEffect(() => {
    if (!user) return; // Ensure user exists before making API calls

    const fetchPlayers = async () => {
      const fetchedPlayers = await fetchUserPlayers(user._id);
      setPlayers(fetchedPlayers);
    };

    const fetchUserPurseValue = async () => {
      const fetchedPurse = await fetchPurse(user._id);
      setPurse(fetchedPurse);
    };

    const fetchUserTeam = async () => {
      const fetchedTeam = await getTeamById(user.ipl_team_id);
      setTeam(fetchedTeam.data);
    };

    fetchPlayers();
    fetchUserPurseValue();
    fetchUserTeam();
  }, [user, flag]);

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
  }, []);

  // Show loading spinner if user is still being fetched
  if (!user || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="large">
          <span>Loading your players...</span>
        </Spinner>
      </div>
    );
  }

  const slot_num = user.slot_num;
  const batsmen = players.filter(player => player.type === "Batsman" || player.type === "Wicket Keeper");
  const bowlers = players.filter(player => player.type === "Bowler");
  const allRounders = players.filter(player => player.type === "All Rounder");

  const teamValue = players.reduce((sum, player) => {
    const slotPrice = player.finalPrice.find(slot => Number(slot.slot_num) === slot_num)?.price || 0;
    return sum + Number(slotPrice);
  }, 0);

  const remainingPurse = Math.max(0, purse - teamValue); 
  const totalPowercards = 5;
  const usedPowercards = 2;

  const PlayerSection = ({ title, players, icon }: { title: string; players: typeof batsmen; icon: React.ReactNode }) => (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4 text-heliotrope flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map(player => (
          <PlayerCard
            key={player._id}
            {...player}
            slot_num={slot_num}
            overallRating={player.overallRating}
            rtmTeam={
              player.rtmTeam as "CSK" | "DC" | "GT" | "KKR" | "LSG" | "MI" | "PBKS" | "RCB" | "RR" | "SRH"
            }
            isElite={player.ratings.rtmElite > 8}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-russian-violet-2 to-tekhelet bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-heliotrope">Team Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-400">Total Players</p>
            <p className="text-3xl font-bold text-white">{players.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Team Value</p>
            <p className="text-3xl font-bold text-white">{teamValue} Cr</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Purse</p>
            <p className="text-3xl font-bold text-white">{purse} Cr</p>
          </div>
          <Image src={team ? team.img : null} width={150} height={100} alt={team.name || "team-logo"} />
        </div>
      </motion.div>
      <div className="min-w-full flex justify-between">
        <h2 className="text-2xl font-bold mb-4 m-5 text-heliotrope">Your Players</h2>
        <Button className="m-5" variant="outline" onClick={() => setFlag(prevFlag => !prevFlag)}>
          Refresh
        </Button>
      </div>
      <div className="flex flex-col m-10">git
        <PlayerSection title="Batsmen" players={batsmen} icon={<GiCricketBat className="w-6 h-6" />} />
        <PlayerSection title="Bowlers" players={bowlers} icon={<GiBowlingPin className="w-6 h-6" />} />
        <PlayerSection title="All-rounders" players={allRounders} icon={<GiAlliedStar className="w-6 h-6" />} />
      </div>
    </div>
  );
}