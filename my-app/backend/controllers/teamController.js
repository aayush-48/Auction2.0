import Team from "../models/Team.js"

export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find()
    res.json(teams)
  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
    if (team) {
      res.json(team)
    } else {
      res.status(404).json({ message: "Team not found" })
    }
  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const createTeam = async (req, res) => {
  try {
    const team = new Team(req.body)
    const createdTeam = await team.save()
    res.status(201).json(createdTeam)
  } catch (error) {
    console.error("Error:", error)
    res.status(400).json({ message: "Invalid team data" })
  }
}

export const updateTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
    if (team) {
      Object.assign(team, req.body)
      const updatedTeam = await team.save()
      res.json(updatedTeam)
    } else {
      res.status(404).json({ message: "Team not found" })
    }
  } catch (error) {
    console.error("Error:", error)
    res.status(400).json({ message: "Invalid team data" })
  }
}

export const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
    if (team) {
      await team.remove()
      res.json({ message: "Team removed" })
    } else {
      res.status(404).json({ message: "Team not found" })
    }
  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

