import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Ensure one note per user per video
noteSchema.index({ videoId: 1, userId: 1 }, { unique: true });

export default mongoose.model('Note', noteSchema);