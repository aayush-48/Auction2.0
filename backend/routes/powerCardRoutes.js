import express from "express";
import {
  getPowerCards,
  createPowerCard,
  updatePowerCard,
  deletePowerCard,
  assignPowerCard,
  usedPowerCard,
  getPowerCardsByUserId,
} from "../controllers/powerCardController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getPowerCards).post(protect, admin, createPowerCard);
router.route("/user/:id").get(getPowerCardsByUserId);
router
  .route("/:id")
  .put(protect, admin, updatePowerCard)
  .delete(protect, admin, deletePowerCard);

router.route("/assign/:id").post(assignPowerCard).patch(usedPowerCard);

export default router;
