import Team from "../models/Team.js";
import User from "../models/User.js";
import Player from "../models/Player.js";
export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (team) {
      res.json(team);
    } else {
      res.status(404).json({ message: "Team not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createTeam = async (req, res) => {
  try {
    const team = new Team(req.body);
    const createdTeam = await team.save();
    res.status(201).json(createdTeam);
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: "Invalid team data" });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (team) {
      Object.assign(team, req.body);
      const updatedTeam = await team.save();
      res.json(updatedTeam);
    } else {
      res.status(404).json({ message: "Team not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ message: "Invalid team data" });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (team) {
      await team.remove();
      res.json({ message: "Team removed" });
    } else {
      res.status(404).json({ message: "Team not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const assignTeam = async (req, res) => {
  try {
    const { userId, finalPrice } = req.body;
    const teamId = req.params.id;

    // Find the user for assignment
    const selectedUser = await User.findOne({ _id: userId });

    if (!selectedUser) {
      return res
        .status(400)
        .json({ message: "Could not find user for assignment." });
    }

    // Assign the team to the user
    selectedUser.ipl_team_id = teamId;
    selectedUser.Purse -= finalPrice;
    await selectedUser.save();

    return res.status(200).json({ message: "Team assigned successfully" });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getTeamsOfSlot = async(req , res) =>{
  const {slot : slot_num} = req.params

  const users = await User.find({slot_num , role : "player"})
  const teams = await Team.find()
  // console.log(teams);

  if(!teams || teams.length === 0){
    return res.status(404).json({msg : "No teams"})
  }
  if(!users || users.length === 0){
    return res.status(404).json({msg : "Players not found."})
  }
  
  const teamWiseScore = {}

  teams.forEach((team) => {
    teamWiseScore[team.name] = 0;
  });

  // Accumulate scores for each team
  users.forEach((user) => {
    const team = teams.find((team) => team._id.equals(user.ipl_team_id));
    if (team) {
      teamWiseScore[team.name] += user.Score || 0; // Add user's score to the team
    }
  });

  const sortedTeams = Object.entries(teamWiseScore)
      .map(([teamName, score]) => ({ teamName, score }))
      .sort((a, b) => b.score - a.score); 
  

  res.status(200).json({msg : "Route is working" , sortedTeams })
}
export const getPlayersByTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const { slot } = req.query;
    const team = await Team.findOne({ teamId: teamId });
    if (!team) return res.status(404).json({ message: "Team not found" });
    const user = await User.findOne({
      ipl_team_id: team._id.toString(),
      slot_num: slot,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const player_ids = user.player_ids;

    const players = await Player.find({ _id: { $in: player_ids } });

    res.json(players);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
