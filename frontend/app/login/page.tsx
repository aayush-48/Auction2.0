"use client";

import type React from "react";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await login(username, password);
      console.log(data);

      // Save token to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("id", data.id);
      localStorage.setItem("role", data.role);
      localStorage.setItem("slot", data.slot);

      if (data.score && data.score >= 0) {
        localStorage.setItem("userScore", data.score);
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
  }; // <== Ensure this function is properly closed here

  // Move backgroundStyle outside handleSubmit
  const backgroundStyle = {
    backgroundImage: "url('/images/ipl_bg.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100vw",
  };

  return (
    <div style={backgroundStyle} className="min-h-screen flex items-center justify-center">
      <div className="bg-[#14a39e] bg-opacity-25 backdrop-blur-lg p-8 rounded-xl shadow-xl w-96 border-2 border-[#14a39e] relative overflow-hidden">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#031230]">
          Login
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-[#031230] mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-white bg-opacity-20 backdrop-blur-md rounded-md text-white placeholder-gray-300 border border-[#00A6FF] focus:border-[#00C8FF] focus:outline-none transition-all duration-300 hover:shadow-neon"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-[#031230] mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-white bg-opacity-20 backdrop-blur-md rounded-md text-white placeholder-gray-300 border border-[#00A6FF] focus:border-[#00C8FF] focus:outline-none transition-all duration-300 hover:shadow-neon"
              required
            />
          </div>
          <Button
            disabled={loading}
            type="submit"
            className="w-full bg-[#031230] hover:bg-[rgb(8,143,143)] text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-neon"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : ""}
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}