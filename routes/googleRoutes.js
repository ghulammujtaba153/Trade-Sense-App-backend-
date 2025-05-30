import express from 'express';
import passport from 'passport';

const googleRouter = express.Router();


googleRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


googleRouter.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = req.user.token; 
    res.redirect(`http://localhost:3000/auth/success?token=${token}`);
  }
);

export default googleRouter;
