import Video from '../models/video.model.js';
import Note from '../models/note.model.js';
import Comment from '../models/comment.model.js';
import Log from '../models/log.model.js';
import { google } from 'googleapis';

const youtube = google.youtube('v3');

// Get video details from YouTube API
export const getVideoDetails = async (req, res) => {
  try {
    const { videoId } = req.params;

    // Get YouTube data
    const youtubeResponse = await youtube.videos.list({
      auth: req.user.oauthClient,
      part: 'snippet,statistics,contentDetails',
      id: videoId
    });

    if (!youtubeResponse.data.items?.length) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const youtubeData = youtubeResponse.data.items[0];

    // Get local data
    const [localVideo, notes, comments] = await Promise.all([
      Video.findOne({ videoId, userId: req.user.id }),
      Note.findOne({ videoId, userId: req.user.id }),
      Comment.find({ videoId, userId: req.user.id })
    ]);

    // Create response
    const response = {
      ...youtubeData,
      localData: {
        notes: notes?.content || '',
        comments,
        customTitle: localVideo?.customTitle,
        customDescription: localVideo?.customDescription
      }
    };

    // Log the action
    await Log.create({
      action: 'video_view',
      userId: req.user.id,
      videoId,
      metadata: { source: 'youtube_api' }
    });

    res.json(response);
  } catch (error) {
    await Log.create({
      action: 'video_fetch_error',
      userId: req.user.id,
      videoId: req.params.videoId,
      message: error.message
    });
    res.status(500).json({ message: error.message });
  }
};

export const updateVideoDetails = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, description } = req.body;

    // Update on YouTube
    const youtubeResponse = await youtube.videos.update({
      auth: req.user.oauthClient,
      part: 'snippet',
      requestBody: {
        id: videoId,
        snippet: { title, description }
      }
    });

    // Update in local DB
    const updatedVideo = await Video.findOneAndUpdate(
      { videoId, userId: req.user.id },
      { customTitle: title, customDescription: description },
      { upsert: true, new: true }
    );

    await Log.create({
      action: 'video_update',
      userId: req.user.id,
      videoId,
      metadata: { title, description }
    });

    res.json({
      youtube: youtubeResponse.data,
      local: updatedVideo
    });
  } catch (error) {
    await Log.create({
      action: 'video_update_error',
      userId: req.user.id,
      videoId: req.params.videoId,
      message: error.message
    });
    res.status(500).json({ message: error.message });
  }
};

// Add comment to video
export const addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { text } = req.body;

    // Add to YouTube
    const youtubeResponse = await youtube.commentThreads.insert({
      auth: req.oauthClient,
      part: 'snippet',
      requestBody: {
        snippet: {
          videoId,
          topLevelComment: {
            snippet: {
              textOriginal: text
            }
          }
        }
      }
    });

    // Save to our database
    const comment = await Comment.create({
      commentId: youtubeResponse.data.id,
      videoId,
      text,
      userId: req.user.id
    });

    await Log.create({
      action: 'comment_add',
      userId: req.user.id,
      videoId,
      commentId: comment.commentId
    });

    res.status(201).json(comment);

  } catch (error) {
    await Log.create({
      action: 'comment_add_error',
      userId: req.user.id,
      videoId: req.params.videoId,
      message: error.message
    });
    res.status(500).json({ message: error.message });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Delete from YouTube
    await youtube.comments.delete({
      auth: req.oauthClient,
      id: commentId
    });

    // Delete from our database
    await Comment.findOneAndDelete({ commentId, userId: req.user.id });

    await Log.create({
      action: 'comment_delete',
      userId: req.user.id,
      commentId
    });

    res.json({ message: 'Comment deleted successfully' });

  } catch (error) {
    await Log.create({
      action: 'comment_delete_error',
      userId: req.user.id,
      commentId: req.params.commentId,
      message: error.message
    });
    res.status(500).json({ message: error.message });
  }
};

// Save notes for video
export const saveNotes = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { content } = req.body;

    const notes = await Note.findOneAndUpdate(
      { videoId, userId: req.user.id },
      { content },
      { upsert: true, new: true }
    );

    await Log.create({
      action: 'notes_save',
      userId: req.user.id,
      videoId
    });

    res.json(notes);

  } catch (error) {
    await Log.create({
      action: 'notes_save_error',
      userId: req.user.id,
      videoId: req.params.videoId,
      message: error.message
    });
    res.status(500).json({ message: error.message });
  }
};