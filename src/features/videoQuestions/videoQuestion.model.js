import mongoose from 'mongoose';

const VideoQuestionSchema = new mongoose.Schema(
  {
    storyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true, index: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
    timestampSeconds: { type: Number, required: true },
    question: { type: String, required: true, trim: true },
    options: { type: [String], required: true, validate: [(v) => v.length >= 2, 'At least 2 options required'] },
    correctIndex: { type: Number, required: true, min: 0 },
    explanation: { type: String, trim: true, default: '' },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    xpReward: { type: Number, default: 10 },
  },
  { timestamps: true },
);

VideoQuestionSchema.index({ storyId: 1, timestampSeconds: 1 });

export const VideoQuestionModel = mongoose.model('VideoQuestion', VideoQuestionSchema, 'video_questions');
