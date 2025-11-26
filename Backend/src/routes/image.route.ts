import express from "express";
import multer from "multer";
import { sql } from "../config/db";

const imageRouter = express.Router();

// === Multer storage settings ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// === PATCH: Upload Admin Image ===
imageRouter.patch(
  "/upload/:id/image",
  upload.single("image"),
  async (req, res) => {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    try {
      await sql`UPDATE admins SET image = ${
        file.filename
      } WHERE id = ${parseInt(id)}`;

      return res.json({ success: true, image: file.filename });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: "Database error" });
    }
  }
);

export default imageRouter;
