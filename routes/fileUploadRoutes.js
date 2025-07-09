import express from 'express';
import { upload, uploadFile } from '../controllers/fileUploadController.js';

const uploadRouter = express.Router();

// Single file upload with field name 'file'
uploadRouter.post('/upload', upload.single('file'), uploadFile);

export default uploadRouter;
