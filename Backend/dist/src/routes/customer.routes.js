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
exports.customerRouter = void 0;
const express_1 = require("express");
const customerController = __importStar(require("../controllers/customer.controller"));
exports.customerRouter = (0, express_1.Router)();
// Authentication endpoints
exports.customerRouter.post("/register", customerController.registerCustomer);
exports.customerRouter.post("/login", customerController.loginCustomer);
exports.customerRouter.post("/google", customerController.googleAuth); // Google OAuth
// Profile management endpoints
exports.customerRouter.get("/", customerController.getCustomers);
exports.customerRouter.get("/:id", customerController.getProfile);
exports.customerRouter.patch("/:id", customerController.updateProfile);
exports.customerRouter.delete("/:id/deactivate", customerController.deactivateAccount);
exports.customerRouter.patch("/:id/deactivate", customerController.deactivateAccount);
exports.default = exports.customerRouter;
