import mongoose from 'mongoose';
import { GENRES, DIFFICULTIES, CONTENT_TYPES } from '../../constants/index.js';

const CourseSchema = new mongoose.Schema(
  {
    courseSlug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
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
    },
    longDescription: {
      type: String,
      trim: true,
    },
    genre: {
      type: String,
      enum: GENRES,
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: DIFFICULTIES,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    thumbnailUrlLight: {
      type: String,
      default: '',
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    instructorName: {
      type: String,
      default: '',
    },
    totalModules: {
      type: Number,
      default: 0,
    },
    totalTopics: {
      type: Number,
      default: 0,
    },
    totalDurationSeconds: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    contentType: {
      type: String,
      enum: CONTENT_TYPES,
      default: 'Course',
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    xpReward: {
      type: Number,
      default: 0,
    },
    badgeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual: slug → courseSlug (backward compat for frontend)
CourseSchema.virtual('slug').get(function () {
  return this.courseSlug;
});

// Compound indexes
CourseSchema.index({ genre: 1, isPublished: 1 });
CourseSchema.index({ isFeatured: 1, isPublished: 1 });

// Explicit collection name matches existing database
export const CourseModel = mongoose.model('Course', CourseSchema, 'courses');
