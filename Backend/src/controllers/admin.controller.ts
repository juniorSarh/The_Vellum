import { Request, Response } from "express";
import * as adminService from "../services/admin.service";

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await adminService.registerAdmin(req.body);
    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: admin,
    });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(400).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to register admin",
    });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await adminService.loginAdmin(req.body);
    res.json({
      success: true,
      message: "Login successful",
      data: admin,
    });
  } catch (error) {
    console.error("Error logging admin in:", error);
    res.status(401).json({
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    });
  }
};

export const getAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await adminService.getAdmins();
    res.json({ success: true, data: admins });
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch admins",
    });
  }
};

export const getAdminProfile = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res
        .status(400)
        .json({ success: false, error: "Invalid admin ID" });

    const admin = await adminService.getAdminById(id);
    if (!admin)
      return res.status(404).json({ success: false, error: "Admin not found" });

    res.json({ success: true, data: admin });
  } catch (error) {
    console.error("Error fetching admin:", error);
    res.status(500).json({ success: false, error: "Failed to fetch admin" });
  }
};

export const updateAdminProfile = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res
        .status(400)
        .json({ success: false, error: "Invalid admin ID" });

    const admin = await adminService.updateAdminProfile(id, req.body);
    if (!admin)
      return res.status(404).json({ success: false, error: "Admin not found" });

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: admin,
    });
  } catch (error) {
    console.error("Error updating admin:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to update admin profile" });
  }
};

export const deactivateAdmin = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id))
      return res
        .status(400)
        .json({ success: false, error: "Invalid admin ID" });

    await adminService.deactivateAdmin(id);
    res.json({ success: true, message: "Admin account deactivated" });
  } catch (error) {
    console.error("Error deactivating admin:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to deactivate admin" });
  }
};
