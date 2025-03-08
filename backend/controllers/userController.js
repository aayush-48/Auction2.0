import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const createdUser = await user.save();
    res.status(201).json(createdUser);
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: "Invalid User data" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      Object.assign(user, req.body);
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: "Invalid User data" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.remove();
      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserWallet = async (req, res) => {
  try {
    if (req.body.purseValue < 0) {
      res.status(400).json({ message: "Invalid purse amount" });
      return;
    }
    const user = await User.findById(req.params.id);
    if (user) {
      Object.assign(user, { ...user, Purse: req.body.purseValue });
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: "Invalid User data" });
  }
};

export const handleSubmit = async (req, res) => {
  try {
    const userId = req.params.id;
    const { score } = req.body;

    // Fetch user data (assuming user model has player_ids)
    const user = await User.findById(userId).populate("player_ids");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const players = user.player_ids;

    // Count players based on their attributes
    let counts = {
      batsman: 0,
      bowler: 0,
      allrounder: 0,
      wicketkeeper: 0,
      foreign: 0,
      women: 0,
      underdogs: 0,
      legendary: 0,
    };

    players.forEach((player) => {
      if (player.type === "Batsman") counts.batsman++;
      if (player.type === "Bowler") counts.bowler++;
      if (player.type === "All Rounder") counts.allrounder++;
      if (player.type === "Wicket Keeper") counts.wicketkeeper++;

      if (player.country !== "ind") counts.foreign++;
      if (player.gender === "female") counts.women++;
      if (player.isUnderdog) counts.underdogs++;
      if (player.isLegendary) counts.legendary++;
    });

    // Define constraints and penalties
    const violations = [];
    if (counts.batsman < 2 || counts.batsman > 4)
      violations.push("Batsman count out of range");
    if (counts.bowler < 2 || counts.bowler > 4)
      violations.push("Bowler count out of range");
    if (counts.allrounder < 2 || counts.allrounder > 3)
      violations.push("All-Rounder count out of range");
    if (counts.wicketkeeper !== 1)
      violations.push("Wicket-Keeper count must be 1");
    if (counts.foreign > 4) violations.push("Foreign players exceed limit");
    if (counts.women < 1) violations.push("At least one woman required");
    if (counts.underdogs < 1) violations.push("At least one underdog required");
    if (counts.legendary < 1)
      violations.push("At least one legendary player required");

    // Deduct points based on violations
    let penalty = violations.length * 10; // Deduct 10 points per violation
    const newScore = Math.max(0, score - penalty); // Ensure score doesn't go below 0

    // Update user's score
    user.Score = newScore;
    await user.save();

    res.status(200).json({ message: "Score updated", newScore, violations });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
