# fullstack_912

# YouTube Companion Dashboard

## API Endpoints

- `GET /api/videos/:videoId` - Fetch video details.
- `PUT /api/videos/:videoId` - Update video title and description.
- `POST /api/videos/:videoId/comments` - Add a comment.
- `DELETE /api/videos/:videoId/comments/:commentId` - Delete a comment.
- `POST /api/videos/:videoId/notes` - Save notes.

## Database Schema

### Video

- `title`: String
- `description`: String

### Comment

- `videoId`: ObjectId
- `text`: String

### Note

- `videoId`: ObjectId
- `content`: String

---

✅ Quick Summary of What’s Working Now
🔐 Auth System: Register, login, logout, get current user.

🎥 YouTube OAuth: Fully set up using Passport with refresh tokens.

🧠 Video management: Custom metadata, notes, comments with YouTube sync.

🗃️ Database: Connected and models are all wired up.

📦 Environment setup: Clean .env, secure cookie handling.

🔁 Nodemon: Auto-restarting on code changes.

✅ No more route crashes.

---

# Server Folder Strucuture

/server
├── /controllers
│ └── video.controller.js
├── /db
│ └── connection.js
├── /models
│ ├── comment.model.js
│ ├── log.model.js
│ ├── note.model.js
│ └── video.model.js
├── /routes
│ └── video.route.js
├── /services
│ └── youtube.service.js
├── /utils
│ └── logger.js
├── app.js
├── .env
├── package.json
└── README.md
