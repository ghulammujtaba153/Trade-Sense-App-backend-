import express from 'express';
import { deleteUser, forgotPassword, getAllUsers, getUser, login, register, updatePassword, updateStatus, updateUser } from '../controllers/authController.js';

const authRouter = express.Router();

// POST /api/auth/register
authRouter.post('/register', register);

// POST /api/auth/login
authRouter.post('/login', login);

authRouter.get("/users/:id", getUser);

authRouter.get("/users", getAllUsers);

authRouter.patch("/users/:id", deleteUser);

authRouter.put("/users/update/:id", updateUser);

authRouter.patch("/users/:id/status", updateStatus)

// forget password
authRouter.post("/forget-password/email", forgotPassword);
authRouter.patch("/forget-password/create/new", updatePassword);


export default authRouter;