import express from 'express';
import { createTradingForm, getTradingForm, getTradingGraphData } from '../controllers/tradingFormController.js';


const tradingFormRouter = express.Router();


tradingFormRouter.post('/', createTradingForm);


tradingFormRouter.get('/:id', getTradingForm);

tradingFormRouter.get('/graph/:id', getTradingGraphData);

export default tradingFormRouter;