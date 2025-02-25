"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getPlayers, getTeams } from "../app/api/api"

export interface Player {
  id: string
  name: string
  country: string
  gender: string
  type: string
  team: string
  basePrice: number
  finalPrice: number
  photo: string
  overallRating: number
  ratings: {
    batting: {
      powerplay: number
      middleOvers: number
      deathOvers: number
    }
    bowling: {
      powerplay: number
      middleOvers: number
      deathOvers: number
    }
    rtmElite: number
    captaincy: number
  }
  rtmTeam?: string
  isLegendary?: boolean
  isWomen?: boolean
  isUnderdog?: boolean
}

export interface Team {
  id: string
  name: string
  score: number
}

interface AuctionContextType {
  players: Player[]
  teams: Team[]
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>
  loading: boolean
  error: string | null
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined)

export const useAuction = () => {
  const context = useContext(AuctionContext)
  if (!context) {
    throw new Error("useAuction must be used within an AuctionProvider")
  }
  return context
}

export const AuctionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [playersResponse, teamsResponse] = await Promise.all([getPlayers(), getTeams()])
        setPlayers(playersResponse.data)
        setTeams(teamsResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to fetch data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <AuctionContext.Provider value={{ players, teams, setPlayers, setTeams, loading, error }}>
      {children}
    </AuctionContext.Provider>
  )
}

