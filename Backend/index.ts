import "dotenv/config";
import express from "express";
import cors from "cors";
import { customerRouter } from "./src/routes/customer.routes";
import { createCustomerTable } from "./src/models/customer.model";
import { testConnection } from "./src/config/db";

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/customers", customerRouter);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "API is running",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: {
        register: "POST /api/customers/register",
        login: "POST /api/customers/login",
      },
      customers: {
        getAll: "GET /api/customers",
        getProfile: "GET /api/customers/:id",
        updateProfile: "PATCH /api/customers/:id",
        deactivate: "DELETE /api/customers/:id/deactivate",
      },
    },
  });
});

// Initialize database and start server
async function startServer() {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error("Failed to connect to database");
    }

    // Create required tables
    await createCustomerTable();

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      console.log("Available endpoints:");
      console.log("\nAuthentication:");
      console.log(`- POST   http://localhost:${port}/api/customers/register`);
      console.log(`- POST   http://localhost:${port}/api/customers/login`);
      console.log("\nProfile Management:");
      console.log(`- GET    http://localhost:${port}/api/customers`);
      console.log(`- GET    http://localhost:${port}/api/customers/:id`);
      console.log(`- PATCH  http://localhost:${port}/api/customers/:id`);
      console.log(
        `- DELETE http://localhost:${port}/api/customers/:id/deactivate`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

// Start the application
startServer();
