import React, { useEffect, useState } from 'react';
import { fetchVideoDetails, addComment, deleteComment, saveNotes } from '../api.jsx';
import AddComment from './AddComment.jsx';
import AddNotes from './AddNotes.jsx';

const VideoDetails = ({ videoId }) => {
  const [video, setVideo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getVideoDetails = async () => {
      try {
        const data = await fetchVideoDetails(videoId);
        setVideo(data);
      } catch (error) {
        setError('Failed to fetch video details');
      }
    };

    getVideoDetails();
  }, [videoId]);

  const handleAddComment = async (comment) => {
    try {
      await addComment(videoId, comment);
      const data = await fetchVideoDetails(videoId); // Refresh the video details
      setVideo(data);
    } catch (error) {
      setError('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      const data = await fetchVideoDetails(videoId); // Refresh the video details
      setVideo(data);
    } catch (error) {
      setError('Failed to delete comment');
    }
  };

  const handleSaveNotes = async (notes) => {
    try {
      await saveNotes(videoId, notes);
      const data = await fetchVideoDetails(videoId); // Refresh the video details
      setVideo(data);
    } catch (error) {
      setError('Failed to save notes');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{video.video.title}</h1>
      <p>{video.video.description}</p>
      <img src={video.video.thumbnails.default.url} alt="Thumbnail" />
      <p>{`Published: ${video.video.publishedAt}`}</p>

      <h3>Comments</h3>
      {video.comments.map((comment) => (
        <div key={comment.commentId}>
          <p>{comment.text}</p>
          <button onClick={() => handleDeleteComment(comment.commentId)}>Delete</button>
        </div>
      ))}

      <AddComment onAddComment={handleAddComment} />

      <h3>Notes</h3>
      <p>{video.notes.notes}</p>

      <AddNotes onSaveNotes={handleSaveNotes} />
    </div>
  );
};

export default VideoDetails;
