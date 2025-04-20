import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/video",
});

// Fetch video details
export const fetchVideoDetails = async (videoId) => {
  try {
    const response = await API.get(`/${videoId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching video details:", error.response?.data || error.message);
    throw error;
  }
};

// Update video details
export const updateVideoDetails = async (videoId, data) => {
  try {
    const response = await API.put(`/${videoId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating video details:", error.response?.data || error.message);
    throw error;
  }
};

// Add a comment
export const addComment = async (videoId, comment) => {
  try {
    const response = await API.post(`/${videoId}/comments`, { comment });
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error.response?.data || error.message);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (videoId, commentId) => {
  try {
    const response = await API.delete(`/${videoId}/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting comment:", error.response?.data || error.message);
    throw error;
  }
};

// Save notes
export const saveNotes = async (videoId, content) => {
  try {
    const response = await API.post(`/${videoId}/notes`, { content });
    return response.data;
  } catch (error) {
    console.error("Error saving notes:", error.response?.data || error.message);
    throw error;
  }
};