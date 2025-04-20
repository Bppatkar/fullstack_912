import express from "express";
import {
  getVideoDetails,
  updateVideoDetails,
  addComment,
  deleteComment,
  saveNotes,
} from "../controllers/video.controller.js";

const router = express.Router();

router.get("/:videoId", getVideoDetails);
router.put("/:videoId", updateVideoDetails);
router.post("/:videoId/comments", addComment);
router.delete("/:videoId/comments/:commentId", deleteComment);
router.post("/:videoId/notes", saveNotes);

export default router;
