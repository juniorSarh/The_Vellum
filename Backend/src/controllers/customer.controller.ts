import { Request, Response } from "express";
import * as customerModel from "../services/customer.service";

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

export const getProfile = async (req: Request, res: Response) => {
  try {
    const customerId = parseInt(req.params.id);
    if (isNaN(customerId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid customer ID",
      });
    }

    const customer = await customerModel.getCustomerById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: "Customer not found",
      });
    }

    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error("Error fetching customer profile:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch customer profile",
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const customerId = parseInt(req.params.id);
    if (isNaN(customerId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid customer ID",
      });
    }

    const customer = await customerModel.updateCustomerProfile(
      customerId,
      req.body
    );
    if (!customer) {
      return res.status(404).json({
        success: false,
        error: "Customer not found",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: customer,
    });
  } catch (error) {
    console.error("Error updating customer profile:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update customer profile",
    });
  }
};

export const deactivateAccount = async (req: Request, res: Response) => {
  try {
    const customerId = parseInt(req.params.id);
    if (isNaN(customerId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid customer ID",
      });
    }

    await customerModel.deactivateCustomer(customerId);
    res.json({
      success: true,
      message: "Account deactivated successfully",
    });
  } catch (error) {
    console.error("Error deactivating customer account:", error);
    res.status(500).json({
      success: false,
      error: "Failed to deactivate customer account",
    });
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await customerModel.getCustomers();
    res.json({
      success: true,
      data: customers,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch customers",
    });
  }
};
