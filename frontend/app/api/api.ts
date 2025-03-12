/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// API functions
export const login = (username: string, password: string) =>
  api.post("/users/login", { username, password });

export const getPlayers = () => api.get("/players");
export const getPlayersByUser = (id: string) => api.get(`/players/user/${id}`);
export const getPlayerById = (id: string) => api.get(`/players/${id}`);

export const createPlayer = async (playerData: any) => {
  const response = await api.post("/players", playerData);
  return response;
};

export const updatePlayer = async (id: string, playerData: any) => {
  const response = await api.put(`/players/${id}`, playerData);
  return response;
};

export const deletePlayer = async (id: string) => {
  const response = await api.delete(`/players/${id}`);
  return response;
};

export const assignPlayer = (id: string, teamData: any) =>
  api.post(`/players/assign/${id}`, teamData);

export const unassignPlayer = (id: string, data: any) =>
  api.post(`players/unassign/${id}`, data);

export const getTeams = () => api.get("/teams");
export const getTeamById = (id: string) => api.get(`/teams/${id}`);
export const createTeam = (teamData: any) => api.post("/teams", teamData);
export const updateTeam = (id: string, teamData: any) =>
  api.put(`/teams/${id}`, teamData);
export const deleteTeam = (id: string) => api.delete(`/teams/${id}`);
export const assignTeam = (id: string, teamData: any) =>
  api.post(`/teams/assign/${id}`, teamData);
export const getPlayersByTeam = (id: string, slot: number) =>
  api.get(`/teams/players/${id}`, { params: { slot: slot } });
export const fetchTeamPurse = (id: string, slot: number) =>
  api.get(`/teams/purse/${id}`, { params: { slot: slot } });

export const getPowerCards = () => api.get("/powerCards");
export const createPowerCard = (powerCardData: any) =>
  api.post("/powerCards", powerCardData);
export const updatePowerCard = (id: string, powerCardData: any) =>
  api.put(`/powerCards/${id}`, powerCardData);
export const deletePowerCard = (id: string) => api.delete(`/powerCards/${id}`);

export const getUsers = () => api.get("/users/");
export const getUserById = (id: string) => api.get(`/users/${id}`);
export const updateUserPurse = (id: string, userData: any) =>
  api.post(`/users/updateWallet/${id}`, userData);
export const getAnalytics = () => api.get("/analytics");

export const setUserScore = (id: string, score: number = 0) =>
  api.post(`/users/score/${id}`, {
    score: score,
  });

export const getOtherTeamsFromSameSlot = (slot: string | number) => {
  return api.get(`/teams/slot/${slot}`);
};

export const getUserPurse = (id: string) => {
  return api.get(`/users/purse/${id}`);
};
export default api;
