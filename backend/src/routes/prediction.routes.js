import express from 'express';
import {
  getPredictions,
  getPredictionById,
  createPrediction,
} from '../../src/controllers/prediction.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

// All prediction history routes require authentication
router.use(protect);

router.get('/', getPredictions);
router.post('/', createPrediction);
router.get('/:id', getPredictionById);

export default router;
