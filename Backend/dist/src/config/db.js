"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = exports.sql = void 0;
const serverless_1 = require("@neondatabase/serverless");
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
}
// Initialize Neon client
exports.sql = (0, serverless_1.neon)(process.env.DATABASE_URL);
// Test the database connection
const testConnection = async () => {
    try {
        await (0, exports.sql) `SELECT 1`;
        console.log("✅ Database connection successful");
        return true;
    }
    catch (error) {
        console.error("❌ Database connection failed:", error);
        return false;
    }
};
exports.testConnection = testConnection;
