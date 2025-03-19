import React, { useState, useEffect } from "react";
import { getPlayers, getTeams, unassignPlayer } from "@/app/api/api";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { toast } from "sonner";

const UnassignPlayer = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const playersRes = await getPlayers();
      const teamsRes = await getTeams();
      playersRes.data.sort((a: Player, b: Player) =>
        a.name.localeCompare(b.name)
      );
      setPlayers(playersRes.data);
      setTeams(teamsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/login");
    } else {
      fetchData();
    }
  }, [router]);

  const handleUnassignPlayer = async () => {
    if (!selectedTeam || !selectedSlot || !selectedPlayer) return;
    try {
      const response = await unassignPlayer(selectedPlayer, {
        selectedSlot,
        selectedTeam,
      });
      fetchData(); // Refresh users after update
      return response.status;
    } catch (error) {
      console.error("Error unassigning player:", error);
    }
  };

  return (
    <Card className="p-4 shadow-md rounded-lg w-1/2">
      <h3 className="text-xl font-semibold mb-4">Unassign Player</h3>
      <div className="flex flex-col gap-5">
        <Input
          type="text"
          placeholder="Enter slot"
          value={selectedSlot}
          onChange={(e) => setSelectedSlot(e.target.value)}
        />
        <Select onValueChange={setSelectedTeam} className="mt-4">
          <SelectTrigger>
            <SelectValue placeholder="Select a team" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            {teams.map((team) => (
              <SelectItem key={team._id} value={team._id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setSelectedPlayer}>
          <SelectTrigger>
            <SelectValue placeholder="Select a player" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            {players.map((player) => (
              <SelectItem key={player._id} value={player._id}>
                {player.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        onClick={async () => {
          const response = await handleUnassignPlayer();
          if (response === 200 || response === 204) {
            toast("Player unassigned", {
              description: `${
                players.find((player) => player._id === selectedPlayer)?.name
              } has been unassigned from team ${
                teams.find((team) => team._id === selectedTeam)?.name ||
                "Unknown User"
              } in slot ${selectedSlot}`,
            });
          } else {
            toast("Could not unassign player", {
              description: `Error occurred while unassigning player`,
            });
          }
        }}
      >
        Unassign Player
      </Button>
    </Card>
  );
};

export default UnassignPlayer;
