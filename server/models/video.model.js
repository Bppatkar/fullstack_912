import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
    unique: true
  },
  customTitle: String,
  customDescription: String,
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

export default mongoose.model('Video', videoSchema);