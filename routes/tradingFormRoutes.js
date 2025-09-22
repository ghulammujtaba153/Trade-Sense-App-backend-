import express from 'express';
import * as tradingFormController from '../controllers/tradingFormController.js';
import upload from '../middleware/upload.js';


const tradingFormRouter = express.Router();


tradingFormRouter.post('/', tradingFormController.createTradingForm);


tradingFormRouter.get('/:id', tradingFormController.getTradingForm);

tradingFormRouter.get('/graph/:id', tradingFormController.getTradingGraphData);

tradingFormRouter.get('/graph/:id/summary', tradingFormController.getTradingGraphDataSummary);

tradingFormRouter.get('/graph/:id/equity-curve', tradingFormController.getTradingGraphDataEquityCurve);

tradingFormRouter.get('/graph/:id/daily-profit-loss', tradingFormController.getTradingGraphDataDailyProfitLoss);

tradingFormRouter.get('/graph/:id/win-vs-loss', tradingFormController.getTradingGraphDataWinVsLoss);

tradingFormRouter.get('/graph/:id/average-profit-loss', tradingFormController.getTradingGraphDataAverageProfitLoss);

tradingFormRouter.get('/graph/:id/r-multiple-distribution', tradingFormController.getTradingGraphDataRMultipleDistribution);

tradingFormRouter.get('/graph/:id/drawdown-over-time', tradingFormController.getTradingGraphDataDrawdownOverTime);

tradingFormRouter.get('/graph/:id/cumulative-risk-exposure', tradingFormController.getTradingGraphDataCumulativeRiskExposure);

tradingFormRouter.get('/graph/:id/session-performance', tradingFormController.getTradingGraphDataSessionPerformance);

tradingFormRouter.get('/graph/:id/trade-duration-vs-profit', tradingFormController.getTradingGraphDataTradeDurationVsProfit);

tradingFormRouter.get('/graph/:id/winrate-by-time', tradingFormController.getTradingGraphDataWinrateByTime);

tradingFormRouter.get('/graph/:id/setup-performance', tradingFormController.getTradingGraphDataSetupPerformance);

tradingFormRouter.get('/graph/:id/emotion-at-entry-vs-outcome', tradingFormController.getTradingGraphDataEmotionAtEntryVsOutcome);

tradingFormRouter.get('/graph/:id/insight-summary', tradingFormController.getTradingGraphDataInsightSummary);

tradingFormRouter.get('/graph/:id/insight-emotion-heatmap', tradingFormController.getTradingGraphDataInsightEmotionHeatmap);

tradingFormRouter.get('/graph/:id/insight-reflection-score', tradingFormController.getTradingGraphDataInsightReflectionScore);

tradingFormRouter.get('/graph/:id/insight-self-scored-discipline', tradingFormController.getTradingGraphDataInsightSelfScoredDiscipline);

tradingFormRouter.get('/graph/:id/insight-streak-analysis', tradingFormController.getTradingGraphDataInsightStreakAnalysis);

tradingFormRouter.post("/upload-trades/:id", upload.single("file"), tradingFormController.uploadTradesFromCSV);

export default tradingFormRouter;