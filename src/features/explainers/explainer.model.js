import mongoose from 'mongoose';

const ExplainerSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', index: true },
    momentId: { type: String },
    storyTimestampSeconds: { type: Number, default: 0 },
    explainerSlug: { type: String, required: true, trim: true },
    order: { type: Number, default: 1 },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['TEXT', 'VIDEO', 'DOCUMENT'], default: 'TEXT' },
    videoUrl: { type: String, default: '' },
    documentUrl: { type: String, default: '' },
    body: { type: String, trim: true, default: '' },
    storyConnect: { type: String, trim: true },
    imageUrl: { type: String, default: '' },
    formulaLatex: { type: String, default: '' },
    xpReward: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

ExplainerSchema.index({ topicId: 1, order: 1 });
ExplainerSchema.index({ topicId: 1, momentId: 1 });
ExplainerSchema.index({ courseId: 1, moduleId: 1, topicId: 1 });
ExplainerSchema.index({ courseId: 1, isPublished: 1, order: 1 });

export const ExplainerModel = mongoose.model('Explainer', ExplainerSchema, 'topic_explainers');
