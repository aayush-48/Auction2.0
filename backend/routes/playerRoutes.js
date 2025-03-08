import express from "express";
import {
  getPlayers,
  getPlayerById,
  getPlayersByUser,
  createPlayer,
  updatePlayer,
  deletePlayer,
  assignPlayer,
  unassignPlayer,
} from "../controllers/playerController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getPlayers).post(protect, admin, createPlayer);
router
  .route("/:id")
  .get(getPlayerById)
  .put(protect, admin, updatePlayer)
  .delete(protect, admin, deletePlayer);
router.route("/user/:id").get(getPlayersByUser);
router.route("/assign/:id").post(assignPlayer);
router.route("/unassign/:id").post(unassignPlayer);
export default router;
