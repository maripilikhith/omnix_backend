import mongoose from 'mongoose';

const TopicSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true,
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true, index: true,
    },
    courseSlug: { type: String, required: true, trim: true },
    topicSlug: { type: String, required: true, trim: true },
    number: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    storyCount: { type: Number, default: 0 },
    explainerCount: { type: Number, default: 0 },
    hasAssessment: { type: Boolean, default: false },
    assessmentXpReward: { type: Number, default: 0 },
    xpReward: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
    prerequisiteTopicId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Topic', default: null,
    },
    isPublished: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

TopicSchema.index({ moduleId: 1, number: 1 });
TopicSchema.index({ courseId: 1, moduleId: 1 });
TopicSchema.index({ moduleId: 1, topicSlug: 1 }, { unique: true });
TopicSchema.index({ courseId: 1, isPublished: 1, number: 1 });

export const TopicModel = mongoose.model('Topic', TopicSchema, 'course_topics');
