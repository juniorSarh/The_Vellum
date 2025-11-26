import "dotenv/config";
import express from "express";
import cors from "cors";
import { testConnection } from "./src/config/db";
import path from "path";
import dotenv from "dotenv";



// Routers
import customerRouter from "./src/routes/customer.routes";
import adminRouter from "./src/routes/admin.routes";
import imageRouter from "./src/routes/image.route";


import hotelRouter from "./src/routes/hotel.routes";
import roomRouter from "./src/routes/room.routes";


// Services
import { createCustomerTable } from "./src/services/customer.service";
import { createAdminTable } from "./src/services/admin.service";
import { createHotelTable } from "./src/services/hotel.services";
import { createRoomTable } from "./src/services/room.service";

dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;



// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/customers", customerRouter);
app.use("/api/admins", adminRouter);

app.use("/api/admins", imageRouter);



app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);


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
      hotel: {
        getAll: "GET /api/hotels",
        getByAdmin: "GET /api/hotels?adminId={admin_id}",
        getOne: "GET /api/hotels/:id",
        create: "POST /api/hotels",
        update: "PUT /api/hotels/:id",
        delete: "DELETE /api/hotels/:id",
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
    await createAdminTable();
    await createHotelTable();
    await createRoomTable();

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

      console.log("📌 Hotel Endpoints:");
      console.log(`➡ GET     /api/hotels`);
      console.log(`➡ GET     /api/hotels?adminId={admin_id}`);
      console.log(`➡ GET     /api/hotels/:id`);
      console.log(`➡ POST    /api/hotels`);
      console.log(`➡ PUT     /api/hotels/:id`);
      console.log(`➡ DELETE  /api/hotels/:id\n`);

      console.log("📌 Room Endpoints:");
      console.log(`➡ GET     /api/rooms`);
      console.log(`➡ GET     /api/rooms?hotelId={hotel_id}`);
      console.log(`➡ GET     /api/rooms/:id`);
      console.log(`➡ POST    /api/rooms`);
      console.log(`➡ PUT     /api/rooms/:id`);
      console.log(`➡ DELETE  /api/rooms/:id\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
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
