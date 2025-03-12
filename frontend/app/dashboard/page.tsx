"use client";

import { motion } from "framer-motion";
import { useAuction } from "../../context/AuctionContext";
import PlayerCard from "../../components/PlayerCard";
import { useRouter } from "next/navigation";
import {
  GiCricketBat,
  GiBowlingPin,
  GiAlliedStar,
  GiPowerLightning,
} from "react-icons/gi";
import type React from "react";
import { Spinner } from "@/components/ui/spinner";
import { getPlayersByUser } from "../api/api";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
const fetchUserPlayers = async (id: string) => {
  const response = await getPlayersByUser(id);
  return response.data;
};

export default function Dashboard() {
  const { loading, error, user } = useAuction();
  const [players, setPlayers] = useState([]);
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    const fetchPlayers = async () => {
      if (user) {
        const fetchedPlayers = await fetchUserPlayers(user._id);
        setPlayers(fetchedPlayers);
      }
    };
    fetchPlayers();
  }, [user, flag]);
  const router = useRouter();
  useEffect(() =>{
      if(!localStorage.getItem("token") || !localStorage.getItem("slot") || !localStorage.getItem("id") || !localStorage.getItem("role")){
        localStorage.clear()
        router.push("/login")
        return;
      }
      
      if( localStorage.getItem("userScore") != null ){
        router.push("/leaderboard")
      }
  } , [])

  if (!user) {
    return (
      <div>
        <Spinner size="large">
          <span>Loading your players</span>
        </Spinner>
      </div>
    );
  }

  const slot_num = user.slot_num;
  const batsmen = players.filter(
    (player) => player.type === "Batsman" || player.type === "Wicket Keeper"
  );
  const bowlers = players.filter((player) => player.type === "Bowler");
  const allRounders = players.filter((player) => player.type === "All Rounder");

  // Mock data for purse and powercards (replace with actual data from your context)
  const totalPurse = user.Purse;
  const teamValue = players.reduce((sum, player) => {
    // console.log(user);
    const slotPrice =
      player.finalPrice.find((slot) => Number(slot.slot_num) === slot_num)
        ?.price || 0;
    return sum + Number(slotPrice);
  }, 0);
  const remainingPurse = Math.max(0, totalPurse - teamValue); // Ensure remaining purse is not negative
  const totalPowercards = 5;
  const usedPowercards = 2;

  const PlayerSection = ({
    title,
    players,
    icon,
  }: {
    title: string;
    players: typeof batsmen;
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
            key={player._id}
            {...player}
            slot_num={slot_num}
            overallRating={player.overallRating}
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

  const formatPrice = (price: number) => {
    return price >= 10000000
      ? `${(price / 10000000).toFixed(2)} Cr`
      : `${(price / 100000).toFixed(2)} Lakh`;
  };

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
          Team Overview
        </h2>
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
            <p className="text-3xl font-bold text-white">{totalPurse} Cr</p>
          </div>
        </div>
      </motion.div>
      <div className="min-w-full flex justify-between">
        <h2 className="text-2xl font-bold mb-4 m-5 text-heliotrope">
          Your Players
        </h2>
        <Button
          className="m-5"
          variant={"outline"}
          onClick={() => setFlag((prevFlag) => !prevFlag)}
        >
          Refresh
        </Button>
      </div>
      <div className="flex flex-col m-10">
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-russian-violet-2 to-tekhelet bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-heliotrope flex items-center">
          <GiPowerLightning className="w-6 h-6 mr-2" />
          Powercards
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Available Powercards</p>
            <p className="text-3xl font-bold text-white">
              {totalPowercards - usedPowercards}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Used Powercards</p>
            <p className="text-3xl font-bold text-white">{usedPowercards}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
