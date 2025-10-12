const express = require("express");
const router = express.Router();
const usersController = require("../controller/usersController");

// User authentication routes
router.post("/signup", usersController.signup);
router.post("/login", usersController.login);

// Additional user routes for testing/managing users
router.get("/", usersController.getAllUsers);
router.get("/:id", usersController.getUserById);

module.exports = router;
