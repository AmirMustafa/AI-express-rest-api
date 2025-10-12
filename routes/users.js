import express from "express";
import {
  signup,
  login,
  getAllUsers,
  getUserById,
} from "../controller/users-controller.js";

const router = express.Router();

// User authentication routes
router.post("/signup", signup);
router.post("/login", login);

// Additional user routes for testing/managing users
router.get("/", getAllUsers);
router.get("/:id", getUserById);

export default router;
