import Player from "../models/Player.js"

export const getPlayers = async (req, res) => {
  try {
    const players = await Player.find()
    res.json(players)
  } catch (error) {
    console.log("Error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getPlayersByTeam = async (req, res) => {
  try {
    const { team } = req.params
    const players = await Player.find({ team })
    res.json(players)
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ message: "Server error" })
  }
}

export const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)
    if (player) {
      res.json(player)
    } else {
      res.status(404).json({ message: "Player not found" })
    }
  } catch (error) {
    console.log("Error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const createPlayer = async (req, res) => {
  try {
    const player = new Player(req.body)
    const createdPlayer = await player.save()
    res.status(201).json(createdPlayer)
  } catch (error) {
    console.log("Error:", error)
    res.status(400).json({ message: "Invalid player data" })
  }
}

export const updatePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)
    if (player) {
      Object.assign(player, req.body)
      const updatedPlayer = await player.save()
      res.json(updatedPlayer)
    } else {
      res.status(404).json({ message: "Player not found" })
    }
  } catch (error) {
    console.log("Error:", error)
    res.status(400).json({ message: "Invalid player data" })
  }
}

export const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)
    if (player) {
      await player.remove()
      res.json({ message: "Player removed" })
    } else {
      res.status(404).json({ message: "Player not found" })
    }
  } catch (error) {
    console.log("Error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

