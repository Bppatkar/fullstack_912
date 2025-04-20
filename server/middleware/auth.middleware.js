import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Log from '../models/log.model.js';

export const authenticate = async (req, res, next) => {
  try {
    // Get token from cookies or header
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      await Log.create({
        action: 'auth_failed',
        message: 'No token provided'
      });
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    const user = await User.findById(decoded.id).select('-password -refreshToken');
    
    if (!user) {
      await Log.create({
        action: 'auth_failed',
        message: 'User not found for token'
      });
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    await Log.create({
      action: 'auth_error',
      message: error.message
    });
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const youtubeAuth = async (req, res, next) => {
  try {
    if (!req.user.refreshToken) {
      return res.status(401).json({ message: 'YouTube not connected' });
    }

    const { OAuth2 } = await import('google-auth-library');
    const oauth2Client = new OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );
    
    oauth2Client.setCredentials({
      refresh_token: req.user.refreshToken
    });
    
    req.oauthClient = oauth2Client;
    next();
  } catch (error) {
    await Log.create({
      action: 'youtube_auth_error',
      message: error.message,
      userId: req.user?.id
    });
    res.status(500).json({ message: error.message });
  }
};