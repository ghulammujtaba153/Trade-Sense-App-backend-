import multer from 'multer';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

// AWS config
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'eu-north-1',
});

// Set up multer-s3
const upload = multer({
  storage: multer.memoryStorage(), // or use multerS3 if you prefer direct streaming
  limits: { fileSize: 10 * 1024 * 1024 }, // Optional: 10MB file size limit
});

export const uploadMiddleware = upload.single('file'); // MUST match frontend field name

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const fileName = `${Date.now()}-${file.originalname}`;

    const params = {
      Bucket: 'trader-store',
      Key: `media/${fileName}`,
      Body: file.buffer, // directly use buffer from multer memory
      ContentType: file.mimetype,
      
    };

    const s3Result = await s3.upload(params).promise();

    return res.status(200).json({
      message: 'File uploaded successfully',
      s3Url: s3Result.Location,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
