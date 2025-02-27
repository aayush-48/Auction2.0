"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getPlayers,
  getTeams,
  getPowerCards,
  getUsers,
  updateUserPurse,
} from "../api/api";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("teams");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [purseValue, setPurseValue] = useState("");
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/login");
    } else {
      fetchData();
    }
  }, [router]);

  const fetchData = async () => {
    try {
      const usersRes = await getUsers();
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUpdatePurse = async () => {
    if (!selectedUser || purseValue === "") return;
    try {
      await updateUserPurse(selectedUser, purseValue);
      fetchData(); // Refresh users after update
    } catch (error) {
      console.error("Error updating purse value:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-russian-violet to-tekhelet p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-heliotrope">
        Admin Panel
      </h1>
      <div className="flex mb-8">
        <button
          onClick={() => setActiveTab("teams")}
          className={`mr-4 px-4 py-2 rounded ${
            activeTab === "teams"
              ? "bg-amethyst text-white"
              : "bg-french-violet text-mauve"
          }`}
        >
          Teams & Players
        </button>
        <button
          onClick={() => setActiveTab("powerCards")}
          className={`mr-4 px-4 py-2 rounded ${
            activeTab === "powerCards"
              ? "bg-amethyst text-white"
              : "bg-french-violet text-mauve"
          }`}
        >
          Power Cards
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`mr-4 px-4 py-2 rounded ${
            activeTab === "users"
              ? "bg-amethyst text-white"
              : "bg-french-violet text-mauve"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 rounded ${
            activeTab === "analytics"
              ? "bg-amethyst text-white"
              : "bg-french-violet text-mauve"
          }`}
        >
          Analytics
        </button>
      </div>
      {activeTab === "users" && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-heliotrope">Users</h2>
          <Card className="p-4 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Update User Purse</h3>
            <Select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
            <Input
              className="mt-4"
              type="text"
              placeholder="Enter slot"
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
            />
            <Input
              className="mt-4"
              type="number"
              placeholder="Enter purse value"
              value={purseValue}
              onChange={(e) => setPurseValue(e.target.value)}
            />
            <Button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleUpdatePurse}
            >
              Update Purse
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
