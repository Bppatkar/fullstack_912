import express from 'express';
import passport from 'passport';
import {
  register,
  login,
  logout,
  getMe,
  initiateYoutubeOAuth,
  youtubeOAuthCallback
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', getMe);

// YouTube OAuth routes
router.get('/youtube', passport.authenticate('google', {
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/youtube'],
  accessType: 'offline',
  prompt: 'consent'
}));

router.get('/youtube/callback', passport.authenticate('google', {
  failureRedirect: '/login'
}), youtubeOAuthCallback);

export default router;
