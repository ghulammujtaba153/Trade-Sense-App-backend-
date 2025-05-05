import express from 'express';
import { deleteUser, forgotPassword, getAdmins, getAllUsers, getEditors, getUser, login, register, setupProfile, updatePassword, updateStatus, updateUser } from '../controllers/authController.js';

const authRouter = express.Router();


authRouter.post('/register', register);

authRouter.post('/setup-profile', setupProfile);


authRouter.post('/login', login);

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


export default authRouter;