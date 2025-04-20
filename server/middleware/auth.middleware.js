import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Log from '../models/log.model.js';

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    await Log.create({
      action: 'auth_error',
      message: error.message
    });
    res.status(401).json({ message: 'Invalid token' });
  }
};

const youtubeAuth = async (req, res, next) => {
  try {
    const { OAuth2 } = await import('google-auth-library');
    const oauth2Client = new OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI
    );
    
    if (!req.user.refreshToken) {
      return res.status(401).json({ message: 'YouTube not connected' });
    }
    
    oauth2Client.setCredentials({
      refresh_token: req.user.refreshToken
    });
    
    req.oauthClient = oauth2Client;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {authenticate, youtubeAuth}