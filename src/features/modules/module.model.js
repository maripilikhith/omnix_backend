import mongoose from 'mongoose';

const CheckpointQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    options: {
      type: [String],
      required: true,
      validate: [(val) => val.length === 4, 'Question must have exactly 4 options'],
    },
    correctIndex: { type: Number, required: true, min: 0, max: 3 },
    explanation: { type: String, trim: true },
  },
  { _id: false },
);

const ModuleSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    courseSlug: { type: String, required: true, trim: true },
    moduleSlug: { type: String, required: true, trim: true },
    number: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    totalTopics: { type: Number, default: 0 },
    totalDurationSeconds: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
    prerequisiteModuleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      default: null,
    },
    checkpointQuiz: { type: [CheckpointQuestionSchema], default: [] },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

ModuleSchema.index({ courseId: 1, number: 1 });
ModuleSchema.index({ courseId: 1, moduleSlug: 1 }, { unique: true });

export const ModuleModel = mongoose.model('Module', ModuleSchema, 'course_modules');
