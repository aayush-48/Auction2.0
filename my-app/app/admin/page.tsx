"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getPlayers, getTeams, getPowerCards, getUsers } from "../api/api"

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("teams")
  const [players, setPlayers] = useState([])
  const [teams, setTeams] = useState([])
  const [powerCards, setPowerCards] = useState([])
  const [users, setUsers] = useState([])
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem("role")
    if (role !== "admin") {
      router.push("/login")
    } else {
      fetchData()
    }
  }, [router])

  const fetchData = async () => {
    try {
      const [playersRes, teamsRes, powerCardsRes, usersRes] = await Promise.all([
        getPlayers(),
        getTeams(),
        getPowerCards(),
        getUsers(),
      ])
      setPlayers(playersRes.data)
      setTeams(teamsRes.data)
      setPowerCards(powerCardsRes.data)
      setUsers(usersRes.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-russian-violet to-tekhelet p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-heliotrope">Admin Panel</h1>
      <div className="flex mb-8">
        <button
          onClick={() => setActiveTab("teams")}
          className={`mr-4 px-4 py-2 rounded ${
            activeTab === "teams" ? "bg-amethyst text-white" : "bg-french-violet text-mauve"
          }`}
        >
          Teams & Players
        </button>
        <button
          onClick={() => setActiveTab("powerCards")}
          className={`mr-4 px-4 py-2 rounded ${
            activeTab === "powerCards" ? "bg-amethyst text-white" : "bg-french-violet text-mauve"
          }`}
        >
          Power Cards
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`mr-4 px-4 py-2 rounded ${
            activeTab === "users" ? "bg-amethyst text-white" : "bg-french-violet text-mauve"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 rounded ${
            activeTab === "analytics" ? "bg-amethyst text-white" : "bg-french-violet text-mauve"
          }`}
        >
          Analytics
        </button>
      </div>
      {activeTab === "teams" && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-heliotrope">Teams & Players</h2>
          {/* Add team and player management components here */}
        </div>
      )}
      {activeTab === "powerCards" && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-heliotrope">Power Cards</h2>
          {/* Add power card management components here */}
        </div>
      )}
      {activeTab === "users" && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-heliotrope">Users</h2>
          {/* Add user management components here */}
        </div>
      )}
      {activeTab === "analytics" && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-heliotrope">Analytics</h2>
          {/* Add analytics components here */}
        </div>
      )}
    </div>
  )
}

