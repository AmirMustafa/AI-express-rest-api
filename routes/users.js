const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getAllUsers,
  getUserById,
} = require("../controller/usersController");

// User authentication routes
router.post("/signup", signup);
router.post("/login", login);

// Additional user routes for testing/managing users
router.get("/", getAllUsers);
router.get("/:id", getUserById);

module.exports = router;
