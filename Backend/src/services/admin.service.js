"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLastLogin = exports.getAdminByEmailWithPassword = exports.getAdminByEmail = exports.deactivateAdmin = exports.updateAdminProfile = exports.getAdminById = exports.getAdmins = exports.loginAdmin = exports.registerAdmin = exports.createAdminTable = void 0;
const db_1 = require("../../src/config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createAdminTable = async () => {
    await (0, db_1.sql) `
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      password_hash VARCHAR(255),
      phone VARCHAR(20),
      address TEXT,
      is_active BOOLEAN DEFAULT true,
      last_login TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
};
exports.createAdminTable = createAdminTable;
// Register a new admin
const registerAdmin = async (data) => {
    const { email, first_name, last_name, password, phone, address } = data;
    const existing = await (0, exports.getAdminByEmail)(email);
    if (existing)
        throw new Error("Admin with this email already exists");
    const password_hash = await bcryptjs_1.default.hash(password, 10);
    const result = await (0, db_1.sql) `
    INSERT INTO admins (email, first_name, last_name, password_hash, phone, address)
    VALUES (${email}, ${first_name}, ${last_name}, ${password_hash}, ${phone}, ${address})
    RETURNING id, email, first_name, last_name, phone, address, is_active, created_at, updated_at;
  `;
    return result[0];
};
exports.registerAdmin = registerAdmin;
// Login admin
const loginAdmin = async (data) => {
    const { email, password } = data;
    const admin = await (0, exports.getAdminByEmailWithPassword)(email);
    if (!admin || !admin.password_hash) {
        throw new Error("Invalid email or password");
    }
    if (!admin.is_active)
        throw new Error("Account is deactivated");
    const check = await bcryptjs_1.default.compare(password, admin.password_hash);
    if (!check)
        throw new Error("Invalid email or password");
    await (0, exports.updateLastLogin)(admin.id);
    const { password_hash, ...safeAdmin } = admin;
    return safeAdmin;
};
exports.loginAdmin = loginAdmin;
// Get all admins
const getAdmins = async () => {
    return await (0, db_1.sql) `
    SELECT id, email, first_name, last_name, phone, address, is_active, created_at, updated_at
    FROM admins
    ORDER BY created_at DESC;
  `;
};
exports.getAdmins = getAdmins;
// Get admin by ID
const getAdminById = async (id) => {
    const result = await (0, db_1.sql) `
    SELECT id, email, first_name, last_name, phone, address, is_active, last_login, created_at, updated_at
    FROM admins
    WHERE id = ${id};
  `;
    return result[0];
};
exports.getAdminById = getAdminById;
// Update admin profile
const updateAdminProfile = async (id, data) => {
    const { first_name, last_name, phone, address } = data;
    const result = await (0, db_1.sql) `
    UPDATE admins
    SET
      first_name = COALESCE(${first_name}, first_name),
      last_name = COALESCE(${last_name}, last_name),
      phone = COALESCE(${phone}, phone),
      address = COALESCE(${address}, address),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING id, email, first_name, last_name, phone, address, is_active, last_login, created_at, updated_at;
  `;
    return result[0];
};
exports.updateAdminProfile = updateAdminProfile;
// Deactivate admin
const deactivateAdmin = async (id) => {
    await (0, db_1.sql) `
    UPDATE admins
    SET is_active = false
    WHERE id = ${id};
  `;
};
exports.deactivateAdmin = deactivateAdmin;
// Helpers
const getAdminByEmail = async (email) => {
    const result = await (0, db_1.sql) `
    SELECT id, email, first_name, last_name, phone, address, is_active, last_login, created_at, updated_at
    FROM admins
    WHERE email = ${email};
  `;
    return result[0];
};
exports.getAdminByEmail = getAdminByEmail;
const getAdminByEmailWithPassword = async (email) => {
    const result = await (0, db_1.sql) `
    SELECT *
    FROM admins
    WHERE email = ${email};
  `;
    return result[0];
};
exports.getAdminByEmailWithPassword = getAdminByEmailWithPassword;
const updateLastLogin = async (id) => {
    await (0, db_1.sql) `
    UPDATE admins
    SET last_login = CURRENT_TIMESTAMP
    WHERE id = ${id};
  `;
};
exports.updateLastLogin = updateLastLogin;
