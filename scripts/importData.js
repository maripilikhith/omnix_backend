/**
 * Data import utility.
 * Import data from JSON files or external sources.
 *
 * Usage: npm run import-data -- --file=data.json --collection=courses
 */
import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';
import { logger } from '../src/utils/logger.js';

dotenv.config();

async function importData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learnquest');
    logger.info('Connected to MongoDB for data import');

    const args = process.argv.slice(2);
    const fileArg = args.find((a) => a.startsWith('--file='));
    const collectionArg = args.find((a) => a.startsWith('--collection='));

    if (!fileArg || !collectionArg) {
      logger.error('Usage: node importData.js --file=<path> --collection=<name>');
      process.exit(1);
    }

    const filePath = fileArg.split('=')[1];
    const collectionName = collectionArg.split('=')[1];

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const result = await mongoose.connection.collection(collectionName).insertMany(data);

    logger.info(`Imported ${result.insertedCount} documents into ${collectionName}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    logger.error('Import failed', { error: error.message });
    process.exit(1);
  }
}

importData();
