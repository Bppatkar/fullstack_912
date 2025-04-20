import passport from 'passport';
import pkg from 'passport-google-oauth20';
const { Strategy: GoogleStrategy } = pkg;
import User from '../models/user.model.js';

passport.use(new GoogleStrategy({
  clientID: process.env.YOUTUBE_CLIENT_ID,
  clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
  callbackURL: process.env.YOUTUBE_REDIRECT_URI
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      user = await User.create({
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails?.[0]?.value || '',
        youtubeAccessToken: accessToken,
        refreshToken
      });
    } else {
      user.youtubeAccessToken = accessToken;
      user.refreshToken = refreshToken;
      await user.save();
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
