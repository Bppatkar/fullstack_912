import { google } from 'googleapis';

const youtube = google.youtube('v3');

export const getVideoDetails = async (auth, videoId) => {
  try {
    const response = await youtube.videos.list({
      auth,
      part: 'snippet,statistics,contentDetails',
      id: videoId
    });
    return response.data.items[0];
  } catch (error) {
    console.error('YouTube API Error:', error);
    throw error;
  }
};

export const updateVideoMetadata = async (auth, videoId, updates) => {
  try {
    const response = await youtube.videos.update({
      auth,
      part: 'snippet',
      requestBody: {
        id: videoId,
        snippet: {
          ...updates
        }
      }
    });
    return response.data;
  } catch (error) {
    console.error('YouTube Update Error:', error);
    throw error;
  }
};