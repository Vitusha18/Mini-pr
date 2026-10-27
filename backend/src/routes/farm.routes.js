import express from 'express';
import {
  createFarm,
  getFarms,
  getFarmById,
  updateFarm,
  deleteFarm,
} from '../../src/controllers/farm.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

// All farm routes require authentication
router.use(protect);

router.route('/')
  .post(createFarm)
  .get(getFarms);

router.route('/:id')
  .get(getFarmById)
  .put(updateFarm)
  .delete(deleteFarm);

export default router;
