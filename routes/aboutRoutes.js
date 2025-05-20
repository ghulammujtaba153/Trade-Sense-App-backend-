import express from 'express';
import { createAbout, getAbout } from '../controllers/aboutController.js';

const aboutRouter = express.Router();

aboutRouter.post('/', createAbout);
aboutRouter.get('/', getAbout);

export default aboutRouter;