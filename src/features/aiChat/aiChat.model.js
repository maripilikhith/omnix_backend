import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const AiChatSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    storyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
    context: { type: String, default: '' },
    messages: { type: [MessageSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

AiChatSessionSchema.index({ userId: 1, isActive: 1 });

export const AiChatModel = mongoose.model('AiChatSession', AiChatSessionSchema, 'ai_chat_sessions');
