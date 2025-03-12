import User from "../models/User.js";
import cookie from "cookie";

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

export const fetchUserWallet = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json({ purseValue: user.Purse });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: "Invalid User data" });
  }
};

export const updateScore = async (req, res) => {
  const { id } = req.params;
  let { score } = req.body;

  const user = await User.findOne({ _id: id }).populate("player_ids");
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  //Ensure user does not already have a positive score
  if (user.Score > 0) {
    return res
      .status(400)
      .json({ msg: "Cannot try to submit more than once!" });
  }

  // Ensure score is valid
  if (!score) {
    score = 0;
  }

  // Categorization based on the given constraints
  let categoryCounts = {
    BATSMAN: 0,
    BOWLER: 0,
    "ALL ROUNDER": 0,
    "WICKET KEEPER": 0,
    FOREIGN: 0,
    WOMEN: 0,
    UNDERDOGS: 0,
    LEGENDARY: 0,
  };

  user.player_ids.forEach((player) => {
    if (player.type === "Batsman") categoryCounts.BATSMAN++;
    if (player.type === "Bowler") categoryCounts.BOWLER++;
    if (player.type === "All Rounder") categoryCounts["ALL ROUNDER"]++;
    if (player.type === "Wicket Keeper") categoryCounts["WICKET KEEPER"]++;
    if (player.country !== "India") categoryCounts.FOREIGN++;
    if (player.gender === "female") categoryCounts.WOMEN++;
    if (player.isUnderdog) categoryCounts.UNDERDOGS++;
    if (player.isLegendary) categoryCounts.LEGENDARY++;
  });

  // Minimum category constraints
  const constraints = {
    BATSMAN: 2,
    BOWLER: 2,
    "ALL ROUNDER": 2,
    "WICKET KEEPER": 1,
    FOREIGN: 0,
    WOMEN: 1,
    UNDERDOGS: 1,
    LEGENDARY: 1,
  };

  // Validate team composition
  for (const category in constraints) {
    if (categoryCounts[category] < constraints[category]) {
      return res
        .status(400)
        .json({ msg: `Minimum requirement not met for ${category}` });
    }
  }

  // Update user score
  user.Score += score;
  await user.save();

  return res
    .status(200)
    .json({ msg: "Score updated successfully", newScore: user.Score });
};
