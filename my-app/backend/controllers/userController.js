import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const Users = await User.find();
    res.json(Users);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const User = await User.findById(req.params.id);
    if (User) {
      res.json(User);
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
    const User = new User(req.body);
    const createdUser = await User.save();
    res.status(201).json(createdUser);
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: "Invalid User data" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const User = await User.findById(req.params.id);
    if (User) {
      Object.assign(User, req.body);
      const updatedUser = await User.save();
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
    const User = await User.findById(req.params.id);
    if (User) {
      await User.remove();
      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
