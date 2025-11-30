const mongoose = require('mongoose');

/**
 * connectDB - serverless-friendly MongoDB connection helper.
 * Uses a cached promise on global.mongoosePromise so repeated invocations
 * in the same serverless warm container reuse the same connection.
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel_management';

  // If there is an existing connection, return it
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // If a connection attempt is already in progress, reuse the promise
  if (global.mongoosePromise) {
    await global.mongoosePromise;
    return mongoose;
  }

  // Otherwise, create a new connection and cache the promise
  global.mongoosePromise = mongoose.connect(mongoUri)
    .then((conn) => {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    })
    .catch((err) => {
      // Clear the cached promise so future invocations can retry
      global.mongoosePromise = null;
      console.error('Database connection error:', err);
      throw err;
    });

  await global.mongoosePromise;
  return mongoose;
};

module.exports = { connectDB };