import React from "react";
import { useState, useEffect } from "react";
import { getTeams, getPowerCards, assignPowercard } from "@/app/api/api";
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

  const handlePriceChange = (e) => {
    // Allow empty string for initial input
    if (e.target.value === "") {
      setFinalPrice("");
      return;
    }

    // Parse the input value to number
    const value = parseFloat(e.target.value);

    // Validate to ensure it's a number and not negative
    if (!isNaN(value) && value >= 0) {
      // Format to at most 1 decimal place
      setFinalPrice(value.toString());
    }
  };

  const handlePriceStep = (increment) => {
    // If finalPrice is empty, start from 0
    const currentValue = finalPrice === "" ? 0 : parseFloat(finalPrice);

    // Calculate the step based on the current value
    const step = currentValue < 10 ? 0.5 : 1;

    // Calculate the new value
    let newValue = currentValue + (increment ? step : -step);

    // Ensure the value doesn't go below 0
    newValue = Math.max(0, newValue);

    // For values below 10, ensure we maintain the .0 or .5 format
    if (newValue < 10) {
      // Round to nearest 0.5
      newValue = Math.round(newValue * 2) / 2;
    } else {
      // Round to nearest integer for values >= 10
      newValue = Math.round(newValue);
    }

    // Update the finalPrice state
    setFinalPrice(newValue.toString());
  };
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
  const handleAssignPowercard = async () => {
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
    <Card className="p-4 shadow-md rounded-lg w-1/2">
      <h3 className="text-xl font-semibold mb-4">Assign Powercard</h3>
      <div className="flex flex-col gap-5">
        <Input
          className=""
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
            <SelectValue placeholder="Select a powercard" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            {powercard.map((pc) => (
              <SelectItem key={pc._id} value={pc._id}>
                {pc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center">
          <Button
            type="button"
            variant="outline"
            className="px-3"
            onClick={() => handlePriceStep(false)}
          >
            -
          </Button>
          <Input
            className="mx-2"
            type="number"
            step={parseFloat(finalPrice) < 10 ? "0.5" : "1"}
            min="0"
            placeholder="Set final price"
            value={finalPrice}
            onChange={handlePriceChange}
          />
          <Button
            type="button"
            variant="outline"
            className="px-3"
            onClick={() => handlePriceStep(true)}
          >
            +
          </Button>
        </div>
        <div className="text-xs text-gray-500">
          Price increases by 0.5 up to 10, then by 1 after that
        </div>
      </div>
      <Button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={async () => {
          const response = await handleAssignPowercard();
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
            toast.error("Could not assign powercard", {
              description: `Error occurred while assigning powercard`,
            });
          }
        }}
      >
        Assign Powercard
      </Button>
    </Card>
  );
};

export default AssignPowerCard;
