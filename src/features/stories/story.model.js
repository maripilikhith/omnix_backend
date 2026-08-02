import mongoose from 'mongoose';

const MomentSchema = new mongoose.Schema(
  {
    momentId: { type: String, required: true },
    timestampSeconds: { type: Number, required: true },
    label: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const StorySchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true, index: true },
    order: { type: Number, required: true },
    storySlug: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    synopsis: { type: String, trim: true },
    videoUrl: { type: String, required: true },
    durationSeconds: { type: Number, required: true },
    thumbnailUrl: { type: String, default: '' },
    transcript: { type: String, default: '' },
    subtitlesUrl: { type: String, default: '' },
    moments: { type: [MomentSchema], default: [] },
    narrativeStyle: { type: String, default: 'cinematic' },
    characters: { type: [String], default: [] },
    interactiveQuestions: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true },
);

StorySchema.index({ topicId: 1, order: 1 });
StorySchema.index({ courseId: 1, order: 1 });

export const StoryModel = mongoose.model('Story', StorySchema, 'topic_stories');
