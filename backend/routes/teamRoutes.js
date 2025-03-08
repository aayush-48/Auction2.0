import express from "express";
import {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  assignTeam,
<<<<<<< HEAD
  getTeamsOfSlot,
=======
  getPlayersByTeam,
>>>>>>> cab5e6b1a36d45fa7854818e53462e9a0032d4ba
} from "../controllers/teamController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getTeams).post(protect, admin, createTeam);
router
  .route("/:id")
  .get(getTeamById)
  .put(protect, admin, updateTeam)
  .delete(protect, admin, deleteTeam);
router.route("/assign/:id").post(protect, admin, assignTeam);
<<<<<<< HEAD

router.route("/slot/:slot").get(getTeamsOfSlot)
=======
router.route("/players/:id").get(getPlayersByTeam);
>>>>>>> cab5e6b1a36d45fa7854818e53462e9a0032d4ba
export default router;
