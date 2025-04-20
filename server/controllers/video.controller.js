
import Video from '../models/video.model.js';
import Comment from '../models/comment.model.js';
import Note from '../models/note.model.js';

export const getVideoDetails = async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    const comments = await Comment.find({ videoId });
    res.json({ video, comments });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch video details' });
  }
};

export const updateVideoDetails = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, description } = req.body;
    const video = await Video.findByIdAndUpdate(videoId, { title, description }, { new: true });
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update video details' });
  }
};

export const addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { comment } = req.body;
    const newComment = await Comment.create({ videoId, text: comment });
    res.json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    await Comment.findByIdAndDelete(commentId);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
};

export const saveNotes = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { content } = req.body;
    const note = await Note.create({ videoId, content });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save notes' });
  }
};