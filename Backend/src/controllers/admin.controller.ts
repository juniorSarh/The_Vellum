import { Request, Response } from "express";
import * as adminModel from "../services/admin.service";

// =======================================
// REGISTER ADMIN
// =======================================
export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await adminModel.registerAdmin(req.body);
    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: admin,
    });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to register admin",
    });
  }
};

// =======================================
// LOGIN ADMIN
// =======================================
export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await adminModel.loginAdmin(req.body);
    res.json({
      success: true,
      message: "Login successful",
      data: admin,
    });
  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    });
  }
};

// =======================================
// GET ADMIN PROFILE
// =======================================
export const getAdminProfile = async (req: Request, res: Response) => {
  try {
    const adminId = parseInt(req.params.id);
    if (isNaN(adminId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid admin ID",
      });
    }

    const admin = await adminModel.getAdminById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Admin not found",
      });
    }

    res.json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch admin profile",
    });
  }
};

// =======================================
// UPDATE ADMIN PROFILE
// =======================================
export const updateAdminProfile = async (req: Request, res: Response) => {
  try {
    const adminId = parseInt(req.params.id);
    if (isNaN(adminId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid admin ID",
      });
    }

    const admin = await adminModel.updateAdminProfile(adminId, req.body);
    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Admin not found",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: admin,
    });
  } catch (error) {
    console.error("Error updating admin profile:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update admin profile",
    });
  }
};

