import express from 'express';
import { createTradingForm, getTradingForm } from '../controllers/tradingFormController.js';


const tradingFormRouter = express.Router();


tradingFormRouter.post('/', createTradingForm);


tradingFormRouter.get('/:id', getTradingForm);

export default tradingFormRouter;