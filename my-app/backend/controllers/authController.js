import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const login = async (req, res) => {
  try {
    const { username, password, slotNumber } = req.body
    const user = await User.findOne({ username, slotNumber })

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" })

      res.json({
        token,
        role: user.role,
      })
    } else {
      console.error("Login failed: Invalid credentials") // Prints error if login fails
      res.status(401).json({ message: "Invalid credentials" })
    }
  } catch (error) {
    console.error("Login error:", error) // Logs full error details
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
