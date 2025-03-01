import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

export const login = (username: string, password: string) =>
  api.post("/users/login", { username, password, slot_number: 0 });

export const getPlayers = () => api.get("/players");
export const getPlayersByTeam = (team: string) =>
  api.get(`/players/team/${team}`);
export const getPlayerById = (id: string) => api.get(`/players/${id}`);
export const createPlayer = (playerData: any) =>
  api.post("/players", playerData);
export const updatePlayer = (id: string, playerData: any) =>
  api.put(`/players/${id}`, playerData);
export const deletePlayer = (id: string) => api.delete(`/players/${id}`);
export const assignPlayer = (id: string, teamData: any) =>
  api.post(`/players/assign/${id}`, teamData);

export const getTeams = () => api.get("/teams");
export const getTeamById = (id: string) => api.get(`/teams/${id}`);
export const createTeam = (teamData: any) => api.post("/teams", teamData);
export const updateTeam = (id: string, teamData: any) =>
  api.put(`/teams/${id}`, teamData);
export const deleteTeam = (id: string) => api.delete(`/teams/${id}`);
export const assignTeam = (id: string, teamData: any) =>
  api.post(`/teams/assign/${id}`, teamData);

export const getPowerCards = () => api.get("/powerCards");
export const createPowerCard = (powerCardData: any) =>
  api.post("/powerCards", powerCardData);
export const updatePowerCard = (id: string, powerCardData: any) =>
  api.put(`/powerCards/${id}`, powerCardData);
export const deletePowerCard = (id: string) => api.delete(`/powerCards/${id}`);

export const getUsers = () => api.get("/users");
export const updateUserPurse = (id: string, userData: any) =>
  api.post(`/users/updateWallet/${id}`, userData);
export const getAnalytics = () => api.get("/analytics");

export default api;
