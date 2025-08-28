import express from 'express';
import { uploadMiddleware, uploadFile, generateUploadUrl } from '../controllers/fileUploadController.js';

const uploadRouter = express.Router();

uploadRouter.post('/upload', uploadMiddleware, uploadFile);
uploadRouter.get('/upload-url', generateUploadUrl);

export default uploadRouter;
