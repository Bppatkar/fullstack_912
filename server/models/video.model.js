import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  videoId: { 
    type: String, 
    required: true,
    unique: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: String,
  thumbnail: String,
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  lastFetched: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);


export default Video;