"use client";

import type React from "react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../api/api";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await login(username, password);
      console.log(data);
      
      // Save token to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("id", data.id);
      localStorage.setItem("role", data.role); // Store role for redirection
      localStorage.setItem("slot" , data.slot)

      if(data.score && data.score >= 0){
        localStorage.setItem("userScore" , data.score)
      }

      // Redirect based on role
      if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid credentials");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-russian-violet to-tekhelet">
      <div className="bg-french-violet bg-opacity-30 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold mb-6 text-center text-heliotrope">
          Login
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-mauve mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-russian-violet bg-opacity-50 rounded-md text-white"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-mauve mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-russian-violet bg-opacity-50 rounded-md text-white"
              required
            />
          </div>
          <Button
            disabled={loading}
            type="submit"
            className="w-full bg-amethyst hover:bg-heliotrope text-white font-bold py-2 px-4 rounded transition-colors duration-300"
          >
            {loading ? <Loader2 className="animate-spin" /> : ""}
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
