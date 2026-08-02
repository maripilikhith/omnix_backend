import { Router } from 'express';
import { aiChatController } from './aiChat.controller.js';

const router = Router();
router.post('/message', aiChatController.sendMessage);
router.get('/history/:sessionId', aiChatController.getHistory);

// Interactive Video tested route (converted to Node)
router.post('/query-resolver', aiChatController.resolveQuery);

export { router as aiChatRoutes };
