import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPlayers, getTeams, getUsers, updateUserPurse } from "@/app/api/api";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { toast } from "sonner";
const UpdatePurse = () => {
  const [users, setUsers] = useState([]);
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [purseValue, setPurseValue] = useState("");
  const router = useRouter();
  const fetchData = async () => {
    try {
      const usersRes = await getUsers();
      const playersRes = await getPlayers();
      const teamsRes = await getTeams();
      setUsers(usersRes.data);
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
  const handleUpdatePurse = async () => {
    if (!selectedUser || purseValue === "") return;
    try {
      const response = await updateUserPurse(selectedUser, { purseValue });
      fetchData(); // Refresh users after update
      return response.status;
    } catch (error) {
      console.error("Error updating purse value:", error);
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-heliotrope">Users</h2>
      <Card className="p-4 shadow-md rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Update User Purse</h3>
        <div className="flex flex-col gap-5">
          <Input
            className=""
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

          <Input
            className=""
            type="number"
            placeholder="Enter purse value"
            value={purseValue}
            onChange={(e) => setPurseValue(e.target.value)}
          />
        </div>
        <Button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={async () => {
            const response = await handleUpdatePurse();
            if (response == 200 || response == 204) {
              toast("Purse updated", {
                description: `${
                  users.find((user) => user._id === selectedUser)?.username ||
                  "Unknown User"
                } purse has been set to ${purseValue}`,
              });
            } else {
              toast("Purse update failed", {
                description: `Could not update purse of ${
                  users.find((user) => user._id === selectedUser)?.username ||
                  "Unknown User"
                }`,
              });
            }
          }}
        >
          Update Purse
        </Button>
      </Card>
    </div>
  );
};

export default UpdatePurse;
