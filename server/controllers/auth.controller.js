import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { OAuth2Client } from 'google-auth-library';
import Log from '../models/log.model.js';



const youtubeOAuth2Client = new OAuth2Client(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SESSION_SECRET, {
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

    await Log.create({
      action: 'user_register',
      userId: user._id
    });
    res.status(201).json({ user, token });
  } catch (error) {
    await Log.create({
      action: 'register_error',
      message: error.message
    });
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

    await Log.create({
      action: 'youtube_oauth_init',
      userId: req.user.id
    });
    res.json({ authUrl });
  } catch (error) {
    await Log.create({
      action: 'youtube_oauth_error',
      message: error.message,
      userId: req.user?.id
    });
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

    await Log.create({
      action: 'youtube_oauth_success',
      userId: req.user.id
    });
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?youtube_success=true`);
  } catch (error) {
    await Log.create({
      action: 'youtube_oauth_error',
      message: error.message,
      userId: req.user?.id
    });
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
    await Log.create({
      action: 'auth_error',
      message: error.message,
      userId: req.user?.id
    });
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    await Log.create({
      action: 'user_login',
      userId: user._id
    });

    res.json({ user, token });
  } catch (error) {
    await Log.create({
      action: 'login_error',
      message: error.message
    });
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    await Log.create({
      action: 'user_logout',
      userId: req.user?.id
    });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
