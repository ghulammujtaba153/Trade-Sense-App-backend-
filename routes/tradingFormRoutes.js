import express from 'express';
import { createTradingForm, getTradingForm, getTradingGraphData, uploadTradesFromCSV } from '../controllers/tradingFormController.js';
import upload from '../middleware/upload.js';


const tradingFormRouter = express.Router();


tradingFormRouter.post('/', createTradingForm);


tradingFormRouter.get('/:id', getTradingForm);

tradingFormRouter.get('/graph/:id', getTradingGraphData);


tradingFormRouter.post("/upload-trades/:id", upload.single("file"), uploadTradesFromCSV);

export default tradingFormRouter;