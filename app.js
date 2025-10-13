import express from "express";
import usersRoutes from "./routes/users.js";
import "./db/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use("/users", usersRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to AI Express REST API",
    version: "1.0.0",
    endpoints: {
      users: {
        signup: "POST /users/signup",
        login: "POST /users/login",
        getAllUsers: "GET /users",
        getUserById: "GET /users/:id",
      },
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
  console.log(`Users API available at http://localhost:${PORT}/users`);
});

export default app;
