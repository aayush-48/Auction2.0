"use client";

import { useState } from "react";

import AssignPlayer from "@/components/AssignPlayer";
import UnassignPlayer from "@/components/UnassignPlayer";
import UpdatePurse from "@/components/UpdatePurse";
import AssignTeam from "@/components/AssignTeam";
export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("teams");

  return (
    <div className="min-h-screen bg-gradient-to-r from-russian-violet to-tekhelet p-4">
      <h1 className="text-3xl font-bold mb-4 text-center text-heliotrope">
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
        <div className="flex flex-col gap-10">
          <AssignPlayer />
          <UnassignPlayer />
        </div>
      )}
      {activeTab === "users" && <UpdatePurse />}
      {activeTab === "teams" && <AssignTeam />}
    </div>
  );
}
