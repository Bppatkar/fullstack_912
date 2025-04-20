import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  videoId: String,
  userId: String
}, {
  timestamps: true
});

const Log = mongoose.model('Log', logSchema);
export default Log;