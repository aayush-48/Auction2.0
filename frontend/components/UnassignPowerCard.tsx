import React, { useState, useEffect } from "react";
import { getPowerCards, getTeams, usedPowerCard } from "@/app/api/api";
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
import { AlertCircle } from "lucide-react";

const UnassignPowerCard = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const playersRes = await getPowerCards();
      const teamsRes = await getTeams();
      setPlayers(playersRes.data);
      setTeams(teamsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data", {
        description: error.response?.data?.msg || "Please try again later",
      });
    } finally {
      setIsLoading(false);
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

  const handleUsePowerCard = async () => {
    if (!selectedTeam || !selectedSlot || !selectedPlayer) {
      toast.error("Missing information", {
        description: "Please select a powercard, team, and enter a slot",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await usedPowerCard(selectedPlayer, {
        selectedSlot,
        selectedTeam,
      });

      // Get the names for better user feedback
      const powerCardName =
        players.find((player) => player._id === selectedPlayer)?.name ||
        "Unknown";
      const teamName =
        teams.find((team) => team._id === selectedTeam)?.name || "Unknown";

      toast.success("Powercard used successfully", {
        description: `${powerCardName} has been used by team ${teamName} in slot ${selectedSlot}`,
      });

      // Reset form fields
      setSelectedPlayer(null);
      setSelectedSlot("");
      setSelectedTeam(null);

      // Refresh data
      fetchData();

      return response;
    } catch (error) {
      // Extract error message from response.data.msg
      const errorMessage =
        error.response?.data?.msg || "Failed to use powercard";

      toast.error("Error using powercard", {
        description: errorMessage,
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      });

      console.error("Error details:", error);
      return error.response;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4 shadow-md rounded-lg w-1/2 mx-auto">
      <h3 className="text-xl font-semibold mb-4">Use Powercard</h3>
      <div className="flex flex-col gap-5">
        <div className="space-y-2">
          <label htmlFor="powercard-select" className="text-sm font-medium">
            Select Powercard
          </label>
          <Select
            onValueChange={setSelectedPlayer}
            value={selectedPlayer || ""}
          >
            <SelectTrigger id="powercard-select" className="w-full">
              <SelectValue placeholder="Select a powercard" />
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

        <div className="space-y-2">
          <label htmlFor="team-select" className="text-sm font-medium">
            Select Team
          </label>
          <Select onValueChange={setSelectedTeam} value={selectedTeam || ""}>
            <SelectTrigger id="team-select" className="w-full">
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
        </div>

        <div className="space-y-2">
          <label htmlFor="slot-input" className="text-sm font-medium">
            Slot
          </label>
          <Input
            id="slot-input"
            type="text"
            placeholder="Enter slot"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
          />
        </div>
      </div>

      <Button
        className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white"
        onClick={handleUsePowerCard}
        disabled={
          isLoading || !selectedPlayer || !selectedTeam || !selectedSlot
        }
      >
        {isLoading ? "Processing..." : "Use Powercard"}
      </Button>
    </Card>
  );
};

export default UnassignPowerCard;
