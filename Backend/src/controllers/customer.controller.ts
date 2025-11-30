import { Request, Response } from "express";
import * as customerModel from "../services/customer.service";

// -------------------- REGISTER --------------------
export const registerCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await customerModel.registerCustomer(req.body);
    res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      data: customer,
    });
  } catch (error) {
    console.error("Error registering customer:", error);
    res.status(400).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to register customer",
    });
  }
};

// -------------------- LOGIN --------------------
export const loginCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await customerModel.loginCustomer(req.body);
    res.json({
      success: true,
      message: "Login successful",
      data: customer,
    });
  } catch (error) {
    console.error("Error logging in customer:", error);
    res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    });
  }
};

// -------------------- GOOGLE OAUTH --------------------
export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { email, first_name, last_name, googleId } = req.body;

    if (!email || !first_name || !last_name || !googleId) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    // Check if customer exists
    const existingCustomer = await customerModel.getCustomerByEmail(email);

    if (existingCustomer) {
      // User exists → login
      return res.json({ success: true, data: existingCustomer });
    }

    // User doesn't exist → register
    const newCustomer = await customerModel.registerCustomer({
      first_name,
      last_name,
      email,
      password: googleId, // store googleId as temporary password
    });

    return res.status(201).json({ success: true, data: newCustomer });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Google login failed" });
  }
};

// -------------------- PROFILE --------------------
export const getProfile = async (req: Request, res: Response) => {
  try {
    const customerId = parseInt(req.params.id);
    if (isNaN(customerId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid customer ID" });
    }

    const customer = await customerModel.getCustomerById(customerId);
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, error: "Customer not found" });
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    console.error("Error fetching customer profile:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch customer profile" });
  }
};

// -------------------- UPDATE --------------------
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const customerId = parseInt(req.params.id);
    if (isNaN(customerId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid customer ID" });
    }

    const customer = await customerModel.updateCustomerProfile(
      customerId,
      req.body
    );
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, error: "Customer not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: customer,
    });
  } catch (error) {
    console.error("Error updating customer profile:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to update customer profile" });
  }
};

// -------------------- DEACTIVATE --------------------
export const deactivateAccount = async (req: Request, res: Response) => {
  try {
    const customerId = parseInt(req.params.id);
    if (isNaN(customerId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid customer ID" });
    }

    await customerModel.deactivateCustomer(customerId);
    res.json({ success: true, message: "Account deactivated successfully" });
  } catch (error) {
    console.error("Error deactivating customer account:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to deactivate customer account" });
  }
};

// -------------------- GET ALL --------------------
export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await customerModel.getCustomers();
    res.json({ success: true, data: customers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch customers" });
  }
};
