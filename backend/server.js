import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "http"; // Required for WebSockets
import { WebSocketServer } from "ws"; // WebSocket Server
import connectDB from "./config/db.js";
import playerRoutes from "./routes/playerRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import powerCardRoutes from "./routes/powerCardRoutes.js";
import { login } from "./controllers/authController.js";
import cookieParser from "cookie-parser";

dotenv.config();

mongoose.set("strictQuery", false);

// Connect to MongoDB
connectDB().catch((err) => {
  console.error("❌ MongoDB Connection Error:", err);
  process.exit(1);
});

const app = express();
const server = createServer(app); // Create HTTP server for WebSockets

app.use(cors());
app.use(express.json());

//Enabling cookieParser
app.use(cookieParser());

// Routes
app.use("/api/players", playerRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/users", userRoutes);
app.use("/api/powerCards", powerCardRoutes);

// Global Error Handler
app.use((err, req, res, _next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
