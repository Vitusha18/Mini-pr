import dotenv from 'dotenv';

dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    // Connect to MongoDB before starting the server
    await connectDB();

    // const server = app.listen(PORT, () => {
      const server = app.listen(Number(PORT), '0.0.0.0', () => {
      console.log('====================================================');
      console.log('PestGuard AI - Early Pest Warning Backend Service');
      console.log(`Server listening on: http://localhost:${PORT}`);
      console.log(`Health check URL:    http://localhost:${PORT}/api/v1/health`);
      console.log(
        `Allowed Frontend:    ${process.env.CLIENT_URL || 'http://localhost:5174'}`
      );
      console.log('====================================================');
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('Server Error:', error.message);
      process.exitCode = 1;
    });
  } catch (error) {
    console.error('Backend startup failed:', error.message);
    process.exitCode = 1;
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error.message);
});

startServer();

export default startServer;