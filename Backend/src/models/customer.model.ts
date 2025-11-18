import { sql } from "../../src/config/db";

export interface Customer {
  id?: number;
  email: string;
  first_name: string;
  last_name: string;
  created_at?: Date;
  updated_at?: Date;
}

export const createCustomerTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
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

export const deleteCustomer = async (id: number) => {
  await sql`DELETE FROM customers WHERE id = ${id}`;
};
