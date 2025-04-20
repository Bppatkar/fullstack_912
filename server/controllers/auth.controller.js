import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { OAuth2Client } from 'google-auth-library';
import { logAction } from '../utils/logger.js';

const youtubeOAuth2Client = new OAuth2Client(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// User Registration
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ username, email, password });
    
    const token = generateToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    await logAction('user_register', `New user registered: ${user.email}`);
    res.status(201).json({ user, token });
  } catch (error) {
    await logAction('auth_error', error.message);
    res.status(500).json({ message: error.message });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      await logAction('auth_failed', `Failed login attempt for ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    await logAction('user_login', `User logged in: ${user.email}`);
    res.json({ user, token });
  } catch (error) {
    await logAction('auth_error', error.message);
    res.status(500).json({ message: error.message });
  }
};

// YouTube OAuth Initiation
export const initiateYoutubeOAuth = async (req, res) => {
  try {
    const authUrl = youtubeOAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.force-ssl',
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/userinfo.profile'
      ],
      prompt: 'consent'
    });

    await logAction('youtube_oauth_init', `Initiated YouTube OAuth for user ${req.user.id}`);
    res.json({ authUrl });
  } catch (error) {
    await logAction('youtube_oauth_error', error.message);
    res.status(500).json({ message: error.message });
  }
};

// YouTube OAuth Callback
export const youtubeOAuthCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await youtubeOAuth2Client.getToken(code);
    
    await User.findByIdAndUpdate(req.user.id, {
      youtubeAccessToken: tokens.access_token,
      refreshToken: tokens.refresh_token
    });

    await logAction('youtube_oauth_success', `YouTube connected for user ${req.user.id}`);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?youtube_success=true`);
  } catch (error) {
    await logAction('youtube_oauth_error', error.message);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?youtube_error=true`);
  }
};

// Get Current User
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -refreshToken');
    
    res.json(user);
  } catch (error) {
    await logAction('auth_error', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Logout
export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.json({ message: 'Logged out successfully' });
};