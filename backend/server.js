import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import playerRoutes from "./routes/playerRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import powerCardRoutes from "./routes/powerCardRoutes.js";
import { login } from "./controllers/authController.js";
import cookieParser from "cookie-parser";
dotenv.config();

mongoose.set("strictQuery", false); // Suppress Mongoose warning

// Connect to DB & Handle Connection Errors
connectDB().catch((err) => {
  console.error("❌ MongoDB Connection Error:", err);
  process.exit(1); // Exit process on failure
});

const app = express();

app.use(cors());
app.use(express.json());

//Enabling cookieParser
app.use(cookieParser())

// Routes
app.use("/api/players", playerRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/users", userRoutes);
app.use("/api/powerCards", powerCardRoutes);
// ✅ Proper Global Error Handler
app.use((err, req, res, _next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

app.get("/api/temp" , (req , res) => res.json({msg : "Success"}))

// ✅ Ensure Port is Free Before Listening
const PORT = process.env.PORT || 5001;

const server = app
  .listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `⚠️ Port ${PORT} is already in use. Trying another port...`
      );
      setTimeout(() => {
        server.close(() => {
          app.listen(PORT + 1, () => {
            console.log(`✅ Server restarted on port ${PORT + 1}`);
          });
        });
      }, 1000);
    }
  });
