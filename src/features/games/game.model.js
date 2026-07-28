import mongoose from 'mongoose';
import { GENRES, DIFFICULTIES } from '../../constants/index.js';

const GameSchema = new mongoose.Schema(
  {
    gameId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    templateId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: null,
      index: true,
    },
    courseSlug: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
      index: true,
    },
    moduleNumber: {
      type: Number,
      default: null,
    },
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      default: null,
      index: true,
    },
    topicSlug: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    genre: {
      type: String,
      enum: [...GENRES, ''],
      default: '',
    },
    activityType: {
      type: String,
      enum: ['game', 'simulation'],
      default: 'game',
      index: true,
    },
    difficulty: {
      type: String,
      enum: DIFFICULTIES,
      default: 'Intermediate',
    },
    conceptsTested: {
      type: [String],
      default: [],
    },
    xpReward: {
      type: Number,
      default: 300,
    },
    estimatedMinutes: {
      type: Number,
      default: 5,
    },
    /**
     * The full HTML content of the game.
     * Stored as a String field — typically 12–30 KB per game.
     * At small scale (<500 games), this is well within MongoDB's limits
     * and avoids the need for external object storage.
     *
     * When scaling up, this field would be replaced with `htmlUrl`
     * pointing to a CDN (Bunny.net / Cloudflare R2).
     *
     */
    htmlContent: {
      type: String,
      required: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Compound indexes for common queries
GameSchema.index({ courseSlug: 1, moduleNumber: 1, topicSlug: 1 });
GameSchema.index({ courseSlug: 1, moduleNumber: 1 });
GameSchema.index({ isPublished: 1, courseSlug: 1 });
GameSchema.index({ courseId: 1, moduleNumber: 1 });

// Explicit collection name
export const GameModel = mongoose.model('Game', GameSchema, 'games');
