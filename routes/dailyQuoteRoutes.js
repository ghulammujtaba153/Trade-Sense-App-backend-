import express from 'express';
import { createDailyQuote, deleteQuote, getDailyQuoteById, getDailyQuote, getAllDailyQuotes, updateDailyQuote } from '../controllers/dailyQuoteController.js';


const dailyQuoteRouter = express.Router();

dailyQuoteRouter.post("/", createDailyQuote);
dailyQuoteRouter.get("/", getDailyQuote);
dailyQuoteRouter.get("/all", getAllDailyQuotes);
dailyQuoteRouter.get("/:id", getDailyQuoteById);
dailyQuoteRouter.put("/:id", updateDailyQuote);
dailyQuoteRouter.delete("/:id", deleteQuote);

export default dailyQuoteRouter;