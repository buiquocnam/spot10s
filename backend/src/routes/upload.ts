import express from "express";
import multer from "multer";
import cloudinary from "../utils/cloudinary";
import { Readable } from "stream";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.array("images", 10), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "cafe-discovery",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result?.secure_url);
          }
        );

        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
      });
    });

    const urls = await Promise.all(uploadPromises);
    res.json({ urls });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload images" });
  }
});

export default router;
