import { sql } from "../../src/config/db";
import bcrypt from "bcryptjs";
import {
  Admin,
  AdminLogin,
  AdminRegistration,
  AdminProfileUpdate,
} from "../models/admin.model";

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
      image VARCHAR(500),
      is_active BOOLEAN DEFAULT true,
      last_login TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
};

// Register a new admin
export const registerAdmin = async (data: AdminRegistration) => {
  const { email, first_name, last_name, password, phone, address, image } = data;

  const existing = await getAdminByEmail(email);
  if (existing) throw new Error("Admin with this email already exists");

  const password_hash = await bcrypt.hash(password, 10);

  const result = await sql`
    INSERT INTO admins (email, first_name, last_name, password_hash, phone, address, image)
    VALUES (${email}, ${first_name}, ${last_name}, ${password_hash}, ${phone}, ${address}, ${image})
    RETURNING id, email, first_name, last_name, phone, address, image, is_active, created_at, updated_at;
  `;

  return result[0] as Admin;
};

// Login admin
export const loginAdmin = async (data: AdminLogin) => {
  const { email, password } = data;

  const admin = await getAdminByEmailWithPassword(email);

  if (!admin || !admin.password_hash) {
    throw new Error("Invalid email or password");
  }

  if (!admin.is_active) throw new Error("Account is deactivated");

  const check = await bcrypt.compare(password, admin.password_hash);
  if (!check) throw new Error("Invalid email or password");

  await updateLastLogin(admin.id!);

  const { password_hash, ...safeAdmin } = admin;
  return safeAdmin;
};

// Get all admins
export const getAdmins = async () => {
  return await sql`
    SELECT id, email, first_name, last_name, phone, address, image, is_active, created_at, updated_at
    FROM admins
    ORDER BY created_at DESC;
  `;
};

// Get admin by ID
export const getAdminById = async (id: number) => {
  const result = await sql`
    SELECT id, email, first_name, last_name, phone, address, image, is_active, last_login, created_at, updated_at
    FROM admins
    WHERE id = ${id};
  `;
  return result[0];
};

// Update admin profile
export const updateAdminProfile = async (
  id: number,
  data: AdminProfileUpdate
) => {
  const { first_name, last_name, phone, address, image} = data;

  const result = await sql`
    UPDATE admins
    SET
      first_name = COALESCE(${first_name}, first_name),
      last_name = COALESCE(${last_name}, last_name),
      phone = COALESCE(${phone}, phone),
      address = COALESCE(${address}, address),
      image = COALESCE(${image}, image),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING id, email, first_name, last_name, phone, address, image, is_active, last_login, created_at, updated_at;
  `;
  return result[0];
};

// Deactivate admin
export const deactivateAdmin = async (id: number) => {
  await sql`
    UPDATE admins
    SET is_active = false
    WHERE id = ${id};
  `;
};

// Helpers
export const getAdminByEmail = async (email: string) => {
  const result = await sql`
    SELECT id, email, first_name, last_name, phone, address, image, is_active, last_login, created_at, updated_at
    FROM admins
    WHERE email = ${email};
  `;
  return result[0];
};

export const getAdminByEmailWithPassword = async (email: string) => {
  const result = await sql`
    SELECT *
    FROM admins
    WHERE email = ${email};
  `;
  return result[0];
};

export const updateLastLogin = async (id: number) => {
  await sql`
    UPDATE admins
    SET last_login = CURRENT_TIMESTAMP
    WHERE id = ${id};
  `;
};
