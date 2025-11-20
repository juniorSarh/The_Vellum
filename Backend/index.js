"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./src/config/db");
// Routers
const customer_routes_1 = __importDefault(require("./src/routes/customer.routes"));
const admin_routes_1 = __importDefault(require("./src/routes/admin.routes"));
// Services
const customer_service_1 = require("./src/services/customer.service");
const admin_service_1 = require("./src/services/admin.service");
// Initialize Express app
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/api/customers", customer_routes_1.default);
app.use("/api/admins", admin_routes_1.default);
// Health check endpoint
app.get("/", (req, res) => {
    res.json({
        status: "API is running",
        timestamp: new Date().toISOString(),
        endpoints: {
            customer: {
                register: "POST /api/customers/register",
                login: "POST /api/customers/login",
                getAll: "GET /api/customers",
                getOne: "GET /api/customers/:id",
                update: "PATCH /api/customers/:id",
                deactivate: "PATCH /api/customers/:id/deactivate",
            },
            admin: {
                register: "POST /api/admins/register",
                login: "POST /api/admins/login",
                getAll: "GET /api/admins",
                getOne: "GET /api/admins/:id",
                update: "PATCH /api/admins/:id",
                deactivate: "PATCH /api/admins/:id/deactivate",
            },
        },
    });
});
// Initialize database and start server
async function startServer() {
    try {
        // Test database connection
        const isConnected = await (0, db_1.testConnection)();
        if (!isConnected) {
            throw new Error("Failed to connect to database");
        }
        // Create required tables
        await (0, customer_service_1.createCustomerTable)();
        await (0, admin_service_1.createAdminTable)();
        // Start the server
        app.listen(port, () => {
            console.log(`\n🚀 Server is running at: http://localhost:${port}\n`);
            console.log("📌 Customer Endpoints:");
            console.log(`➡ POST    /api/customers/register`);
            console.log(`➡ POST    /api/customers/login`);
            console.log(`➡ GET     /api/customers`);
            console.log(`➡ GET     /api/customers/:id`);
            console.log(`➡ PATCH   /api/customers/:id`);
            console.log(`➡ PATCH   /api/customers/:id/deactivate\n`);
            console.log("📌 Admin Endpoints:");
            console.log(`➡ POST    /api/admins/register`);
            console.log(`➡ POST    /api/admins/login`);
            console.log(`➡ GET     /api/admins`);
            console.log(`➡ GET     /api/admins/:id`);
            console.log(`➡ PATCH   /api/admins/:id`);
            console.log(`➡ PATCH   /api/admins/:id/deactivate\n`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}
// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    process.exit(1);
});
// Start the application
startServer();
