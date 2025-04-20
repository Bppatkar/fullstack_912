import React, { useEffect, useState } from "react";
import axios from "axios";

function VideoDetails({ videoId }) {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/video/${videoId}`);
        setVideo(response.data);
      } catch (err) {
        setError("Failed to fetch video details");
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [videoId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!video) {
    return <p>No video details available</p>;
  }

  return (
    <div>
      <h2>{video.title}</h2>
      <p>{video.description}</p>
      <a href={video.url} target="_blank" rel="noopener noreferrer">
        Watch Video
      </a>
    </div>
  );
}

export default VideoDetails;