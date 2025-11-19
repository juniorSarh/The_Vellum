import { sql } from "../../src/config/db";
import bcrypt from "bcryptjs";

export interface Customer {
  id?: number;
  email: string;
  first_name: string;
  last_name: string;
  password_hash?: string;
  phone?: string;
  address?: string;
  is_active?: boolean;
  last_login?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface CustomerRegistration {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface CustomerLogin {
  email: string;
  password: string;
}

export interface CustomerProfileUpdate {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
}

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
      is_active BOOLEAN DEFAULT true,
      last_login TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
};

export const createCustomer = async (
  customer: Omit<Customer, "id" | "created_at" | "updated_at">
) => {
  const { email, first_name, last_name } = customer;
  const result = await sql`
    INSERT INTO customers (email, first_name, last_name)
    VALUES (${email}, ${first_name}, ${last_name})
    RETURNING id, email, first_name, last_name, created_at, updated_at;
  `;
  return result[0] as Customer;
};

export const getCustomers = async () => {
  return (await sql`
    SELECT id, email, first_name, last_name, created_at, updated_at 
    FROM customers 
    ORDER BY created_at DESC;
  `) as Customer[];
};

export const getCustomerById = async (id: number) => {
  const result = await sql`
    SELECT id, email, first_name, last_name, created_at, updated_at 
    FROM customers 
    WHERE id = ${id};
  `;
  return result[0] as Customer | undefined;
};

export const updateCustomer = async (
  id: number,
  customer: Partial<Customer>
) => {
  const { email, first_name, last_name } = customer;
  const result = await sql`
    UPDATE customers
    SET 
      email = COALESCE(${email}, email),
      first_name = COALESCE(${first_name}, first_name),
      last_name = COALESCE(${last_name}, last_name),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING id, email, first_name, last_name, created_at, updated_at;
  `;
  return result[0] as Customer | undefined;
};

export const registerCustomer = async (customerData: CustomerRegistration) => {
  const { email, first_name, last_name, password, phone, address } =
    customerData;

  // Check if customer already exists
  const existingCustomer = await getCustomerByEmail(email);
  if (existingCustomer) {
    throw new Error("Customer with this email already exists");
  }

  // Hash the password
  const password_hash = await bcrypt.hash(password, 10);

  const result = await sql`
    INSERT INTO customers (email, first_name, last_name, password_hash, phone, address)
    VALUES (${email}, ${first_name}, ${last_name}, ${password_hash}, ${phone}, ${address})
    RETURNING id, email, first_name, last_name, phone, address, is_active, created_at, updated_at;
  `;
  return result[0] as Customer;
};

export const loginCustomer = async (loginData: CustomerLogin) => {
  const { email, password } = loginData;

  // Get customer by email
  const customer = await getCustomerByEmailWithPassword(email);
  if (!customer) {
    throw new Error("Invalid email or password");
  }

  // Check if customer is active
  if (!customer.is_active) {
    throw new Error("Account is deactivated");
  }

  // Verify password
  if (!customer.password_hash) {
    throw new Error("Invalid email or password");
  }

  const isValidPassword = await bcrypt.compare(
    password,
    customer.password_hash
  );
  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  // Update last login
  await updateLastLogin(customer.id!);

  // Return customer without password hash
  const { password_hash, ...customerWithoutPassword } = customer;
  return customerWithoutPassword as Customer;
};

export const updateCustomerProfile = async (
  id: number,
  profileData: CustomerProfileUpdate
) => {
  const { first_name, last_name, phone, address } = profileData;
  const result = await sql`
    UPDATE customers
    SET 
      first_name = COALESCE(${first_name}, first_name),
      last_name = COALESCE(${last_name}, last_name),
      phone = COALESCE(${phone}, phone),
      address = COALESCE(${address}, address),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING id, email, first_name, last_name, phone, address, is_active, last_login, created_at, updated_at;
  `;
  return result[0] as Customer | undefined;
};

export const getCustomerByEmail = async (email: string) => {
  const result = await sql`
    SELECT id, email, first_name, last_name, phone, address, is_active, last_login, created_at, updated_at 
    FROM customers 
    WHERE email = ${email};
  `;
  return result[0] as Customer | undefined;
};

export const getCustomerByEmailWithPassword = async (email: string) => {
  const result = await sql`
    SELECT id, email, first_name, last_name, password_hash, phone, address, is_active, last_login, created_at, updated_at 
    FROM customers 
    WHERE email = ${email};
  `;
  return result[0] as Customer | undefined;
};

export const updateLastLogin = async (id: number) => {
  await sql`
    UPDATE customers 
    SET last_login = CURRENT_TIMESTAMP 
    WHERE id = ${id};
  `;
};

export const deactivateCustomer = async (id: number) => {
  await sql`
    UPDATE customers 
    SET is_active = false 
    WHERE id = ${id};
  `;
};
