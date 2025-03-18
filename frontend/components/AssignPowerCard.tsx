import React from "react";
import { useState, useEffect } from "react";
import { getPlayers, getTeams, assignPlayer, getPowerCards, assignPowercard } from "@/app/api/api";
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
const AssignPowerCard = () => {
  const [powercard, setPowercard] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [finalPrice, setFinalPrice] = useState("");
  const router = useRouter();
  const fetchData = async () => {
    try {
      const powercardRes = await getPowerCards();
      // playersRes= playersRes.data.sort()
      console.log(powercardRes);

      const teamsRes = await getTeams();
      setPowercard(powercardRes.data);
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
  const handleAssignPlayer = async () => {
    if (!selectedTeam || !selectedSlot || !selectedPlayer) return;
    try {
      const response = await assignPowercard(selectedPlayer, {
        selectedSlot,
        selectedTeam,
        finalPrice,
      });
      fetchData(); // Refresh users after update
      return response.status;
    } catch (error) {
      console.error("Error updating purse value:", error);
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-heliotrope">Powercard</h2>
      <Card className="p-4 shadow-md rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Assign Powercard</h3>
        <div className="flex flex-col gap-5">
          <Input
            className=""
            type="text"
            placeholder="Enter slot"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
          />
          <Select onValueChange={setSelectedPlayer}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {powercard.map((player) => (
                <SelectItem key={player._id} value={player._id}>
                  {player.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedTeam} className="mt-4">
            <SelectTrigger>
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team._id} value={team._id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className=""
            type="number"
            placeholder="Set final price"
            value={finalPrice}
            onChange={(e) => setFinalPrice(e.target.value)}
          />
        </div>
        <Button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={async () => {
            const response = await handleAssignPlayer();
            console.log(response);
            if (response == 200 || response == 204) {
              toast("Player assigned", {
                description: `${
                  powercard.find((player) => player._id === selectedPlayer)?.name
                } has been assigned the team ${
                  teams.find((team) => team._id === selectedTeam)?.name ||
                  "Unknown User"
                } in slot ${selectedSlot}`,
              });
            } else {
              toast("Could not assign player", {
                description: `Error occurred while assigning player`,
              });
            }
          }}
        >
          Assign Powercard
        </Button>
      </Card>
    </div>
  );
};

export default AssignPowerCard;
