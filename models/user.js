const db = require('../db');
const { z } = require('zod');

// Schema for validating user data
const UserSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }).max(100),
  last_name: z.string().max(100).optional().nullable(),
  email: z.string().email({ message: "Invalid email address" }).max(100),
  gender: z.string().max(50).optional().nullable(),
  user: z.string().max(100).optional().nullable()
});
// Partial schema for PATCH — all fields optional
const PatchUserSchema = UserSchema.partial();


class User {
  // Static validation helper
  static validate(data) {
    return UserSchema.safeParse(data);
  }

  // Validation for PATCH (all fields optional, at least one required)
  static validatePatch(data) {
    if (!data || Object.keys(data).length === 0) {
      return { success: false, error: { flatten: () => ({ fieldErrors: { _: ['At least one field is required'] } }) } };
    }
    return PatchUserSchema.safeParse(data);
  }

  // Fetch all users
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM users');
    return rows;
  }

  // Fetch a user by ID
  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  }
  static async update(id, userData) {
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(userData)) {
      fields.push(`${key} = ?`);
      values.push(value ?? null);
    }
    values.push(id);
    const [result] = await db.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    if (result.affectedRows === 0) return null;
    return User.getById(id);
  }
  static async delete(id) {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows;
  }

  // Insert a new user
  static async create(userData) {
    const { first_name, last_name, email, gender, user } = userData;
    const [result] = await db.query(
      'INSERT INTO users (first_name, last_name, email, gender, user) VALUES (?, ?, ?, ?, ?)',
      [
        first_name,
        last_name || null,
        email,
        gender || null,
        user || null
      ]
    );
    return result.insertId;
  }
}

module.exports = { User, UserSchema };
