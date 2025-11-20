"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateAdmin = exports.updateAdminProfile = exports.getAdminProfile = exports.getAdmins = exports.loginAdmin = exports.registerAdmin = void 0;
const adminService = __importStar(require("../services/admin.service"));
const registerAdmin = async (req, res) => {
    try {
        const admin = await adminService.registerAdmin(req.body);
        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            data: admin,
        });
    }
    catch (error) {
        console.error("Error registering admin:", error);
        res.status(400).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to register admin",
        });
    }
};
exports.registerAdmin = registerAdmin;
const loginAdmin = async (req, res) => {
    try {
        const admin = await adminService.loginAdmin(req.body);
        res.json({
            success: true,
            message: "Login successful",
            data: admin,
        });
    }
    catch (error) {
        console.error("Error logging admin in:", error);
        res.status(401).json({
            success: false,
            error: error instanceof Error ? error.message : "Login failed",
        });
    }
};
exports.loginAdmin = loginAdmin;
const getAdmins = async (req, res) => {
    try {
        const admins = await adminService.getAdmins();
        res.json({ success: true, data: admins });
    }
    catch (error) {
        console.error("Error fetching admins:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch admins",
        });
    }
};
exports.getAdmins = getAdmins;
const getAdminProfile = async (req, res) => {
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
    }
    catch (error) {
        console.error("Error fetching admin:", error);
        res.status(500).json({ success: false, error: "Failed to fetch admin" });
    }
};
exports.getAdminProfile = getAdminProfile;
const updateAdminProfile = async (req, res) => {
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
    }
    catch (error) {
        console.error("Error updating admin:", error);
        res
            .status(500)
            .json({ success: false, error: "Failed to update admin profile" });
    }
};
exports.updateAdminProfile = updateAdminProfile;
const deactivateAdmin = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id))
            return res
                .status(400)
                .json({ success: false, error: "Invalid admin ID" });
        await adminService.deactivateAdmin(id);
        res.json({ success: true, message: "Admin account deactivated" });
    }
    catch (error) {
        console.error("Error deactivating admin:", error);
        res
            .status(500)
            .json({ success: false, error: "Failed to deactivate admin" });
    }
};
exports.deactivateAdmin = deactivateAdmin;
