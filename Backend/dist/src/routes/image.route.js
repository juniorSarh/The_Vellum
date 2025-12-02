"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const db_1 = require("../config/db");
const imageRouter = express_1.default.Router();
// === Multer storage settings ===
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = (0, multer_1.default)({ storage });
// === PATCH: Upload Admin Image ===
imageRouter.patch("/upload/:id/image", upload.single("image"), async (req, res) => {
    const { id } = req.params;
    const file = req.file;
    if (!file) {
        return res
            .status(400)
            .json({ success: false, error: "No file uploaded" });
    }
    try {
        await (0, db_1.sql) `UPDATE admins SET image = ${file.filename} WHERE id = ${parseInt(id)}`;
        return res.json({ success: true, image: file.filename });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Database error" });
    }
});
exports.default = imageRouter;
