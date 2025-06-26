import express from 'express';
import { addCategory, deleteUser, forgotPassword, getAdmins, getAllUsers, getEditors, getUser, login, makeAffiliate, register, setupProfile, updateCategories, updatePassword, updateStatus, updateUser } from '../controllers/authController.js';
import passport from 'passport';


const authRouter = express.Router();


authRouter.post('/register', register);

authRouter.post('/setup-profile/:id', setupProfile);

authRouter.post('/login', login);

authRouter.post('/category', addCategory);

authRouter.post('/category/update', updateCategories);

authRouter.get("/users/:id", getUser);

authRouter.get("/users", getAllUsers);


authRouter.get("/editors", getEditors);

authRouter.get("/admins", getAdmins);


authRouter.patch("/users/:id", deleteUser);

authRouter.put("/users/update/:id", updateUser);

authRouter.patch("/users/:id/status", updateStatus)

// forget password
authRouter.post("/forget-password/email", forgotPassword);
authRouter.patch("/forget-password/create/new", updatePassword);



// authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
authRouter.get('/google', (req, res, next) => {
  const { platform } = req.query;
  const redirect = `/google?state=${platform}`;
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    state: platform // store platform info in state
  })(req, res, next);
});


authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
  }),
  (req, res) => {
    const token = req.user.token; 
    res.redirect(`${process.env.CLIENT_URL}/home?token=${token}`);
  }
);


authRouter.get('/affiliate/:id', makeAffiliate);


export default authRouter;