import { sql } from "../../src/config/db";
import bcrypt from "bcryptjs";
import {
  Customer,
  CustomerRegistration,
  CustomerLogin,
  CustomerProfileUpdate,
} from "../models/customer.model";

// ============================
// CREATE CUSTOMERS TABLE
// ============================
export const createCustomerTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS customers (
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

// ============================
// CREATE CUSTOMER (NO PASSWORD)
// ============================
export const createCustomer = async (
  customer: Omit<Customer, "id" | "created_at" | "updated_at">
) => {
  const { email, first_name, last_name, image } = customer;

  const result = await sql`
    INSERT INTO customers (email, first_name, last_name, image)
    VALUES (${email}, ${first_name}, ${last_name}, ${image})
    RETURNING id, email, first_name, last_name, created_at, updated_at;
  `;

  return result[0] as Customer;
};

// ============================
// GET ALL CUSTOMERS
// ============================
export const getCustomers = async () => {
  return (await sql`
    SELECT id, email, first_name, last_name, phone, address, image, created_at, updated_at
    FROM customers
    ORDER BY created_at DESC;
  `) as Customer[];
};

// ============================
// GET CUSTOMER BY ID
// ============================
export const getCustomerById = async (id: number) => {
  const result = await sql`
    SELECT id, email, first_name, last_name, phone,  address, image, is_active, last_login, created_at, updated_at
    FROM customers
    WHERE id = ${id};
  `;

  return result[0] as Customer | undefined;
};

// ============================
// UPDATE BASIC CUSTOMER FIELDS
// ============================
export const updateCustomer = async (
  id: number,
  customerData: Partial<Customer>
) => {
  const { email, first_name, last_name, image } = customerData;

  const result = await sql`
    UPDATE customers
    SET
      email = COALESCE(${email}, email),
      first_name = COALESCE(${first_name}, first_name),
      last_name = COALESCE(${last_name}, last_name),
      image = COALESCE(${image}, image),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING id, email, first_name, last_name, image, created_at, updated_at;
  `;

  return result[0] as Customer | undefined;
};

// ============================
// REGISTER CUSTOMER (WITH PASSWORD)
// ============================
export const registerCustomer = async (customerData: CustomerRegistration) => {
  const { email, first_name, last_name, password, phone, address, image} =
    customerData;

  const existing = await getCustomerByEmail(email);
  if (existing) {
    throw new Error("Customer with this email already exists");
  }

  const password_hash = await bcrypt.hash(password, 10);

  const result = await sql`
    INSERT INTO customers (email, first_name, last_name, password_hash, phone, address, image)
    VALUES (${email}, ${first_name}, ${last_name}, ${password_hash}, ${phone}, ${address}, ${image})
    RETURNING id, email, first_name, last_name, phone, address, image, is_active, created_at, updated_at;
  `;

  return result[0] as Customer;
};

// ============================
// LOGIN CUSTOMER
// ============================
export const loginCustomer = async (loginData: CustomerLogin) => {
  const { email, password } = loginData;

  const customer = await getCustomerByEmailWithPassword(email);
  if (!customer || !customer.password_hash) {
    throw new Error("Invalid email or password");
  }

  if (!customer.is_active) {
    throw new Error("Account is deactivated");
  }

  const valid = await bcrypt.compare(password, customer.password_hash);
  if (!valid) {
    throw new Error("Invalid email or password");
  }

  await updateLastLogin(customer.id!);

  const { password_hash, ...safeCustomer } = customer;
  return safeCustomer as Customer;
};

// ============================
// UPDATE FULL CUSTOMER PROFILE
// ============================
export const updateCustomerProfile = async (
  id: number,
  profileData: CustomerProfileUpdate
) => {
  const { first_name, last_name, phone, address, image } = profileData;

  const result = await sql`
    UPDATE customers
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

  return result[0] as Customer | undefined;
};

// ============================
// GET CUSTOMER BY EMAIL (NO PASSWORD)
// ============================
export const getCustomerByEmail = async (email: string) => {
  const result = await sql`
    SELECT id, email, first_name, last_name, phone, address, image, is_active, last_login, created_at, updated_at
    FROM customers
    WHERE email = ${email};
  `;

  return result[0] as Customer | undefined;
};

// ============================
// GET CUSTOMER WITH PASSWORD
// ============================
export const getCustomerByEmailWithPassword = async (email: string) => {
  const result = await sql`
    SELECT id, email, first_name, last_name, password_hash, phone, address, image, is_active, last_login, created_at, updated_at
    FROM customers
    WHERE email = ${email};
  `;

  return result[0] as Customer | undefined;
};

// ============================
// UPDATE LAST LOGIN
// ============================
export const updateLastLogin = async (id: number) => {
  await sql`
    UPDATE customers
    SET last_login = CURRENT_TIMESTAMP
    WHERE id = ${id};
  `;
};

// ============================
// DEACTIVATE CUSTOMER
// ============================
export const deactivateCustomer = async (id: number) => {
  await sql`
    UPDATE customers
    SET is_active = false
    WHERE id = ${id};
  `;
};
