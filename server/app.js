import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './db/connection.js';
import videoRoutes from './routes/video.route.js';
import authRoutes from './routes/auth.route.js';


dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public')); 
app.use(cookieParser());

// Database connection
connectDB();

// Routes
app.use('/api/video', videoRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});