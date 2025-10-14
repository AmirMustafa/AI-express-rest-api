// User model backed by SQLite via better-sqlite3
import db from "../db/index.js";
import bcrypt from "bcryptjs";

// User schema structure
export function createUserSchema() {
  return {
    id: null,
    email: null,
    password: null,
    name: null,
    createdAt: null,
    updatedAt: null,
  };
}

// Generate unique ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Create a new user
export async function createUser(userData) {
  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash(userData.password, 10);
  const newUser = {
    ...createUserSchema(),
    id: generateId(),
    email: userData.email,
    password: passwordHash,
    name: userData.name,
    createdAt: now,
    updatedAt: now,
  };

  const stmt = db.prepare(
    `INSERT INTO users (id, email, password, name, createdAt, updatedAt)
     VALUES (@id, @email, @password, @name, @createdAt, @updatedAt)`
  );
  stmt.run(newUser);
  return newUser;
}

// Find user by email
export function findByEmail(email) {
  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  return row || null;
}

// Find user by ID
export function findById(id) {
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  return row || null;
}

// Get all users
export function findAll() {
  const rows = db.prepare("SELECT * FROM users ORDER BY createdAt DESC").all();
  return rows;
}

// Update user
export async function updateUser(id, updateData) {
  const existing = findById(id);
  if (!existing) return null;

  const updatedPassword = updateData.password
    ? await bcrypt.hash(updateData.password, 10)
    : existing.password;

  const updated = {
    ...existing,
    ...updateData,
    password: updatedPassword,
    updatedAt: new Date().toISOString(),
  };

  const stmt = db.prepare(
    `UPDATE users SET email = @email, password = @password, name = @name, updatedAt = @updatedAt
     WHERE id = @id`
  );
  stmt.run({
    id,
    email: updated.email,
    password: updated.password,
    name: updated.name,
    updatedAt: updated.updatedAt,
  });

  return findById(id);
}

// Delete user
export function deleteUser(id) {
  const existing = findById(id);
  if (!existing) return null;
  db.prepare("DELETE FROM users WHERE id = ?").run(id);
  return existing;
}

// Check if email already exists
export function emailExists(email) {
  const row = db.prepare("SELECT 1 FROM users WHERE email = ?").get(email);
  return !!row;
}

// Validate user data
export function validateUser(userData) {
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
}
