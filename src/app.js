import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import hpp from 'hpp';

import config from './config/index.js';
import { corsConfig } from './config/cors.config.js';

// Middleware
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { requestId } from './middleware/requestId.js';
import { createRateLimiter } from './middleware/rateLimiter.js';
import { sanitize } from './middleware/sanitize.js';
import { authenticate } from './middleware/authenticate.js';
import { authorize } from './middleware/authorize.js';

// Feature routes
import { healthRoutes } from './features/health/index.js';
import { courseRoutes } from './features/courses/index.js';
import { moduleRoutes } from './features/modules/index.js';
import { topicRoutes } from './features/topics/index.js';
import { storyRoutes } from './features/stories/index.js';
import { explainerRoutes } from './features/explainers/index.js';
import { authRoutes } from './features/auth/index.js';
import { videoQuestionRoutes } from './features/videoQuestions/index.js';
import { aiChatRoutes } from './features/aiChat/index.js';
import { assessmentRoutes } from './features/assessments/index.js';
import { analyticsRoutes } from './features/analytics/index.js';
import { adminRoutes } from './features/admin/index.js';
import { aiRoutes } from './features/ai/index.js';
import { gameRoutes, gameController } from './features/games/index.js';

// Legacy controllers (for frontend backward compat)
import { courseController } from './features/courses/course.controller.js';
import { moduleController } from './features/modules/module.controller.js';
import { topicController } from './features/topics/topic.controller.js';
import { storyController } from './features/stories/story.controller.js';
import { explainerController } from './features/explainers/explainer.controller.js';
import { catchAsync } from './utils/catchAsync.js';
import { courseService } from './features/courses/course.service.js';
import { ModuleModel } from './features/modules/index.js';
import { TopicModel } from './features/topics/index.js';
import { StoryModel } from './features/stories/index.js';
import { ExplainerModel } from './features/explainers/index.js';
import { ApiResponse } from './utils/ApiResponse.js';
import { NotFoundError } from './utils/ApiError.js';

// ─── Create Express App ───────────────────────────────────────────────────────

const app = express();

// ─── Global Middleware Stack ──────────────────────────────────────────────────

// Request ID — must be first so every log line has a correlation ID
app.use(requestId);

// Security headers — frameguard & CORP disabled so frontend can embed game iframes
app.use(
  helmet({
    frameguard: false,
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    contentSecurityPolicy: false,
    hsts: false,
  }),
);

// CORS
app.use(cors(corsConfig));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Parameter pollution protection
app.use(hpp());

// NoSQL injection sanitization
app.use(sanitize());

// Request logging
app.use(requestLogger);

// Global rate limiting
app.use(createRateLimiter('global'));

// ─── Health & Root Routes ─────────────────────────────────────────────────────

app.use(healthRoutes);
app.get('/', (_req, res) => res.json({ status: 'ok', service: `${config.app.name} API v${config.app.version}` }));

// ─── Versioned API Routes (v1) ────────────────────────────────────────────────

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/modules', moduleRoutes);
app.use('/api/v1/topics', topicRoutes);
app.use('/api/v1/stories', storyRoutes);
app.use('/api/v1/explainers', explainerRoutes);
app.use('/api/v1/video-questions', videoQuestionRoutes);
app.use('/api/v1/ai-chat', aiChatRoutes);
app.use('/api/v1/assessments', assessmentRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/games', gameRoutes);

// ─── Legacy Compatibility Routes ──────────────────────────────────────────────
// These match the EXACT paths and response shapes of the existing server/
// so the frontend works without any changes during migration.

// Legacy public routes
const legacyPublic = express.Router();

legacyPublic.get('/ping', (_req, res) => res.json({ ok: true, ts: Date.now() }));

legacyPublic.get('/courses', catchAsync(courseController.legacyListPublished));

legacyPublic.get('/courses/:courseSlug', catchAsync(async (req, res) => {
  const course = await courseService.getCourseBySlug(req.params.courseSlug);

  // Fetch all related data in parallel with .lean() to improve performance by returning plain JS objects
  const [modules, topics, stories, explainers] = await Promise.all([
    ModuleModel.find({ courseId: course._id, isPublished: true }).sort({ number: 1 }).lean(),
    TopicModel.find({ courseId: course._id, isPublished: true }).sort({ number: 1 }).lean(),
    StoryModel.find({ courseId: course._id }).sort({ order: 1 }).lean(),
    ExplainerModel.find({ courseId: course._id, isPublished: true }).sort({ order: 1 }).lean(),
  ]);

  const obj = typeof course.toObject === 'function' ? course.toObject() : course;
  obj.slug = obj.courseSlug;

  return ApiResponse.raw(res, { ...obj, modules, topics, stories, explainers });
}));

legacyPublic.get('/games', catchAsync(gameController.legacyListPublished));
legacyPublic.get('/games/:gameId/play', catchAsync(gameController.legacyPlay));

app.use('/api/public', legacyPublic);
app.use('/api/ai', aiRoutes);

// Legacy admin routes — protected: requires a valid JWT with admin role
const legacyAdmin = express.Router();

// Apply authentication + authorization to every route in this router
legacyAdmin.use(authenticate, authorize('admin'));

legacyAdmin.get('/courses', catchAsync(courseController.legacyListAll));
legacyAdmin.post('/courses', catchAsync(courseController.legacyCreate));
legacyAdmin.put('/courses/:id', catchAsync(courseController.legacyUpdate));
legacyAdmin.delete('/courses/:id', catchAsync(courseController.legacyRemove));

legacyAdmin.get('/modules', catchAsync(moduleController.legacyListAll));
legacyAdmin.post('/modules', catchAsync(moduleController.legacyCreate));
legacyAdmin.put('/modules/:id', catchAsync(moduleController.legacyUpdate));
legacyAdmin.delete('/modules/:id', catchAsync(moduleController.legacyRemove));

legacyAdmin.get('/topics', catchAsync(topicController.legacyListAll));
legacyAdmin.post('/topics', catchAsync(topicController.legacyCreate));
legacyAdmin.put('/topics/:id', catchAsync(topicController.legacyUpdate));
legacyAdmin.delete('/topics/:id', catchAsync(topicController.legacyRemove));

legacyAdmin.get('/stories', catchAsync(storyController.legacyListAll));
legacyAdmin.post('/stories', catchAsync(storyController.legacyCreate));
legacyAdmin.put('/stories/:id', catchAsync(storyController.legacyUpdate));
legacyAdmin.delete('/stories/:id', catchAsync(storyController.legacyRemove));

legacyAdmin.get('/explainers', catchAsync(explainerController.legacyListAll));
legacyAdmin.post('/explainers', catchAsync(explainerController.legacyCreate));
legacyAdmin.put('/explainers/:id', catchAsync(explainerController.legacyUpdate));
legacyAdmin.delete('/explainers/:id', catchAsync(explainerController.legacyRemove));

legacyAdmin.get('/games', catchAsync(gameController.legacyListAll));
legacyAdmin.post('/games', catchAsync(gameController.legacyCreate));
legacyAdmin.put('/games/:id', catchAsync(gameController.legacyUpdate));
legacyAdmin.delete('/games/:id', catchAsync(gameController.legacyRemove));

app.use('/api/admin', legacyAdmin);

// ─── 404 Handler ──────────────────────────────────────────────────────────────

app.all('/{*path}', (req, _res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl}`));
});

// ─── Global Error Handler (must be LAST) ──────────────────────────────────────

app.use(errorHandler);

export default app;
