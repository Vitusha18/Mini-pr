import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Import Routes
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import farmRoutes from './src/routes/farm.routes.js';
import cropRoutes from './src/routes/crop.routes.js';
import weatherRoutes from './src/routes/weather.routes.js';
import predictionRoutes from './src/routes/prediction.routes.js';

import path from 'path';
import { fileURLToPath } from 'url';

// Import Middlewares
import notFound from './middleware/notFound.middleware.js';
import errorHandler from './middleware/error.middleware.js';
import imagePredictionRoutes from './src/routes/imagePrediction.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure CORS for frontend origin (http://localhost:5174)
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5174',
  'http://localhost:5174',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl, Postman, test scripts)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked: Origin ${origin} is not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Base Health Check Route (Unauthenticated)
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PestGuard AI API is running',
  });
});

// Register API v1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/farms', farmRoutes);
app.use('/api/v1/crops', cropRoutes);
app.use('/api/v1/weather', weatherRoutes);
app.use('/api/v1/predictions', predictionRoutes);
app.use('/api/v1/ai', imagePredictionRoutes);

// Catch 404 and forward to error handler
app.use(notFound);

// Centralized error handling
app.use(errorHandler);

export default app;
