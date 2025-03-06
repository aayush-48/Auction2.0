import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserWallet,
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
router.route("/login").post(login);
export default router;
