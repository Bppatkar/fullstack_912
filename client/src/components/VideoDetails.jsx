import React, { useEffect, useState } from "react";
import { fetchVideoDetails, addComment, deleteComment } from "../api";

const VideoDetails = ({ videoId }) => {
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const loadVideoDetails = async () => {
      try {
        const data = await fetchVideoDetails(videoId);
        setVideo(data.video);
        setComments(data.comments);
      } catch (error) {
        console.error("Failed to load video details:", error);
      }
    };

    loadVideoDetails();
  }, [videoId]);

  const handleAddComment = async () => {
    try {
      const comment = await addComment(videoId, newComment);
      setComments([...comments, comment]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(videoId, commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  if (!video) return <p>Loading...</p>;

  return (
    <div>
      <h1>{video.title}</h1>
      <p>{video.description}</p>
      <h2>Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            {comment.text}
            <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment"
      />
      <button onClick={handleAddComment}>Add Comment</button>
    </div>
  );
};

export default VideoDetails;