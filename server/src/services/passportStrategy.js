// src/services/passportStrategy.js
// Configures Passport.js authentication strategies.
// Implements the Google OAuth 2.0 strategy, creating new users or linking Google profiles to existing email-registered accounts.
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const avatarUrl = profile.photos?.[0]?.value;

        let user = await User.findOne({ googleId });

        if (!user) {
          // If a user already exists with the same email (e.g. local signup),
          // link the Google account to that user.
          const existingByEmail = email
            ? await User.findOne({ email })
            : null;

          if (existingByEmail) {
            existingByEmail.googleId = googleId;
            existingByEmail.name = name;
            existingByEmail.avatarUrl = avatarUrl;
            user = await existingByEmail.save();
          } else {
            user = await User.create({ googleId, email, name, avatarUrl });
          }
        } else {
          // Update avatar/name if changed
          user.name = name;
          user.avatarUrl = avatarUrl;
          user = await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
