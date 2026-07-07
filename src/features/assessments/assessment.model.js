import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctIndex: { type: Number, required: true, min: 0 },
    explanation: { type: String, default: '' },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    points: { type: Number, default: 10 },
  },
  { _id: true },
);

const AssessmentSchema = new mongoose.Schema(
  {
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true, index: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['quiz', 'test', 'practice'], default: 'quiz' },
    questions: { type: [QuestionSchema], default: [] },
    passingScore: { type: Number, default: 60 },
    timeLimit: { type: Number, default: 0 }, // seconds, 0 = no limit
    xpReward: { type: Number, default: 50 },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true },
);

AssessmentSchema.index({ topicId: 1, type: 1 });

export const AssessmentModel = mongoose.model('Assessment', AssessmentSchema, 'assessments');
