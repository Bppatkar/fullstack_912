# fullstack_912


# API End Point

GET    api/video/:videoId          - Get video details with comments and notes
PATCH  /api/video/:videoId         - Update video title/description

POST   /api/video/:videoId/comments  - allows users to add a comment to a video.
DELETE  /api/video/comments/:commentId  - delete comment

POST   /api/video/:videoId/notes  - save note for video

___

✅ Quick Summary of What’s Working Now
🔐 Auth System: Register, login, logout, get current user.

🎥 YouTube OAuth: Fully set up using Passport with refresh tokens.

🧠 Video management: Custom metadata, notes, comments with YouTube sync.

🗃️ Database: Connected and models are all wired up.

📦 Environment setup: Clean .env, secure cookie handling.

🔁 Nodemon: Auto-restarting on code changes.

✅ No more route crashes.