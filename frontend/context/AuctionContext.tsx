"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import {
  getPlayers,
  getTeams,
  getUserById,
  getPlayersByUser,
  getOtherTeamsFromSameSlot,
} from "../app/api/api";

export interface Player {
  id: string;
  name: string;
  country: string;
  gender: string;
  type: string;
  team: string;
  basePrice: number;
  finalPrice: { slot_num: number; price: number }[];
  photo: string;
  overallRating: number;
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
  rtmTeam?: string;
  isElite?: boolean;
}

export interface Team {
  id: string;
  name: string;
  src: string;
}
export interface User {
  _id: string;
  password: string;
  player_ids: string[];
  slot_num: number;
  power_card_id: string[];
  Purse: number;
  Score: number;
  role: string;
  username: string;
  ipl_team_id: string;
}

interface LeaderboardData {
  teamName: String;
  score : Number | String;
}

interface AuctionContextType {
  user: User;
  userPlayers: Player[];
  players: Player[];
  teams: Team[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  loading: boolean;
  error: string | null;
  teamsOfSameSlot : LeaderboardData[];
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error("useAuction must be used within an AuctionProvider");
  }
  return context;
};

export const AuctionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | undefined>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userPlayers, setUserPlayers] = useState<Player[]>([]);
  const [teamsOfSameSlot , setTeamsOfSameSlot] = useState<LeaderboardData[]>([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const id = localStorage.getItem("id");
        if (!id) {
          throw new Error("User ID not found in localStorage");
        }
        const [
          playersResponse,
          teamsResponse,
          userResponse,
          userPlayersResponse,
          sortedSlotTeamsResponse
        ] = await Promise.all([
          getPlayers(),
          getTeams(),
          getUserById(id),
          getPlayersByUser(id),
          getOtherTeamsFromSameSlot(localStorage.getItem("slot")|| "")
        ]);
        setPlayers(playersResponse.data);
        setTeams(teamsResponse.data);
        setUser(userResponse.data);
        setUserPlayers(userPlayersResponse.data);
        setTeamsOfSameSlot(sortedSlotTeamsResponse.data)
        // console.log(sortedSlotTeamsResponse);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AuctionContext.Provider
      value={{
        user,
        userPlayers,
        setUser,
        players,
        teams,
        setPlayers,
        setTeams,
        loading,
        error,
        teamsOfSameSlot
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
};
