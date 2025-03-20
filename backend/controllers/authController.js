import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 1. Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 2. Use comparePassword method
    const isPasswordCorrect = await user.comparePassword(password);
    console.log(isPasswordCorrect);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials(wrong password)" });
    }
    

    // 3. Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 4. Return success response based on Score
    const response = {
      token,
      id: user._id,
      role: user.role,
      slot: user.slot_num,
    };

    if (user.Score > 0) {
      response.score = user.Score;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};