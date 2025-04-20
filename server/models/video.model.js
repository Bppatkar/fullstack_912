import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true }, 
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  comments: [
    {
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  notes: [
    {
      content: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const Video = mongoose.model("Video", videoSchema);
export default Video;