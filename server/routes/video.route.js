import express from 'express';
import {
  getVideo,
  updateVideo,
  deleteVideo,
  getVideoComments,
  addComment
} from '../controllers/video.controller.js';
import  {authenticate}  from '../middleware/auth.middleware.js';

const router = express.Router();

// Authenticate all video routes
router.use(authenticate);

// Video routes
router.get('/:videoId', getVideo);
router.patch('/:videoId', updateVideo);
router.delete('/:videoId', deleteVideo);

// Comment routes
router.get('/:videoId/comments', getVideoComments);
router.post('/:videoId/comments', addComment);

export default router;