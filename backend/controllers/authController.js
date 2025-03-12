import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    // console.log(user);
    
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      if(user.Score <= 0){

        res.status(200).json({
          token,
          id: user._id,
          role: user.role,
          slot : user.slot_num
        });
      } else {
        
        res.status(200).json({
          token,
          id: user._id,
          role: user.role,
          slot : user.slot_num,
          score : user.Score
        });
      }
    } else {
      console.error("Login failed: Invalid credentials"); // Prints error if login fails
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error); // Logs full error details
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
