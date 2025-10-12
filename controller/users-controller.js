import {
  createUser,
  findByEmail,
  findById,
  findAll,
  emailExists,
  validateUser,
} from "../models/user.js";

// User signup
export function signup(req, res) {
  try {
    const { email, password, name } = req.body;

    // Validate input data
    const validation = validateUser({ email, password, name });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    // Check if user already exists
    if (emailExists(email)) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create new user
    const newUser = createUser({ email, password, name });

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// User login
export function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password (in real app, compare with hashed password)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Get all users (for testing purposes)
export function getAllUsers(req, res) {
  try {
    const users = findAll();
    // Remove passwords from response
    const usersWithoutPasswords = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: {
        users: usersWithoutPasswords,
        count: usersWithoutPasswords.length,
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Get user by ID
export function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return user data (excluding password)
    const { password, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
