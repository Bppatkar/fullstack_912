import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/video",
});

// Fetch video details
export const fetchVideoDetails = async (videoId) => {
  try {
    const response = await API.get(`/videos/${videoId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching video details:", error);
    throw error;
  }
};

// Update video details
export const updateVideoDetails = async (videoId, data) => {
  try {
    const response = await API.put(`/videos/${videoId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating video details:", error);
    throw error;
  }
};

// Add a comment
export const addComment = async (videoId, comment) => {
  try {
    const response = await API.post(`/videos/${videoId}/comments`, { comment });
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (videoId, commentId) => {
  try {
    const response = await API.delete(`/videos/${videoId}/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

// Save notes
export const saveNotes = async (videoId, content) => {
  try {
    const response = await API.post(`/videos/${videoId}/notes`, { content });
    return response.data;
  } catch (error) {
    console.error("Error saving notes:", error);
    throw error;
  }
};