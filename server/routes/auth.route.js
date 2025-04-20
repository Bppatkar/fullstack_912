import express from 'express';
import {
  register,
  login,
  getMe,
  logout,
  initiateYoutubeOAuth,
  youtubeOAuthCallback
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.post('/logout', logout);
router.get('/youtube', authenticate, initiateYoutubeOAuth);
router.get('/youtube/callback', authenticate, youtubeOAuthCallback);

export default router;