import { Router } from "express";
import * as customerController from "../controllers/customer.controller";

export const customerRouter = Router();

// Create a new customer
customerRouter.post("/", customerController.createCustomer);

// Get all customers
customerRouter.get("/", customerController.getCustomers);

// Get a single customer by ID
customerRouter.get("/:id", customerController.getCustomer);

// Update a customer
customerRouter.patch("/:id", customerController.updateCustomer);

// Delete a customer
customerRouter.delete("/:id", customerController.deleteCustomer);
