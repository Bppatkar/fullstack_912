import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  commentId: { 
    type: String, 
    required: true,
    unique: true 
  },
  videoId: { 
    type: String, 
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  author: { 
    type: String, 
    required: true 
  },
  replies: [{
    replyId: String,
    text: String,
    author: String,
    createdAt: { type: Date, default: Date.now }
  }],
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;