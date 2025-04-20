import React, { useState } from 'react';
import VideoDetails from './components/VideoDetails.jsx';
import "./app.css";

function App() {
  const [videoId, setVideoId] = useState('SnZFWyqRiSY'); // we can change this ID for testing

  return (
    <div>
      <h1>Video Details App</h1>
      <VideoDetails videoId={videoId} />
    </div>
  );
}

export default App;
