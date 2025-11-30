import { Router } from "express";
import * as customerController from "../controllers/customer.controller";

export const customerRouter = Router();

// Authentication endpoints
customerRouter.post("/register", customerController.registerCustomer);
customerRouter.post("/login", customerController.loginCustomer);
customerRouter.post("/google", customerController.googleAuth); // Google OAuth

// Profile management endpoints
customerRouter.get("/", customerController.getCustomers);
customerRouter.get("/:id", customerController.getProfile);
customerRouter.patch("/:id", customerController.updateProfile);
customerRouter.delete("/:id/deactivate", customerController.deactivateAccount);
customerRouter.patch("/:id/deactivate", customerController.deactivateAccount);

export default customerRouter;
