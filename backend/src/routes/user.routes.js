import express from 'express';
import { getProfile, updateProfile } from '../../src/controllers/user.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

export default router;
