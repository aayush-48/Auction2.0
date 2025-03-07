import { isValidObjectId } from "mongoose";
import Player from "../models/Player.js";
import User from "../models/User.js";
import mongoose from "mongoose";
export const getPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPlayersByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(id) });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const player_ids = user.player_ids;

    const players = await Player.find({ _id: { $in: player_ids } });

    res.json(players);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (player) {
      res.json(player);
    } else {
      res.status(404).json({ message: "Player not found" });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createPlayer = async (req, res) => {
  try {
    const player = new Player(req.body);
    const createdPlayer = await player.save();
    res.status(201).json(createdPlayer);
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({ message: "Invalid player data" });
  }
};

export const updatePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (player) {
      Object.assign(player, req.body);
      const updatedPlayer = await player.save();
      res.json(updatedPlayer);
    } else {
      res.status(404).json({ message: "Player not found" });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(400).json({ message: "Invalid player data" });
  }
};

export const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (player) {
      await player.remove();
      res.json({ message: "Player removed" });
    } else {
      res.status(404).json({ message: "Player not found" });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const assignPlayer = async (req, res) => {
  try {
    const { selectedTeam, selectedSlot, finalPrice } = req.body;
    const playerId = req.params.id;

    // Find the user for assignment
    const selectedUser = await User.findOne({
      role: "player",
      ipl_team_id: selectedTeam,
      slot_num: selectedSlot,
    });

    if (!selectedUser) {
      return res
        .status(400)
        .json({ message: "Could not find user for assignment." });
    }

    // Ensure player_ids exists and is an array
    if (!Array.isArray(selectedUser.player_ids)) {
      selectedUser.player_ids = [];
    }

    // Prevent duplicate player assignment to the same user
    if (selectedUser.player_ids.includes(playerId)) {
      return res
        .status(400)
        .json({ message: "Player is already assigned to this user." });
    }

    // Add the player ID and save
    selectedUser.player_ids.push(playerId);
    selectedUser.Purse -= finalPrice;
    await selectedUser.save();

    const player = await Player.findOne({ _id: playerId });
    player.finalPrice.push({ slot_num: selectedSlot, price: finalPrice });
    await player.save();
    return res.status(200).json({ message: "Player assigned successfully" });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const unassignPlayer = async (req, res) => {
  try {
    const { selectedTeam, selectedSlot } = req.body;
    const playerId = req.params.id;

    // Find the user assigned to the player
    const selectedUser = await User.findOne({
      role: "player",
      ipl_team_id: selectedTeam,
      slot_num: selectedSlot,
    });
    if (!selectedUser) {
      return res.status(400).json({ message: "Could not find assigned user." });
    }

    // Ensure player_ids exists and is an array
    if (!Array.isArray(selectedUser.player_ids)) {
      return res
        .status(400)
        .json({ message: "Invalid player assignment data." });
    }

    // Check if the player is assigned to this user
    if (!selectedUser.player_ids.includes(playerId)) {
      return res
        .status(400)
        .json({ message: "Player is not assigned to this user." });
    }
    // Remove the player ID
    selectedUser.player_ids = selectedUser.player_ids.filter(
      (id) => id.toString() !== playerId
    );

    await selectedUser.save();

    // Update player's finalPrice history
    const player = await Player.findOne({ _id: playerId });
    if (player) {
      player.finalPrice = player.finalPrice.filter(
        (entry) => entry.slot_num !== selectedSlot
      );
      await player.save();
    }
    return res.status(200).json({ message: "Player unassigned successfully" });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
