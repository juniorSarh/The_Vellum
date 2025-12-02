"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateCustomer = exports.updateLastLogin = exports.getCustomerByEmailWithPassword = exports.getCustomerByEmail = exports.updateCustomerProfile = exports.loginCustomer = exports.registerCustomer = exports.updateCustomer = exports.getCustomerById = exports.getCustomers = exports.createCustomer = exports.createCustomerTable = void 0;
const db_1 = require("../../src/config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// ============================
// CREATE CUSTOMERS TABLE
// ============================
const createCustomerTable = async () => {
    await (0, db_1.sql) `
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
exports.createCustomerTable = createCustomerTable;
// ============================
// CREATE CUSTOMER (NO PASSWORD)
// ============================
const createCustomer = async (customer) => {
    const { email, first_name, last_name, image } = customer;
    const result = await (0, db_1.sql) `
    INSERT INTO customers (email, first_name, last_name, image)
    VALUES (${email}, ${first_name}, ${last_name}, ${image})
    RETURNING id, email, first_name, last_name, created_at, updated_at;
  `;
    return result[0];
};
exports.createCustomer = createCustomer;
// ============================
// GET ALL CUSTOMERS
// ============================
const getCustomers = async () => {
    return (await (0, db_1.sql) `
    SELECT id, email, first_name, last_name, phone, address, image, is_active, created_at, updated_at
    FROM customers
    ORDER BY created_at DESC;
  `);
};
exports.getCustomers = getCustomers;
// ============================
// GET CUSTOMER BY ID
// ============================
const getCustomerById = async (id) => {
    const result = await (0, db_1.sql) `
    SELECT id, email, first_name, last_name, phone,  address, image, is_active, last_login, created_at, updated_at
    FROM customers
    WHERE id = ${id};
  `;
    return result[0];
};
exports.getCustomerById = getCustomerById;
// ============================
// UPDATE BASIC CUSTOMER FIELDS
// ============================
const updateCustomer = async (id, customerData) => {
    const { email, first_name, last_name, image } = customerData;
    const result = await (0, db_1.sql) `
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
    return result[0];
};
exports.updateCustomer = updateCustomer;
// ============================
// REGISTER CUSTOMER (WITH PASSWORD)
// ============================
const registerCustomer = async (customerData) => {
    const { email, first_name, last_name, password, phone, address, image } = customerData;
    const existing = await (0, exports.getCustomerByEmail)(email);
    if (existing) {
        throw new Error("Customer with this email already exists");
    }
    const password_hash = await bcryptjs_1.default.hash(password, 10);
    const result = await (0, db_1.sql) `
    INSERT INTO customers (email, first_name, last_name, password_hash, phone, address, image)
    VALUES (${email}, ${first_name}, ${last_name}, ${password_hash}, ${phone}, ${address}, ${image})
    RETURNING id, email, first_name, last_name, phone, address, image, is_active, created_at, updated_at;
  `;
    return result[0];
};
exports.registerCustomer = registerCustomer;
// ============================
// LOGIN CUSTOMER
// ============================
const loginCustomer = async (loginData) => {
    const { email, password } = loginData;
    const customer = await (0, exports.getCustomerByEmailWithPassword)(email);
    if (!customer || !customer.password_hash) {
        throw new Error("Invalid email or password");
    }
    if (!customer.is_active) {
        throw new Error("Account is deactivated");
    }
    const valid = await bcryptjs_1.default.compare(password, customer.password_hash);
    if (!valid) {
        throw new Error("Invalid email or password");
    }
    await (0, exports.updateLastLogin)(customer.id);
    const { password_hash, ...safeCustomer } = customer;
    return safeCustomer;
};
exports.loginCustomer = loginCustomer;
// ============================
// UPDATE FULL CUSTOMER PROFILE
// ============================
const updateCustomerProfile = async (id, profileData) => {
    const { first_name, last_name, phone, address, image } = profileData;
    const result = await (0, db_1.sql) `
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
    return result[0];
};
exports.updateCustomerProfile = updateCustomerProfile;
// ============================
// GET CUSTOMER BY EMAIL (NO PASSWORD)
// ============================
const getCustomerByEmail = async (email) => {
    const result = await (0, db_1.sql) `
    SELECT id, email, first_name, last_name, phone, address, image, is_active, last_login, created_at, updated_at
    FROM customers
    WHERE email = ${email};
  `;
    return result[0];
};
exports.getCustomerByEmail = getCustomerByEmail;
// ============================
// GET CUSTOMER WITH PASSWORD
// ============================
const getCustomerByEmailWithPassword = async (email) => {
    const result = await (0, db_1.sql) `
    SELECT id, email, first_name, last_name, password_hash, phone, address, image, is_active, last_login, created_at, updated_at
    FROM customers
    WHERE email = ${email};
  `;
    return result[0];
};
exports.getCustomerByEmailWithPassword = getCustomerByEmailWithPassword;
// ============================
// UPDATE LAST LOGIN
// ============================
const updateLastLogin = async (id) => {
    await (0, db_1.sql) `
    UPDATE customers
    SET last_login = CURRENT_TIMESTAMP
    WHERE id = ${id};
  `;
};
exports.updateLastLogin = updateLastLogin;
// ============================
// DEACTIVATE CUSTOMER
// ============================
const deactivateCustomer = async (id) => {
    await (0, db_1.sql) `
    UPDATE customers
    SET is_active = false
    WHERE id = ${id};
  `;
};
exports.deactivateCustomer = deactivateCustomer;
