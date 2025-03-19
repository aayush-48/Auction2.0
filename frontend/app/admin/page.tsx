"use client";

import { act, useState } from "react";

import AssignPlayer from "@/components/AssignPlayer";
import UnassignPlayer from "@/components/UnassignPlayer";
import UpdatePurse from "@/components/UpdatePurse";
import AssignTeam from "@/components/AssignTeam";
import AssignPowerCard from "@/components/AssignPowerCard";
import UnassignPowerCard from "@/components/UnassignPowerCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("teams");
  const router = useRouter();
  const handleLogout = () => {
    // Add any logout logic here (clearing tokens, etc.)
    localStorage.clear();
    router.push("/login");
  };
  return (
    <div className="min-h-screen bg-gradient-to-r from-russian-violet to-tekhelet p-4">
      <h1 className="text-3xl font-bold mb-4 text-center text-heliotrope">
        Admin Panel
      </h1>
      <Button
        className="absolute top-4 right-4 text-white"
        onClick={handleLogout}
      >
        Logout
      </Button>
      <div className="flex mb-8">
        <button
          onClick={() => setActiveTab("teams")}
          className={`mr-4 px-4 py-2 rounded ${
            activeTab === "teams"
              ? "bg-amethyst text-white"
              : "bg-french-violet text-mauve"
          }`}
        >
          Teams
        </button>
        <button
          onClick={() => setActiveTab("players")}
          className={`mr-4 px-4 py-2 rounded ${
            activeTab === "players"
              ? "bg-amethyst text-white"
              : "bg-french-violet text-mauve"
          }`}
        >
          Players
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
          className={`px-4 py-2 rounded ${
            activeTab === "users"
              ? "bg-amethyst text-white"
              : "bg-french-violet text-mauve"
          }`}
        >
          Users
        </button>
      </div>

      {activeTab === "players" && (
        <div className="flex flex-col gap-10 w-full">
          <h2 className="text-2xl font-bold mb-4 text-heliotrope">Players</h2>
          <div className="flex gap-10 w-full justify-center">
            <AssignPlayer />
            <UnassignPlayer />
          </div>
        </div>
      )}
      {activeTab === "users" && <UpdatePurse />}
      {activeTab === "teams" && <AssignTeam />}
      {activeTab === "powerCards" && (
        <div className="flex flex-col gap-10 w-full">
          <h2 className="text-2xl font-bold mb-4 text-heliotrope">Powercard</h2>
          <div className="flex gap-10 w-full justify-center">
            <AssignPowerCard />
            <UnassignPowerCard />
          </div>
        </div>
      )}
    </div>
  );
}
