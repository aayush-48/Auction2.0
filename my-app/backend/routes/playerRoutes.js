import express from "express"
import {
  getPlayers,
  getPlayerById,
  getPlayersByTeam,
  createPlayer,
  updatePlayer,
  deletePlayer,
} from "../controllers/playerController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

router.route("/").get(getPlayers).post(protect, admin, createPlayer)
router.route("/:id").get(getPlayerById).put(protect, admin, updatePlayer).delete(protect, admin, deletePlayer)
router.route("/team/:team").get(getPlayersByTeam)

export default router

