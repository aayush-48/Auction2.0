import Player from "../models/Player.js";
import User from "../models/User.js";
export const getPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPlayersByTeam = async (req, res) => {
  try {
    const { team } = req.params;
    const players = await Player.find({ team });
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
