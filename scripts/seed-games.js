/**
 * Seed Script: Import existing game HTML files into MongoDB.
 *
 * Reads the 5 static HTML files from web/public/games/ and
 * inserts them into the `games` MongoDB collection.
 *
 * Usage:
 *   node scripts/seed-games.js
 *
 * Requires MONGODB_URI in .env (same as the server uses).
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Config ───────────────────────────────────────────────────────────────────

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set in .env');
  process.exit(1);
}

// Path to the existing static games
const GAMES_DIR = path.resolve(__dirname, './seed-data/games');

// Map each HTML file to its metadata
const GAMES = [
  {
    fileName: 'module1-flight-simulator.html',
    gameId: 'module1-flight-simulator',
    templateId: 'flight-simulator-2',
    courseSlug: 'mathematics-in-machine-learning',
    moduleNumber: 1,
    title: 'Flight Simulator: Vector Crab Angle Puzzle',
    description: 'Interactive flight simulator game testing vector angle concepts.',
    genre: 'Math',
    difficulty: 'Intermediate',
    conceptsTested: ['vectors', 'angles', 'magnitude', 'direction'],
    xpReward: 500,
    estimatedMinutes: 5,
  },
  {
    fileName: 'module2-maze-runner.html',
    gameId: 'module2-maze-runner',
    templateId: 'maze-runner',
    courseSlug: 'mathematics-in-machine-learning',
    moduleNumber: 2,
    title: 'Maze Runner: Beyond Three Dimensions',
    description: 'Navigate a maze while answering questions about higher-dimensional spaces.',
    genre: 'Math',
    difficulty: 'Intermediate',
    conceptsTested: ['dimensions', 'linear algebra', 'vector spaces', 'matrices'],
    xpReward: 500,
    estimatedMinutes: 5,
  },
  {
    fileName: 'module3-space-invaders.html',
    gameId: 'module3-space-invaders',
    templateId: 'space-invaders',
    courseSlug: 'mathematics-in-machine-learning',
    moduleNumber: 3,
    title: 'Space Invaders: Vector Spaces',
    description: 'Defend against invaders while learning about vector spaces.',
    genre: 'Math',
    difficulty: 'Advanced',
    conceptsTested: ['vector spaces', 'basis', 'span', 'linear independence'],
    xpReward: 750,
    estimatedMinutes: 5,
  },
  {
    fileName: 'module4-dot-product-defense.html',
    gameId: 'module4-dot-product-defense',
    templateId: 'dot-product-defense',
    courseSlug: 'mathematics-in-machine-learning',
    moduleNumber: 4,
    title: 'Dot Product Defense: Orthogonal Shield',
    description: 'Defend against incoming vectors by calculating dot products and orthogonality.',
    genre: 'Math',
    difficulty: 'Intermediate',
    conceptsTested: ['dot product', 'orthogonality', 'projection', 'vectors'],
    xpReward: 500,
    estimatedMinutes: 5,
  },
];

// ─── Import Schema (avoid circular dependency with server) ────────────────────

const GameSchema = new mongoose.Schema(
  {
    gameId: { type: String, required: true, unique: true, trim: true },
    templateId: { type: String, required: true, trim: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
    courseSlug: { type: String, trim: true, lowercase: true, default: '' },
    moduleNumber: { type: Number, default: null },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    genre: { type: String, default: '' },
    difficulty: { type: String, default: 'Intermediate' },
    conceptsTested: { type: [String], default: [] },
    xpReward: { type: Number, default: 300 },
    estimatedMinutes: { type: Number, default: 5 },
    htmlContent: { type: String, required: true },
    version: { type: Number, default: 1 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const GameModel = mongoose.model('Game', GameSchema, 'games');

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected\n');

  let imported = 0;
  let skipped = 0;

  for (const game of GAMES) {
    const filePath = path.join(GAMES_DIR, game.fileName);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found, skipping: ${game.fileName}`);
      skipped++;
      continue;
    }

    // Check if already in DB
    const existing = await GameModel.findOne({ gameId: game.gameId });
    if (existing) {
      console.log(`⏭️  Already exists, skipping: ${game.gameId}`);
      skipped++;
      continue;
    }

    // Read the HTML
    const htmlContent = fs.readFileSync(filePath, 'utf-8');
    const sizeKB = (Buffer.byteLength(htmlContent, 'utf-8') / 1024).toFixed(1);

    // Insert
    await GameModel.create({
      gameId: game.gameId,
      templateId: game.templateId,
      courseSlug: game.courseSlug,
      moduleNumber: game.moduleNumber,
      title: game.title,
      description: game.description,
      genre: game.genre,
      difficulty: game.difficulty,
      conceptsTested: game.conceptsTested,
      xpReward: game.xpReward,
      estimatedMinutes: game.estimatedMinutes,
      htmlContent,
      version: 1,
      isPublished: true,
    });

    console.log(`✅ Imported: ${game.gameId} (${sizeKB} KB)`);
    imported++;
  }

  console.log(`\n──────────────────────────────`);
  console.log(`📊 Results: ${imported} imported, ${skipped} skipped`);
  console.log(`──────────────────────────────\n`);

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB');
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
