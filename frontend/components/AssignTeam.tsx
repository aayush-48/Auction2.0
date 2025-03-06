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

  const fetchData = async () => {
    try {
      const teamsRes = await getTeams();
      const usersRes = await getUsers();
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
            <SelectContent>
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
            <SelectContent>
              {teams.map((team: { _id: string; name: string }) => (
                <SelectItem key={team._id} value={team._id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Set final price"
            value={finalPrice}
            onChange={(e) => setFinalPrice(e.target.value)}
          />
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
