import axios from 'axios';

const API_URL = 'http://localhost:8000/api/video';

export const fetchVideoDetails = async (videoId) => {
  try {
    const response = await axios.get(`${API_URL}/${videoId}`, {
      headers: { Authorization: `Bearer your_jwt_token_here` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error;
  }
};

export const updateVideo = async (videoId, title, description) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${videoId}`,
      { title, description },
      { headers: { Authorization: `Bearer your_jwt_token_here` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating video:', error);
    throw error;
  }
};

export const addComment = async (videoId, comment) => {
  try {
    const response = await axios.post(
      `${API_URL}/${videoId}/comments`,
      { text: comment },
      { headers: { Authorization: `Bearer your_jwt_token_here` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/comments/${commentId}`,
      { headers: { Authorization: `Bearer your_jwt_token_here` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

export const saveNotes = async (videoId, notes) => {
  try {
    const response = await axios.post(
      `${API_URL}/${videoId}/notes`,
      { notes },
      { headers: { Authorization: `Bearer your_jwt_token_here` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error saving notes:', error);
    throw error;
  }
};
