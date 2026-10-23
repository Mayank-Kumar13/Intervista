const mongoose = require('mongoose');

let isConnected = false;

/**
 * Connect to MongoDB Atlas with connection pooling and graceful lifecycle management.
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'intervista';

  if (!uri) {
    console.warn('⚠️  MONGODB_URI is not defined in environment variables. Database connection skipped.');
    return;
  }

  // If already connected, reuse connection
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName,
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log(`✦ MongoDB Atlas Connected: host ${conn.connection.host} | db: ${conn.connection.name}`);
  } catch (err) {
    isConnected = false;
    console.error('⚠️  MongoDB Atlas Connection Notice:', err.message);
    console.info('   Note: If IP whitelist is active on MongoDB Atlas, ensure your current IP or 0.0.0.0/0 is permitted in Atlas Network Access.');
  }
}

// Connection event listeners
mongoose.connection.on('connected', () => {
  isConnected = true;
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.error('⚠️  MongoDB Atlas connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('⚠️  MongoDB Atlas disconnected.');
});

// Graceful process termination
process.on('SIGINT', async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination.');
  }
  process.exit(0);
});

module.exports = {
  connectDB,
  isDBConnected: () => mongoose.connection.readyState === 1,
  mongoose,
};
