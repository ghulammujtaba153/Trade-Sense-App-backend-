import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

// AWS config using SDK v3
const s3 = new S3Client({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// Set up multer-s3 (streams instead of buffering in memory)
const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'trader-store',
    contentType: multerS3.AUTO_CONTENT_TYPE, // detect automatically
    key: (req, file, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, `media/${fileName}`);
    },
  }),
});

export const uploadMiddleware = upload.single('file');

// Controller
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Log upload details
    console.log(`File uploaded: ${req.file.key}`);
    console.log(`File size: ${(req.file.size / 1024 / 1024).toFixed(2)} MB`);

    return res.status(200).json({
      message: 'File uploaded successfully',
      s3Url: req.file.location,
      fileKey: req.file.key,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      contentType: req.file.contentType,
      uploadedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      error: 'Upload failed',
      details: error.message
    });
  }
};