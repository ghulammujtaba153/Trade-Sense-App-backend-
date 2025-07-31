import express from 'express';
import { uploadMiddleware, uploadFile } from '../controllers/fileUploadController.js';

const uploadRouter = express.Router();

uploadRouter.post('/upload', uploadMiddleware, uploadFile);

export default uploadRouter;
