import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserWallet,
  updateScore,
  fetchUserWallet,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { login } from "../controllers/authController.js";
const router = express.Router();

router.route("/").get(getUsers).post(protect, admin, createUser);
router
  .route("/:id")
  .get(getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

router.route("/updateWallet/:id").post(protect, admin, updateUserWallet);
router.route("/purse/:id").get(fetchUserWallet);
router.route("/login").post(login);
router.route("/score/:id").post(updateScore);

export default router;
