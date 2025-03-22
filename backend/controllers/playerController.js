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
        .json({ error: "User not found for selected team and slot" });
    }

    if (selectedUser.player_ids.length >= 11) {
      return res.status(400).json({ error: "Team already has 11 players" });
    }
    if (finalPrice > selectedUser.Purse) {
      return res.status(400).json({ error: "Insufficient purse value" });
    }

    // Ensure player_ids exists and is an array
    if (!Array.isArray(selectedUser.player_ids)) {
      selectedUser.player_ids = [];
    }

    // Prevent duplicate player assignment to the same user
    if (selectedUser.player_ids.includes(playerId)) {
      return res
        .status(400)
        .json({ error: "Player already assigned to this user" });
    }

    // Fetch the player details
    const player = await Player.findOne({ _id: playerId });
    if (!player) {
      return res.status(400).json({ error: "Player not found" });
    }

    // Category Limits
    const categoryLimits = {
      Batsman: { max: 4 },
      Bowler: { max: 4 },
      "All Rounder": { max: 3 },
      "Wicket Keeper": { max: 1 },
      Foreign: { max: 4 },
      Women: { max: 1 },
      Underdogs: { max: 1 },
      Legendary: { max: 1 },
    };

    // Count players in each category
    const userPlayers = await Player.find({
      _id: { $in: selectedUser.player_ids },
    });

    const categoryCount = {
      Batsman: 0,
      Bowler: 0,
      "All Rounder": 0,
      "Wicket Keeper": 0,
      Foreign: 0,
      Women: 0,
      Underdogs: 0,
      Legendary: 0,
    };

    userPlayers.forEach((p) => {
      categoryCount[p.type] += 1;
      if (p.country !== "ind") categoryCount["Foreign"] += 1;
      if (p.gender === "female") categoryCount["Women"] += 1;
      if (p.isUnderdog) categoryCount["Underdogs"] += 1;
      if (p.isLegendary) categoryCount["Legendary"] += 1;
    });

    if (
      player.type === "Batsman" ||
      player.type === "Bowler" ||
      player.type === "All Rounder" ||
      player.type === "Wicket Keeper"
    ) {
      if (categoryCount[player.type] >= categoryLimits[player.type].max) {
        selectedUser.Score -= 100; // Deduct 100 score points
        await selectedUser.save();
        return res.status(400).json({
          error: `Maximum limit reached for ${player.type}s`,
        });
      }
    }

    // Identify the category of the new player
    let playerCategory = player.type;
    if (player.country !== "ind") playerCategory = "Foreign";
    if (player.gender === "female") playerCategory = "Women";
    if (player.isUnderdog) playerCategory = "Underdogs";
    if (player.isLegendary) playerCategory = "Legendary";

    // Check if adding the player exceeds the maximum limit
    if (categoryCount[playerCategory] >= categoryLimits[playerCategory].max) {
      selectedUser.Score -= 100; // Deduct 100 score points
      await selectedUser.save(); // Save the updated score
      return res.status(400).json({
        error: `Maximum limit reached for ${playerCategory} players`,
      });
    }

    // Check if the player has already been sold in the same slot
    const alreadySold = player.finalPrice.some(
      (entry) => entry.slot_num.toString() === selectedSlot.toString()
    );

    if (alreadySold) {
      return res
        .status(400)
        .json({ error: "Player already sold in this slot" });
    }

    // Assign the player since they are within limits
    selectedUser.player_ids.push(playerId);
    selectedUser.Purse -= finalPrice;
    await selectedUser.save();

    // Update the player's final price list
    player.finalPrice.push({ slot_num: selectedSlot, price: finalPrice });
    await player.save();

    return res.status(200).json({
      message: "Player assigned successfully",
      playerName: player.name,
      teamName: selectedUser.name || "Selected team",
    });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: "Server error" });
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

    // Retrieve the player's final price for this slot
    const player = await Player.findOne({ _id: playerId });
    if (!player) {
      return res.status(400).json({ message: "Player not found." });
    }

    // Find the price for the selected slot
    const slotPriceEntry = player.finalPrice.find(
      (entry) => entry.slot_num === selectedSlot
    );

    if (slotPriceEntry) {
      // Refund the amount to the user's balance
      selectedUser.Purse += Number(slotPriceEntry.price); // Assuming 'price' stores the final price

      // Remove the price entry from player's finalPrice
      player.finalPrice = player.finalPrice.filter(
        (entry) => entry.slot_num !== selectedSlot
      );
    }

    // Remove the player ID from the user's assigned players
    selectedUser.player_ids = selectedUser.player_ids.filter(
      (id) => id.toString() !== playerId
    );

    // Save updated user and player data
    await selectedUser.save();
    await player.save();

    return res
      .status(200)
      .json({ message: "Player unassigned and refund processed successfully" });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
