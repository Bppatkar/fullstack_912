import Video from '../models/video.model.js';
import Comment from '../models/comment.model.js';
import Log from '../models/log.model.js';
import { getVideoDetails, updateVideoMetadata } from '../services/youtube.service.js';

export const getVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await Video.findOne({ videoId });
    
    await Log.create({
      action: 'video_view',
      message: `Viewed video ${videoId}`,
      videoId,
      userId: req.user.id
    });
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, description } = req.body;
    
    // Update in our DB
    const updatedVideo = await Video.findOneAndUpdate(
      { videoId },
      { title, description },
      { new: true }
    );
    
    // Update on YouTube
    await updateVideoMetadata(req.oauthClient, videoId, { title, description });
    
    await Log.create({
      action: 'video_update',
      message: `Updated video ${videoId}`,
      videoId,
      userId: req.user.id
    });
    
    res.json(updatedVideo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { text } = req.body;
    
    const comment = await Comment.create({
      videoId,
      text,
      author: req.user.username,
      userId: req.user.id
    });

    await Log.create({
      action: 'add_comment',
      message: `Added comment to video ${videoId}`,
      videoId,
      userId: req.user.id
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVideoComments = async (req, res) => {
  try {
    const { videoId } = req.params;
    const comments = await Comment.find({ videoId });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    await Video.findOneAndDelete({ videoId });
    
    await Log.create({
      action: 'video_delete',
      message: `Deleted video ${videoId}`,
      videoId,
      userId: req.user.id
    });
    
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};