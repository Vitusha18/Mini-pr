import express from 'express';
import {
  createCrop,
  getCrops,
  getCropById,
  updateCrop,
  deleteCrop,
} from '../../src/controllers/crop.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { uploadCropPhoto } from '../../middleware/upload.middleware.js';

const router = express.Router();

// All crop routes require authentication
router.use(protect);

router.route('/')
  .post(uploadCropPhoto.single('cropPhoto'), createCrop)
  .get(getCrops);

router.route('/:id')
  .get(getCropById)
  .put(uploadCropPhoto.single('cropPhoto'), updateCrop)
  .delete(deleteCrop);

export default router;
