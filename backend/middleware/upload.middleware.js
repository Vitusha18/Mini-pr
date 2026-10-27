import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define uploads directory relative to backend root
const uploadDir = path.resolve(__dirname, '../uploads/crops');

// Ensure destination directory exists on startup
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Allowed MIME types and extensions
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// Storage configuration with sanitized unique filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Re-verify directory exists in case it was deleted
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedName = file.fieldname.replace(/[^a-zA-Z0-9_-]/g, '');
    cb(null, `${sanitizedName}-${uniqueSuffix}${ext}`);
  },
});

// File validation filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  const isMimeValid = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const isExtValid = ALLOWED_EXTENSIONS.includes(ext);

  if (isMimeValid && isExtValid) {
    cb(null, true);
  } else {
    const error = new Error('Invalid file type. Only JPG, JPEG, PNG, and WEBP formats are allowed.');
    error.status = 400;
    error.code = 'INVALID_FILE_TYPE';
    cb(error, false);
  }
};

// Multer upload instance with 5 MB limit
export const uploadCropPhoto = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB in bytes
  },
  fileFilter,
});

export default uploadCropPhoto;
