
import express from 'express';
import { protect } from '../../middleware/auth.middleware.js';
import { uploadCropPhoto } from '../../middleware/upload.middleware.js';
import {
  predictImage,
} from '../controllers/imagePrediction.controller.js';

const router = express.Router();

// Only authenticated users can request predictions.
router.use(protect);

// The frontend must upload its image under the field name "file".
router.post(
  '/predict/image',
  uploadCropPhoto.single('file'),
  predictImage
);

export default router;
