import { Router } from "express";
import * as adminController from "../controllers/admin.controller";

export const adminRouter = Router();

// Authentication endpoints
adminRouter.post("/register", adminController.registerAdmin);
adminRouter.post("/login", adminController.loginAdmin);

// Admin management endpoints
adminRouter.get("/", adminController.getAdmins);
adminRouter.get("/:id", adminController.getAdminProfile);
adminRouter.patch("/:id", adminController.updateAdminProfile);

// Deactivate admin
adminRouter.delete("/:id/deactivate", adminController.deactivateAdmin);
adminRouter.patch("/:id/deactivate", adminController.deactivateAdmin);

export default adminRouter;
