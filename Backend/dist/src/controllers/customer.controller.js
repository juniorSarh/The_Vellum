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
exports.getCustomers = exports.deactivateAccount = exports.updateProfile = exports.getProfile = exports.googleAuth = exports.loginCustomer = exports.registerCustomer = void 0;
const customerModel = __importStar(require("../services/customer.service"));
// -------------------- REGISTER --------------------
const registerCustomer = async (req, res) => {
    try {
        const customer = await customerModel.registerCustomer(req.body);
        res.status(201).json({
            success: true,
            message: "Customer registered successfully",
            data: customer,
        });
    }
    catch (error) {
        console.error("Error registering customer:", error);
        res.status(400).json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to register customer",
        });
    }
};
exports.registerCustomer = registerCustomer;
// -------------------- LOGIN --------------------
const loginCustomer = async (req, res) => {
    try {
        const customer = await customerModel.loginCustomer(req.body);
        res.json({
            success: true,
            message: "Login successful",
            data: customer,
        });
    }
    catch (error) {
        console.error("Error logging in customer:", error);
        res.status(401).json({
            success: false,
            error: error instanceof Error ? error.message : "Login failed",
        });
    }
};
exports.loginCustomer = loginCustomer;
// -------------------- GOOGLE OAUTH --------------------
const googleAuth = async (req, res) => {
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
    }
    catch (error) {
        console.error("Google Auth Error:", error);
        return res
            .status(500)
            .json({ success: false, error: "Google login failed" });
    }
};
exports.googleAuth = googleAuth;
// -------------------- PROFILE --------------------
const getProfile = async (req, res) => {
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
    }
    catch (error) {
        console.error("Error fetching customer profile:", error);
        res
            .status(500)
            .json({ success: false, error: "Failed to fetch customer profile" });
    }
};
exports.getProfile = getProfile;
// -------------------- UPDATE --------------------
const updateProfile = async (req, res) => {
    try {
        const customerId = parseInt(req.params.id);
        if (isNaN(customerId)) {
            return res
                .status(400)
                .json({ success: false, error: "Invalid customer ID" });
        }
        const customer = await customerModel.updateCustomerProfile(customerId, req.body);
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
    }
    catch (error) {
        console.error("Error updating customer profile:", error);
        res
            .status(500)
            .json({ success: false, error: "Failed to update customer profile" });
    }
};
exports.updateProfile = updateProfile;
// -------------------- DEACTIVATE --------------------
const deactivateAccount = async (req, res) => {
    try {
        const customerId = parseInt(req.params.id);
        if (isNaN(customerId)) {
            return res
                .status(400)
                .json({ success: false, error: "Invalid customer ID" });
        }
        await customerModel.deactivateCustomer(customerId);
        res.json({ success: true, message: "Account deactivated successfully" });
    }
    catch (error) {
        console.error("Error deactivating customer account:", error);
        res
            .status(500)
            .json({ success: false, error: "Failed to deactivate customer account" });
    }
};
exports.deactivateAccount = deactivateAccount;
// -------------------- GET ALL --------------------
const getCustomers = async (req, res) => {
    try {
        const customers = await customerModel.getCustomers();
        res.json({ success: true, data: customers });
    }
    catch (error) {
        console.error("Error fetching customers:", error);
        res
            .status(500)
            .json({ success: false, error: "Failed to fetch customers" });
    }
};
exports.getCustomers = getCustomers;
