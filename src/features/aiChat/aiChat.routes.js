import { Router } from 'express';
import { aiChatController } from './aiChat.controller.js';

const router = Router();
router.post('/message', aiChatController.sendMessage);
router.get('/history/:sessionId', aiChatController.getHistory);

export { router as aiChatRoutes };
