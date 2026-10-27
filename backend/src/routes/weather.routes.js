import express from 'express';
import { getCurrentWeather } from '../controllers/weather.controller.js';

const router = express.Router();

// GET /api/v1/weather/current?latitude=...&longitude=...
router.get('/current', getCurrentWeather);

export default router;
