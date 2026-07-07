/**
 * MongoDB / Mongoose configuration.
 */
export const dbConfig = Object.freeze({
  uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learnquest',
  options: {
    // Mongoose 8 uses the new driver defaults; these are for reference/override
    maxPoolSize: parseInt(process.env.DB_POOL_SIZE, 10) || 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
});
