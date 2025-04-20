import express from 'express';
import {
  getVideoDetails,
  updateVideoDetails,
  addComment,
  deleteComment,
  saveNotes
} from '../controllers/video.controller.js';
import { authenticate, youtubeAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply authentication and YouTube auth to all routes
router.use(authenticate);
router.use(youtubeAuth);

// Video routes
router.get('/:videoId', getVideoDetails);
router.patch('/:videoId', updateVideoDetails);

// Comment routes
router.post('/:videoId/comments', addComment);
router.delete('/comments/:commentId', deleteComment);

// Notes routes
router.post('/:videoId/notes', saveNotes);

export default router;