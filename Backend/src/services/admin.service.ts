import bcrypt from "bcryptjs";
import { sql } from "../config/db";
import {
  Admin,
  AdminLogin,
  AdminRegistration,
  AdminProfileUpdate,
} from "../models/admin.model";

export const registerAdmin = async (adminData: AdminRegistration) => {
  const { email, first_name, last_name, password, phone, address } = adminData;

  // Check if admin already exists
  const existingAdmin = await getAdminByEmail(email);
  if (existingAdmin) {
    throw new Error("Admin with this email already exists");
  }

  // Hash the password
  const password_hash = await bcrypt.hash(password, 10);

  const result = await sql`
    INSERT INTO admins (email, first_name, last_name, password_hash, phone, address)
    VALUES (${email}, ${first_name}, ${last_name}, ${password_hash}, ${phone}, ${address})
    RETURNING id, email, first_name, last_name, phone, address, is_active, created_at, updated_at;
  `;
  return result[0] as Admin;
};

export const loginAdmin = async (loginData: AdminLogin) => {
  const { email, password } = loginData;

  // Get admin by email
  const admin = await getAdminByEmailWithPassword(email);
  if (!admin) {
    throw new Error("Invalid email or password");
  }

  // Check if admin is active
  if (!admin.is_active) {
    throw new Error("Admin account is deactivated");
  }

  // Verify password
  if (!admin.password_hash) {
    throw new Error("Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(password, admin.password_hash);

  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  // Update last login timestamp
  await updateLastLogin(admin.id!);

  // Return admin without password hash
  const { password_hash, ...adminWithoutPassword } = admin;
  return adminWithoutPassword as Admin;
};

// ============================
// GET ADMIN BY EMAIL
// ============================
export const getAdminByEmail = async (email: string) => {
  const result = await sql`
    SELECT id, email, first_name, last_name, phone, address, is_active, last_login, created_at, updated_at
    FROM admins
    WHERE email = ${email};
  `;
  return result[0] as Admin | undefined;
};

// ============================
// GET ADMIN BY ID
// ============================
export const getAdminById = async (id: number) => {
  const result = await sql`
    SELECT id, email, first_name, last_name, phone, address, is_active, last_login, created_at, updated_at
    FROM admins
    WHERE id = ${id};
  `;
  return result[0] as Admin | undefined;
};

// ============================
// GET ADMIN WITH PASSWORD BY EMAIL
// ============================
export const getAdminByEmailWithPassword = async (email: string) => {
  const result = await sql`
    SELECT *
    FROM admins
    WHERE email = ${email};
  `;
  return result[0] as Admin | undefined;
};

// ============================
// GET ALL ADMINS
// ============================
export const getAdmins = async () => {
  return (await sql`
    SELECT id, email, first_name, last_name, is_active, last_login, created_at, updated_at
    FROM admins
    ORDER BY created_at DESC;
  `) as Admin[];
};

// ============================
// UPDATE ADMIN PROFILE
// ============================
export const updateAdminProfile = async (
  id: number,
  profileData: AdminProfileUpdate
) => {
  const { first_name, last_name, phone, address } = profileData;

  const result = await sql`
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
  return result[0] as Admin | undefined;
};

// ============================
// UPDATE LAST LOGIN
// ============================
export const updateLastLogin = async (id: number) => {
  await sql`
    UPDATE admins 
    SET last_login = CURRENT_TIMESTAMP 
    WHERE id = ${id};
  `;
};

// ============================
// DEACTIVATE ADMIN
// ============================
export const deactivateAdmin = async (id: number) => {
  await sql`
    UPDATE admins 
    SET is_active = false 
    WHERE id = ${id};
  `;
};

// ============================
// CREATE ADMIN TABLE
// ===========================
export const createAdminTable = async () => {
  await sql`
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
