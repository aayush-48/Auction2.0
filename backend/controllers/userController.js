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

export const updateScore = async (req, res) => {
  const { id } = req.params;
  const { score } = req.body;

  const user = await User.findOne({ _id: id });
  if (!user) {
    res.status(404).json({ msg: "user not found" });
  }
  if (!score) {
    score = 0;
  }

  user.Score = score;
  await user.save();

  res
    .status(200)
    .json({ msg: "Route working and score update", newScore: user.Score });
};
