import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';

const configureGoogleAuth = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value });

          if (!user) {
            user = new User({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              profilePic: profile.photos[0].value,
              isGoogleUse: true,
            });
            await user.save();
          }

          const token = jwt.sign(
            { userId: user._id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
          );

          // Attach the token to the user object
          user.token = token;
          return done(null, user); // ✅ Pass only the user object
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  // Serialize and deserialize user
  passport.serializeUser((user, done) => {
    done(null, user._id); // ✅ Serialize the user ID
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id); // ✅ Fetch user by ID
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

export default configureGoogleAuth;