"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./src/config/db");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// Routers
const customer_routes_1 = __importDefault(require("./src/routes/customer.routes"));
const admin_routes_1 = __importDefault(require("./src/routes/admin.routes"));
const image_route_1 = __importDefault(require("./src/routes/image.route"));
const userImageRoutes_1 = __importDefault(require("./src/routes/userImageRoutes"));
const hotel_routes_1 = __importDefault(require("./src/routes/hotel.routes"));
const review_routes_1 = __importDefault(require("./src/routes/review.routes"));
const room_routes_1 = __importDefault(require("./src/routes/room.routes"));
const boooking_routes_1 = __importDefault(require("./src/routes/boooking.routes"));
const favourites_routes_1 = __importDefault(require("./src/routes/favourites.routes"));
// Services
const customer_service_1 = require("./src/services/customer.service");
const admin_service_1 = require("./src/services/admin.service");
const hotel_services_1 = require("./src/services/hotel.services");
const room_service_1 = require("./src/services/room.service");
const booking_service_1 = require("./src/services/booking.service");
const favourites_service_1 = require("./src/services/favourites.service");
const review_service_1 = require("./src/services/review.service");
const payment_routes_1 = __importDefault(require("./src/routes/payment.routes"));
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static files from uploads directory
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.use("/uploads", express_1.default.static("uploads"));
// Routes
app.use("/api/customers", customer_routes_1.default);
app.use("/api/admins", admin_routes_1.default);
app.use("/api/admins", image_route_1.default);
app.use("/api/customers", userImageRoutes_1.default);
app.use("/api/initialize", payment_routes_1.default);
app.use("/api/hotels", hotel_routes_1.default);
app.use("/api/rooms", room_routes_1.default);
app.use("/api/bookings", boooking_routes_1.default);
app.use("/api/reviews", review_routes_1.default);
app.use("/api/favourites", favourites_routes_1.default);
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
            booking: {
                create: "POST /api/bookings",
                getAll: "GET /api/bookings",
                getByCustomer: "GET /api/bookings/customer/:customerId",
                getOne: "GET /api/bookings/:id",
                update: "PUT /api/bookings/:id",
                delete: "DELETE /api/bookings/:id",
            },
            favourite: {
                add: "POST /api/favourites",
                getUserFavourites: "GET /api/favourites/customers/:customer_id",
                getAllFavourites: "GET /api/favourites",
                removeByCustomerAndHotel: "DELETE /api/favourites",
                removeById: "DELETE /api/favourites/:favourite_id",
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
        await (0, hotel_services_1.createHotelTable)();
        await (0, room_service_1.createRoomTable)();
        await (0, booking_service_1.createBookingsTable)();
        await (0, favourites_service_1.createFavouritesTable)();
        await (0, review_service_1.createReviewsTable)();
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
            console.log("📌 Booking Endpoints:");
            console.log(`➡ POST    /api/bookings`);
            console.log(`➡ GET     /api/bookings`);
            console.log(`➡ GET     /api/bookings/:id`);
            console.log(`➡ GET     /api/bookings/customer/:customerId`);
            console.log(`➡ PUT     /api/bookings/:id`);
            console.log(`➡ DELETE  /api/bookings/:id\n`);
            console.log("📌 Favourite Endpoints:");
            console.log(`➡ POST    /api/favourites`);
            console.log(`➡ GET     /api/favourites/customers/:customer_id`);
            console.log(`➡ GET     /api/favourites`);
            console.log(`➡ DELETE  /api/favourites`);
            console.log(`➡ DELETE  /api/favourites/:favourite_id\n`);
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
