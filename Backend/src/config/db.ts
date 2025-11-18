import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pkg;
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render PostgreSQL
  },
});

export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to database");
    client.release();
  } catch (error) {
    console.error("failed to connect to database", error);
    process.exit(1);
  }
};