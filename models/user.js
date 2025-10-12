// User model - Simple object-based approach without classes
const users = []; // In-memory storage for demo purposes

// User schema structure
const createUserSchema = {
  id: null,
  email: null,
  password: null,
  name: null,
  createdAt: null,
  updatedAt: null,
};

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// User model functions
const User = {
  // Create a new user
  create: (userData) => {
    const newUser = {
      ...createUserSchema,
      id: generateId(),
      email: userData.email,
      password: userData.password, // In real app, this should be hashed
      name: userData.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    return newUser;
  },

  // Find user by email
  findByEmail: (email) => {
    return users.find((user) => user.email === email);
  },

  // Find user by ID
  findById: (id) => {
    return users.find((user) => user.id === id);
  },

  // Get all users
  findAll: () => {
    return users;
  },

  // Update user
  update: (id, updateData) => {
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };
      return users[userIndex];
    }
    return null;
  },

  // Delete user
  delete: (id) => {
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex !== -1) {
      return users.splice(userIndex, 1)[0];
    }
    return null;
  },

  // Check if email already exists
  emailExists: (email) => {
    return users.some((user) => user.email === email);
  },

  // Validate user data
  validate: (userData) => {
    const errors = [];

    if (!userData.email) {
      errors.push("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.push("Email format is invalid");
    }

    if (!userData.password) {
      errors.push("Password is required");
    } else if (userData.password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }

    if (!userData.name) {
      errors.push("Name is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

module.exports = User;
