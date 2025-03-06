import express from "express";
import {
  getPowerCards,
  createPowerCard,
  updatePowerCard,
  deletePowerCard,
} from "../controllers/powerCardController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getPowerCards).post(protect, admin, createPowerCard);

router
  .route("/:id")
  .put(protect, admin, updatePowerCard)
  .delete(protect, admin, deletePowerCard);

export default router;
