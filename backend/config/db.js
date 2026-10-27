
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('\n========== MONGODB DEBUG ==========');

    const mongoURI = process.env.MONGO_URI?.trim();

    console.log('MONGO_URI exists:', Boolean(mongoURI));
    console.log('URI scheme:', mongoURI?.split('://')[0] || 'missing');

    if (!mongoURI) {
      throw new Error('MONGO_URI is missing from backend/.env');
    }

    if (
      !mongoURI.startsWith('mongodb://') &&
      !mongoURI.startsWith('mongodb+srv://')
    ) {
      throw new Error('Invalid MongoDB URI protocol.');
    }

    // Check structure without displaying credentials.
    const afterScheme = mongoURI.slice(mongoURI.indexOf('://') + 3);
    const separatorIndex = afterScheme.lastIndexOf('@');

    if (separatorIndex === -1) {
      throw new Error(
        'The loaded MONGO_URI has no @ separator. Check the actual value in backend/.env.'
      );
    }

    const hostAndPath = afterScheme.slice(separatorIndex + 1);
    const hostname = hostAndPath.split('/')[0];

    console.log('Hostname:', hostname);

    if (!hostname || hostname.includes(':')) {
      throw new Error(
        'Invalid Atlas hostname. For mongodb+srv, the hostname must not contain a port.'
      );
    }

    console.log('Connecting to MongoDB...');

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('MongoDB Connected:', conn.connection.host);
    console.log('Database:', conn.connection.name);
    console.log('===================================\n');

    return conn;
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    throw error;
  }
};

export default connectDB;
