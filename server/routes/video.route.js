import express from "express";
import mongoose from "mongoose";
import Video from "../models/video.model.js";

const router = express.Router();

// Get video details
router.get("/:videoId", async (req, res) => {
  try {
    const videoId = req.params.videoId;

    // Validate that videoId is a non-empty string
    if (!videoId || typeof videoId !== "string") {
      return res.status(400).json({ message: "Invalid video ID" });
    }

    // Query using the custom videoId field
    const video = await Video.findOne({ videoId });
    console.log("Querying database with videoId:", videoId);
    console.log("Video found:", video);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json(video);
  } catch (error) {
    console.error("Error fetching video details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
