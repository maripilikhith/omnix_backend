import mongoose from 'mongoose';

const AnalyticsEventSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    eventType: { type: String, required: true, index: true },
    resource: { type: String },
    resourceId: { type: mongoose.Schema.Types.ObjectId },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    sessionId: { type: String },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true },
);

AnalyticsEventSchema.index({ eventType: 1, createdAt: -1 });
AnalyticsEventSchema.index({ userId: 1, eventType: 1, createdAt: -1 });

export const AnalyticsModel = mongoose.model('AnalyticsEvent', AnalyticsEventSchema, 'analytics_events');
