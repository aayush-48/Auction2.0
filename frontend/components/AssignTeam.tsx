import React, { useState, useEffect } from "react";
import { getUsers, getTeams, assignTeam } from "@/app/api/api";
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

const AssignTeam = () => {
  const [teams, setTeams] = useState<{ _id: string; name: string }[]>([]);
  const [users, setUsers] = useState<
    { _id: string; username: string; role: string; slot_num: string }[]
  >([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [finalPrice, setFinalPrice] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
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
      const teamsRes = await getTeams();
      const usersRes = await getUsers();
      console.log(usersRes);

      setTeams(teamsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
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

  const handleAssignTeam = async () => {
    if (!selectedTeam || !selectedSlot) return;
    try {
      const response = await assignTeam(selectedTeam, {
        userId: selectedUser,
        finalPrice,
        slot_num: selectedSlot,
      });
      fetchData();
      return response.status;
    } catch (error) {
      console.error("Error updating team assignment:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-heliotrope">Teams</h2>
      <Card className="p-4 shadow-md rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Assign Team</h3>
        <div className="flex flex-col gap-5">
          <Input
            type="text"
            placeholder="Enter slot"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
          />
          <Select onValueChange={setSelectedUser}>
            <SelectTrigger>
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              {users
                .filter(
                  (user) =>
                    user.role != "admin" &&
                    selectedSlot &&
                    user.slot_num == selectedSlot
                )
                .map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.username}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedTeam}>
            <SelectTrigger>
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              {teams.map((team: { _id: string; name: string }) => (
                <SelectItem key={team._id} value={team._id}>
                  {team.name}
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
            const response = await handleAssignTeam();
            if (response === 200 || response === 204) {
              toast("Team assigned", {
                description: `The team ${
                  teams.find((team) => team._id === selectedTeam)?.name ||
                  "Unknown"
                } has been assigned to user ${
                  users.find((user) => user._id == selectedUser)?.username ||
                  "Unknown"
                } in slot ${selectedSlot}`,
              });
            } else {
              toast("Could not assign team", {
                description: `Error occurred while assigning team`,
              });
            }
          }}
        >
          Assign Team
        </Button>
      </Card>
    </div>
  );
};

export default AssignTeam;
