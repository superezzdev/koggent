import fs from "fs";
import path from "path";
import multer from "multer";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, "../temp");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },

  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const isPdf =
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/x-pdf" ||
    file.originalname?.toLowerCase().endsWith(".pdf");

  const isImage =
    file.mimetype?.startsWith("image/") ||
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.originalname || "");

  if (isPdf || isImage) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and Images are allowed."));
  }
};

export default multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});
