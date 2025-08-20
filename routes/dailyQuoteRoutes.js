import express from 'express';
import { createDailyQuote, deleteQuote, getDailyQuoteById, getDailyQuotes, updateDailyQuote } from '../controllers/dailyQuoteController.js';


const dailyQuoteRouter = express.Router();

dailyQuoteRouter.post("/", createDailyQuote);
dailyQuoteRouter.get("/", getDailyQuotes);
dailyQuoteRouter.get("/:id", getDailyQuoteById);
dailyQuoteRouter.put("/:id", updateDailyQuote);
dailyQuoteRouter.delete("/:id", deleteQuote);

export default dailyQuoteRouter;