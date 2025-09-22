import TradingForm from "../models/tradingFormSchema.js";
import Mood from "../models/moodSchema.js";
import { Readable } from "stream";
import csv from "csv-parser";


export const createTradingForm = async (req, res) => {
    try {
        const tradingForm = await TradingForm.create(req.body);
        res.status(201).json(tradingForm);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



export const getTradingForm = async (req, res) => {
    const {id} = req.params;
    try {
        const tradingForm = await TradingForm.find({userId: id});
        res.status(200).json(tradingForm);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



// Controller to fetch trading data for graph
export const getTradingGraphData = async (req, res) => {
  try {
    const userId = req.params.id; 

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch trades for the user
    const trades = await TradingForm.find({ userId }).select(
      "tradeDate entryPrice exitPrice quantity"
    );

    // Transform data for graph
    const graphData = trades.map((trade) => ({
      date: trade.tradeDate.toISOString().split("T")[0], // e.g., '2025-07-21'
      amount: (trade.exitPrice - trade.entryPrice) * trade.quantity, // Profit/Loss
    }));

    // Group by date if multiple trades exist for the same day
    const groupedData = graphData.reduce((acc, item) => {
      if (!acc[item.date]) acc[item.date] = 0;
      acc[item.date] += item.amount;
      return acc;
    }, {});

    // Convert grouped data to array
    const finalData = Object.keys(groupedData).map((date) => ({
      date,
      amount: groupedData[date],
    }));

    res.status(200).json({ success: true, data: finalData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getTradingGraphDataSummary = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    // Fetch all trades for the user needed to compute PnL
    const trades = await TradingForm.find({ userId })
      .select("tradeDate direction entryPrice exitPrice actualExitPrice quantity")
      .sort({ tradeDate: 1 }); // ascending for equity walk

    const totalTrades = trades.length;
    if (totalTrades === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalTrades: 0,
          winRate: 0,
          avgProfitPerTrade: 0,
          maxDrawdownPct: 0
        }
      });
    }

    // Per-trade PnL
    const calcPnL = (t) => {
      const entry = Number(t.entryPrice);
      const exit = Number(t.actualExitPrice ?? t.exitPrice);
      const qty = Number(t.quantity ?? 0);
      if (!Number.isFinite(entry) || !Number.isFinite(exit) || !Number.isFinite(qty)) return 0;
      const dir = (t.direction || "").toLowerCase();
      return (dir === "buy" ? exit - entry : entry - exit) * qty;
    };

    let wins = 0;
    let sumPnl = 0;
    const dailyMap = new Map();
    for (const t of trades) {
      const pnl = calcPnL(t);
      if (pnl > 0) wins++;
      sumPnl += pnl;
      const dateKey = new Date(t.tradeDate).toISOString().split("T")[0];
      dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + pnl);
    }

    const winRate = +(wins / totalTrades * 100).toFixed(2);
    const avgProfitPerTrade = +(sumPnl / totalTrades).toFixed(2);

    // Build equity by day for drawdown
    const datesAsc = Array.from(dailyMap.keys()).sort((a,b)=> new Date(a)-new Date(b));
    let equity = 0;
    let peak = 0;
    let maxDrawdown = 0; // negative number
    for (const d of datesAsc) {
      equity += dailyMap.get(d) || 0;
      peak = Math.max(peak, equity);
      const dd = equity - peak; // <= 0
      if (dd < maxDrawdown) maxDrawdown = dd;
    }

    // Express drawdown as percent relative to peak equity. If peak=0, use absolute 0.
    const maxDrawdownPct = peak > 0 ? +((Math.abs(maxDrawdown) / peak) * 100).toFixed(2) : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalTrades,
        winRate,
        avgProfitPerTrade,
        maxDrawdownPct
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const getTradingGraphDataEquityCurve = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    // Pull necessary fields; prefer actualExitPrice for realized PnL
    const trades = await TradingForm.find({ userId })
      .select("tradeDate direction entryPrice actualExitPrice quantity")
      .sort({ tradeDate: -1 });

  if (!trades.length) return res.status(200).json({ success: true, data: [] });

    // Group by calendar date (YYYY-MM-DD) and sum daily PnL
    const byDay = new Map();
    for (const t of trades) {
      const dateKey = new Date(t.tradeDate).toISOString().split("T")[0];
      const entry = Number(t.entryPrice);
      const exit = Number(t.actualExitPrice ?? t.exitPrice);
      const qty = Number(t.quantity ?? 0);
      if (!Number.isFinite(entry) || !Number.isFinite(exit) || !Number.isFinite(qty)) continue;
      const dir = (t.direction || "").toLowerCase();
      const tradePnL = (dir === "buy" ? exit - entry : entry - exit) * qty;
      byDay.set(dateKey, (byDay.get(dateKey) || 0) + tradePnL);
    }

    // Take last 7 distinct days (most recent first from sort above)
    const distinctDatesDesc = Array.from(byDay.keys()).sort((a, b) => new Date(b) - new Date(a)).slice(0, 7);

    // Sort ascending for equity curve computation
    const datesAsc = distinctDatesDesc.sort((a, b) => new Date(a) - new Date(b));

    // Build cumulative equity series
    const result = [];
    let equity = 0;
    for (const d of datesAsc) {
      equity += byDay.get(d) || 0;
      result.push({ date: d, dailyPnL: byDay.get(d) || 0, equity });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const  getTradingGraphDataDailyProfitLoss = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const trades = await TradingForm.find({ userId })
      .select("tradeDate direction entryPrice exitPrice actualExitPrice quantity")
      .sort({ tradeDate: -1 });

    // Group PnL by date
    const byDay = new Map();
    const calcPnL = (t) => {
      const entry = Number(t.entryPrice);
      const exit = Number(t.actualExitPrice ?? t.exitPrice);
      const qty = Number(t.quantity ?? 0);
      if (!Number.isFinite(entry) || !Number.isFinite(exit) || !Number.isFinite(qty)) return 0;
      const dir = (t.direction || "").toLowerCase();
      return (dir === "buy" ? exit - entry : entry - exit) * qty;
    };

    for (const t of trades) {
      const dateKey = new Date(t.tradeDate).toISOString().split("T")[0];
      byDay.set(dateKey, (byDay.get(dateKey) || 0) + calcPnL(t));
    }

    const distinctDates = Array.from(byDay.keys()).sort((a, b) => new Date(b) - new Date(a));
    const last7Asc = distinctDates.slice(0, 7).sort((a, b) => new Date(a) - new Date(b));
    const data = last7Asc.map(d => ({ date: d, value: byDay.get(d) || 0 }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const  getTradingGraphDataWinVsLoss = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const trades = await TradingForm.find({ userId })
      .select("tradeDate direction entryPrice exitPrice actualExitPrice quantity")
      .sort({ tradeDate: -1 });

    const calcPnL = (t) => {
      const entry = Number(t.entryPrice);
      const exit = Number(t.actualExitPrice ?? t.exitPrice);
      const qty = Number(t.quantity ?? 0);
      if (!Number.isFinite(entry) || !Number.isFinite(exit) || !Number.isFinite(qty)) return 0;
      const dir = (t.direction || "").toLowerCase();
      return (dir === "buy" ? exit - entry : entry - exit) * qty;
    };

    // Determine last 7 distinct days
    const byDay = new Map();
    for (const t of trades) {
      const dateKey = new Date(t.tradeDate).toISOString().split("T")[0];
      byDay.set(dateKey, true);
    }
    const distinctDates = Array.from(byDay.keys()).sort((a, b) => new Date(b) - new Date(a));
    const last7Set = new Set(distinctDates.slice(0, 7));

    let wins = 0, losses = 0, breakeven = 0;
    for (const t of trades) {
      const dateKey = new Date(t.tradeDate).toISOString().split("T")[0];
      if (!last7Set.has(dateKey)) continue;
      const pnl = calcPnL(t);
      if (pnl > 0) wins++; else if (pnl < 0) losses++; else breakeven++;
    }
    const total = wins + losses + breakeven || 1;
    const data = {
      wins,
      losses,
      breakeven,
      winRate: +(wins / total * 100).toFixed(2),
      lossRate: +(losses / total * 100).toFixed(2),
      breakevenRate: +(breakeven / total * 100).toFixed(2)
    };

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const  getTradingGraphDataAverageProfitLoss = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const trades = await TradingForm.find({ userId })
      .select("tradeDate direction entryPrice exitPrice actualExitPrice quantity")
      .sort({ tradeDate: -1 });

    const byDay = new Map();
    for (const t of trades) byDay.set(new Date(t.tradeDate).toISOString().split("T")[0], true);
    const distinctDates = Array.from(byDay.keys()).sort((a, b) => new Date(b) - new Date(a));
    const last7Set = new Set(distinctDates.slice(0, 7));

    const calcPnL = (t) => {
      const entry = Number(t.entryPrice);
      const exit = Number(t.actualExitPrice ?? t.exitPrice);
      const qty = Number(t.quantity ?? 0);
      if (!Number.isFinite(entry) || !Number.isFinite(exit) || !Number.isFinite(qty)) return 0;
      const dir = (t.direction || "").toLowerCase();
      return (dir === "buy" ? exit - entry : entry - exit) * qty;
    };

    const wins = [];
    const losses = [];
    for (const t of trades) {
      const dateKey = new Date(t.tradeDate).toISOString().split("T")[0];
      if (!last7Set.has(dateKey)) continue;
      const pnl = calcPnL(t);
      if (pnl > 0) wins.push(pnl);
      else if (pnl < 0) losses.push(pnl);
    }

    const avg = (arr) => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0;
    const data = [
      { label: "Win", value: +avg(wins).toFixed(2) },
      { label: "Loss", value: +Math.abs(avg(losses)).toFixed(2) }
    ];

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const  getTradingGraphDataRMultipleDistribution = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });
    const trades = await TradingForm.find({ userId })
      .select("tradeDate direction entryPrice exitPrice actualExitPrice quantity stopLoss")
      .sort({ tradeDate: -1 });

    const byDay = new Map();
    for (const t of trades) byDay.set(new Date(t.tradeDate).toISOString().split("T")[0], true);
    const distinctDates = Array.from(byDay.keys()).sort((a, b) => new Date(b) - new Date(a));
    const last7Set = new Set(distinctDates.slice(0, 7));

    // Buckets
    const labels = ["-3R","-2R","-1R","0R","+1R","+2R","+3R"];
    const counts = Object.fromEntries(labels.map(l => [l, 0]));

    for (const t of trades) {
      const dateKey = new Date(t.tradeDate).toISOString().split("T")[0];
      if (!last7Set.has(dateKey)) continue;
      const entry = Number(t.entryPrice);
      const exit = Number(t.actualExitPrice ?? t.exitPrice);
      const stop = Number(t.stopLoss);
      if (!Number.isFinite(entry) || !Number.isFinite(exit) || !Number.isFinite(stop)) continue;
      const riskPerShare = Math.abs(entry - stop);
      if (riskPerShare <= 0) continue;
      const dir = (t.direction || "").toLowerCase();
      const pnlPerShare = (dir === "buy" ? exit - entry : entry - exit);
      const r = pnlPerShare / riskPerShare;
      const rInt = Math.max(-3, Math.min(3, Math.round(r)));
      const key = `${rInt > 0 ? "+" : rInt < 0 ? "" : ""}${rInt}R`.replace("0R","0R");
      counts[key] = (counts[key] || 0) + 1;
    }

    const data = labels.map(bucket => ({ bucket, value: counts[bucket] || 0 }));
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const  getTradingGraphDataDrawdownOverTime = async (req, res) => { 
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });
    const trades = await TradingForm.find({ userId })
      .select("tradeDate direction entryPrice exitPrice actualExitPrice quantity")
      .sort({ tradeDate: -1 });

    // Daily PnL aggregation
    const byDay = new Map();
    const calcPnL = (t) => {
      const entry = Number(t.entryPrice), exit = Number(t.actualExitPrice ?? t.exitPrice), qty = Number(t.quantity ?? 0);
      if (!Number.isFinite(entry) || !Number.isFinite(exit) || !Number.isFinite(qty)) return 0;
      const dir = (t.direction || "").toLowerCase();
      return (dir === "buy" ? exit - entry : entry - exit) * qty;
    };
    for (const t of trades) {
      const d = new Date(t.tradeDate).toISOString().split("T")[0];
      byDay.set(d, (byDay.get(d) || 0) + calcPnL(t));
    }
    const distinctDates = Array.from(byDay.keys()).sort((a,b)=> new Date(b)-new Date(a));
  const datesAsc = distinctDates.slice(0,7).sort((a,b)=> new Date(a)-new Date(b));

    // Equity and drawdown
    const equitySeries = [];
    let equity = 0, peak = 0;
    for (const d of datesAsc) {
      equity += byDay.get(d) || 0;
      peak = Math.max(peak, equity);
      const drawdown = equity - peak; // negative or 0
      equitySeries.push({ date: d, value: +drawdown.toFixed(2) });
    }

    return res.status(200).json({ success: true, data: equitySeries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const  getTradingGraphDataCumulativeRiskExposure = async (req, res) => { 
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });
    const trades = await TradingForm.find({ userId })
      .select("tradeDate entryPrice stopLoss quantity")
      .sort({ tradeDate: -1 });

    // Consider trades only in last 7 distinct days
    const byDay = new Map();
    for (const t of trades) byDay.set(new Date(t.tradeDate).toISOString().split("T")[0], true);
    const distinctDates = Array.from(byDay.keys()).sort((a,b)=> new Date(b)-new Date(a));
  const last7Set = new Set(distinctDates.slice(0,7));

    const inWindow = trades.filter(t => last7Set.has(new Date(t.tradeDate).toISOString().split("T")[0]))
      .sort((a,b)=> new Date(a.tradeDate) - new Date(b.tradeDate));

    const risks = inWindow.map((t) => {
      const entry = Number(t.entryPrice), stop = Number(t.stopLoss), qty = Number(t.quantity ?? 0);
      const riskPerShare = Math.abs(entry - stop);
      return Number.isFinite(riskPerShare) && Number.isFinite(qty) ? riskPerShare * qty : 0;
    });
    const total = risks.reduce((a,b)=>a+b,0) || 1;
    let cum = 0;
    const data = risks.map((r, i) => {
      cum += r;
      return { trade: `Trade ${i+1}`, value: +((cum/total)*100).toFixed(2) };
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const  getTradingGraphDataSessionPerformance = async (req, res) => { 
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });
    const trades = await TradingForm.find({ userId })
      .select("tradeDate direction entryPrice exitPrice actualExitPrice quantity")
      .sort({ tradeDate: -1 });

    const byDay = new Map();
    for (const t of trades) byDay.set(new Date(t.tradeDate).toISOString().split("T")[0], true);
    const distinctDates = Array.from(byDay.keys()).sort((a,b)=> new Date(b)-new Date(a));
  const last7Set = new Set(distinctDates.slice(0,7));

    const calcPnL = (t) => {
      const entry = Number(t.entryPrice), exit = Number(t.actualExitPrice ?? t.exitPrice), qty = Number(t.quantity ?? 0);
      if (!Number.isFinite(entry) || !Number.isFinite(exit) || !Number.isFinite(qty)) return 0;
      const dir = (t.direction || "").toLowerCase();
      return (dir === "buy" ? exit - entry : entry - exit) * qty;
    };

    const buckets = { Asian: 0, London: 0, "New York": 0 };
    for (const t of trades) {
      const dateKey = new Date(t.tradeDate).toISOString().split("T")[0];
      if (!last7Set.has(dateKey)) continue;
      const dt = new Date(t.tradeDate);
      const hour = dt.getUTCHours();
      // Rough session mapping (UTC)
      const session = hour < 7 ? "Asian" : hour < 13 ? "London" : hour < 22 ? "New York" : "Asian";
      buckets[session] += calcPnL(t);
    }
    const data = Object.entries(buckets).map(([session, value]) => ({ session, value }));
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const  getTradingGraphDataTradeDurationVsProfit = async (req, res) => { 
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });
    const trades = await TradingForm.find({ userId })
      .select("tradeDate direction entryPrice exitPrice actualExitPrice quantity")
      .sort({ tradeDate: -1 });

    const byDay = new Map();
    for (const t of trades) byDay.set(new Date(t.tradeDate).toISOString().split("T")[0], true);
    const distinctDates = Array.from(byDay.keys()).sort((a,b)=> new Date(b)-new Date(a));
  const last7Set = new Set(distinctDates.slice(0,7));

    const calcPnL = (t) => {
      const entry = Number(t.entryPrice), exit = Number(t.actualExitPrice ?? t.exitPrice), qty = Number(t.quantity ?? 0);
      if (!Number.isFinite(entry) || !Number.isFinite(exit) || !Number.isFinite(qty)) return 0;
      const dir = (t.direction || "").toLowerCase();
      return (dir === "buy" ? exit - entry : entry - exit) * qty;
    };

    // We don't have explicit duration; approximate using minutes since start of day
    const data = [];
    for (const t of trades) {
      const dateKey = new Date(t.tradeDate).toISOString().split("T")[0];
      if (!last7Set.has(dateKey)) continue;
      const dt = new Date(t.tradeDate);
      const minutes = dt.getUTCHours() * 60 + dt.getUTCMinutes();
      const pnl = calcPnL(t);
      data.push({ x: minutes, y: pnl, win: pnl > 0 });
    }
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const  getTradingGraphDataWinrateByTime = async (req, res) => { 
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });
    const trades = await TradingForm.find({ userId })
      .select("tradeDate direction entryPrice exitPrice actualExitPrice quantity")
      .sort({ tradeDate: -1 });

    const byDay = new Map();
    for (const t of trades) byDay.set(new Date(t.tradeDate).toISOString().split("T")[0], true);
    const distinctDates = Array.from(byDay.keys()).sort((a,b)=> new Date(b)-new Date(a));
  const last7Set = new Set(distinctDates.slice(0,7));

    const blocks = [
      { from: 0, to: 4 },
      { from: 4, to: 8 },
      { from: 8, to: 12 },
      { from: 12, to: 16 },
      { from: 16, to: 20 },
      { from: 20, to: 24 }
    ];
    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    const grid = {};
    const calcPnL = (t) => {
      const entry = Number(t.entryPrice), exit = Number(t.actualExitPrice ?? t.exitPrice), qty = Number(t.quantity ?? 0);
      if (!Number.isFinite(entry) || !Number.isFinite(exit) || !Number.isFinite(qty)) return 0;
      const dir = (t.direction || "").toLowerCase();
      return (dir === "buy" ? exit - entry : entry - exit) * qty;
    };

    for (const d of days) grid[d] = blocks.map(() => ({ wins:0, total:0 }));
    for (const t of trades) {
      const dateKey = new Date(t.tradeDate).toISOString().split("T")[0];
      if (!last7Set.has(dateKey)) continue;
      const dt = new Date(t.tradeDate);
      const dow = days[dt.getUTCDay() === 0 ? 6 : dt.getUTCDay()-1];
      const hour = dt.getUTCHours();
      const idx = blocks.findIndex(b => hour >= b.from && hour < b.to);
      if (idx === -1) continue;
      const pnl = calcPnL(t);
      grid[dow][idx].total += 1;
      if (pnl > 0) grid[dow][idx].wins += 1;
    }

    const data = days.slice(0,5).map((day) => ({
      day,
      blocks: grid[day].map((b, i) => ({ block: i+1, winRate: b.total ? +(b.wins/b.total*100).toFixed(2) : 0 }))
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const  getTradingGraphDataSetupPerformance = async (req, res) => { 
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });
    const trades = await TradingForm.find({ userId })
      .select("tradeDate setupName direction entryPrice exitPrice actualExitPrice quantity")
      .sort({ tradeDate: -1 });

    const byDay = new Map();
    for (const t of trades) byDay.set(new Date(t.tradeDate).toISOString().split("T")[0], true);
    const distinctDates = Array.from(byDay.keys()).sort((a,b)=> new Date(b)-new Date(a));
    if (distinctDates.length < 7) return res.status(200).json({ success: true, data: [], message: "Not enough data (need 7 distinct trade days)" });
    const last7Set = new Set(distinctDates.slice(0,7));

    const calcPnL = (t) => {
      const entry = Number(t.entryPrice), exit = Number(t.actualExitPrice ?? t.exitPrice), qty = Number(t.quantity ?? 0);
      if (!Number.isFinite(entry) || !Number.isFinite(exit) || !Number.isFinite(qty)) return 0;
      const dir = (t.direction || "").toLowerCase();
      return (dir === "buy" ? exit - entry : entry - exit) * qty;
    };

    const sums = new Map();
    const counts = new Map();
    for (const t of trades) {
      const dateKey = new Date(t.tradeDate).toISOString().split("T")[0];
      if (!last7Set.has(dateKey)) continue;
      const setup = t.setupName || "Unknown";
      sums.set(setup, (sums.get(setup) || 0) + calcPnL(t));
      counts.set(setup, (counts.get(setup) || 0) + 1);
    }
    const data = Array.from(sums.keys()).map(label => ({
      label,
      value: +((sums.get(label) || 0) / (counts.get(label) || 1)).toFixed(2)
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const  getTradingGraphDataEmotionAtEntryVsOutcome = async (req, res) => { 
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });
    const trades = await TradingForm.find({ userId })
      .select("tradeDate emotionalState direction entryPrice exitPrice actualExitPrice quantity")
      .sort({ tradeDate: -1 });

    const byDay = new Map();
    for (const t of trades) byDay.set(new Date(t.tradeDate).toISOString().split("T")[0], true);
    const distinctDates = Array.from(byDay.keys()).sort((a,b)=> new Date(b)-new Date(a));
    if (distinctDates.length < 7) return res.status(200).json({ success: true, data: [], message: "Not enough data (need 7 distinct trade days)" });
    const last7Set = new Set(distinctDates.slice(0,7));

    const calcPnL = (t) => {
      const entry = Number(t.entryPrice), exit = Number(t.actualExitPrice ?? t.exitPrice), qty = Number(t.quantity ?? 0);
      if (!Number.isFinite(entry) || !Number.isFinite(exit) || !Number.isFinite(qty)) return 0;
      const dir = (t.direction || "").toLowerCase();
      return (dir === "buy" ? exit - entry : entry - exit) * qty;
    };

    const data = [];
    let i = 0;
    for (const t of trades) {
      const dateKey = new Date(t.tradeDate).toISOString().split("T")[0];
      if (!last7Set.has(dateKey)) continue;
      const pnl = calcPnL(t);
      data.push({
        x: ++i, // sequence index
        y: +pnl.toFixed(2),
        emotion: t.emotionalState || "unknown",
        size: +Math.min(100, Math.abs(pnl)).toFixed(2),
        positive: pnl > 0
      });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getTradingGraphDataInsightSummary = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    // Pull all trades needed for risk and win rate
    const trades = await TradingForm.find({ userId })
      .select("direction entryPrice actualExitPrice exitPrice quantity stopLoss")
      .sort({ tradeDate: 1 });

    const total = trades.length;
    if (total === 0) {
      return res.status(200).json({ success: true, data: { winRate: 0, avgRiskPerTradePct: 0 } });
    }

    // Compute win rate
    const calcPnL = (t) => {
      const entry = Number(t.entryPrice);
      const exit = Number(t.actualExitPrice ?? t.exitPrice);
      const qty = Number(t.quantity ?? 0);
      if (!Number.isFinite(entry) || !Number.isFinite(exit) || !Number.isFinite(qty)) return 0;
      const dir = (t.direction || "").toLowerCase();
      return (dir === "buy" ? exit - entry : entry - exit) * qty;
    };
    let wins = 0;
    for (const t of trades) if (calcPnL(t) > 0) wins++;
    const winRate = +(wins / total * 100).toFixed(2);

    // Compute average risk per trade (percent of entry)
    let riskPctSum = 0;
    let counted = 0;
    for (const t of trades) {
      const entry = Number(t.entryPrice);
      const stop = Number(t.stopLoss);
      if (!Number.isFinite(entry) || !Number.isFinite(stop) || entry === 0) continue;
      const riskPerShare = Math.abs(entry - stop);
      const riskPct = (riskPerShare / Math.abs(entry)) * 100; // percent of entry
      riskPctSum += riskPct;
      counted++;
    }
    const avgRiskPerTradePct = counted ? +(riskPctSum / counted).toFixed(2) : 0;

    return res.status(200).json({ success: true, data: { winRate, avgRiskPerTradePct } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getTradingGraphDataInsightEmotionHeatmap = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    // Get last 90 days of moods and trades to build a heatmap
    const since = new Date(Date.now() - 90 * 24 * 3600 * 1000);
    const [moods, trades] = await Promise.all([
      Mood.find({ userId, createdAt: { $gte: since } }).select("mood createdAt").sort({ createdAt: -1 }),
      TradingForm.find({ userId, tradeDate: { $gte: since } })
        .select("tradeDate direction entryPrice exitPrice actualExitPrice quantity emotionalState")
        .sort({ tradeDate: -1 })
    ]);

    // Map each trade to a mood at the nearest earlier mood timestamp (fallback to trade.emotionalState)
    const moodTimeline = moods.map(m => ({ ts: +new Date(m.createdAt), mood: (m.mood || "").toLowerCase() }));
    const findMoodFor = (ts, fallback) => {
      for (const m of moodTimeline) {
        if (m.ts <= ts) return m.mood || fallback;
      }
      return (fallback || "unknown").toLowerCase();
    };

    const calcPnL = (t) => {
      const entry = Number(t.entryPrice), exit = Number(t.actualExitPrice ?? t.exitPrice), qty = Number(t.quantity ?? 0);
      if (!Number.isFinite(entry) || !Number.isFinite(exit) || !Number.isFinite(qty)) return 0;
      const dir = (t.direction || "").toLowerCase();
      return (dir === "buy" ? exit - entry : entry - exit) * qty;
    };

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const moodsSet = new Set(["good","happy","sad","angry","cool","neutral","unknown"]);
    const grid = {};
    for (const m of moodsSet) grid[m] = hours.map(() => ({ wins: 0, total: 0 }));

    for (const t of trades) {
      const ts = +new Date(t.tradeDate);
      const mood = findMoodFor(ts, (t.emotionalState || "unknown").toLowerCase());
      const mkey = moodsSet.has(mood) ? mood : "unknown";
      const h = new Date(t.tradeDate).getUTCHours();
      const pnl = calcPnL(t);
      grid[mkey][h].total += 1;
      if (pnl > 0) grid[mkey][h].wins += 1;
    }

    const data = Array.from(moodsSet).map(m => ({
      mood: m,
      hours: grid[m].map((b, h) => ({ hour: h, winRate: b.total ? +(b.wins / b.total * 100).toFixed(2) : 0 }))
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getTradingGraphDataInsightReflectionScore  = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    // Without a reflection field, proxy a score based on normalized daily PnL over last 12 weeks
    const since = new Date(Date.now() - 84 * 24 * 3600 * 1000); // 12 weeks
    const trades = await TradingForm.find({ userId, tradeDate: { $gte: since } })
      .select("tradeDate direction entryPrice exitPrice actualExitPrice quantity")
      .sort({ tradeDate: 1 });

    const calcPnL = (t) => {
      const entry = Number(t.entryPrice), exit = Number(t.actualExitPrice ?? t.exitPrice), qty = Number(t.quantity ?? 0);
      if (!Number.isFinite(entry) || !Number.isFinite(exit) || !Number.isFinite(qty)) return 0;
      const dir = (t.direction || "").toLowerCase();
      return (dir === "buy" ? exit - entry : entry - exit) * qty;
    };

    const byDay = new Map();
    for (const t of trades) {
      const d = new Date(t.tradeDate).toISOString().split("T")[0];
      byDay.set(d, (byDay.get(d) || 0) + calcPnL(t));
    }
    const daysAsc = Array.from(byDay.keys()).sort((a,b)=> new Date(a)-new Date(b));
    const values = daysAsc.map(d => byDay.get(d));
    const maxAbs = values.reduce((m, v) => Math.max(m, Math.abs(v)), 1);
    const scores = values.map(v => {
      const normalized = maxAbs ? (v / maxAbs) : 0; // -1..1
      const scaled = Math.round((normalized + 1) * 2.5); // 0..5
      return Math.max(1, Math.min(5, scaled)); // 1..5
    });
    // Build graph-friendly series with 1..n on x-axis
    const data = scores.map((s, i) => ({ x: (i+1).toString().padStart(2, "0"), value: s }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getTradingGraphDataInsightSelfScoredDiscipline = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    // We don't have explicit self-scored discipline; approximate by average PnL grouped by tradeType
    const since = new Date(Date.now() - 90 * 24 * 3600 * 1000);
    const trades = await TradingForm.find({ userId, tradeDate: { $gte: since } })
      .select("tradeType tradeDate direction entryPrice exitPrice actualExitPrice quantity")
      .sort({ tradeDate: -1 });

    const calcPnL = (t) => {
      const entry = Number(t.entryPrice), exit = Number(t.actualExitPrice ?? t.exitPrice), qty = Number(t.quantity ?? 0);
      if (!Number.isFinite(entry) || !Number.isFinite(exit) || !Number.isFinite(qty)) return 0;
      const dir = (t.direction || "").toLowerCase();
      return (dir === "buy" ? exit - entry : entry - exit) * qty;
    };

    // Compute win rate per tradeType and map to 1..5 score
    const winCounts = new Map();
    const totalCounts = new Map();
    for (const t of trades) {
      const key = (t.tradeType || "Unknown").trim();
      const pnl = calcPnL(t);
      totalCounts.set(key, (totalCounts.get(key) || 0) + 1);
      if (pnl > 0) winCounts.set(key, (winCounts.get(key) || 0) + 1);
    }
    const entries = Array.from(totalCounts.keys()).map(k => {
      const wins = winCounts.get(k) || 0;
      const total = totalCounts.get(k) || 0;
      const winRate = total ? wins / total : 0;
      const score = Math.max(1, Math.min(5, Math.ceil(winRate * 5)));
      const label = score >= 5 ? "Excellent" : score >= 4 ? "Good" : score >= 3 ? "Average" : score >= 2 ? "Poor" : "Very Poor";
      return { type: k, score, label, winRate: +(winRate * 100).toFixed(2) };
    });

    return res.status(200).json({ success: true, data: entries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getTradingGraphDataInsightStreakAnalysis = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const since = new Date(Date.now() - 90 * 24 * 3600 * 1000);
    const moods = await Mood.find({ userId, createdAt: { $gte: since } })
      .select("mood createdAt")
      .sort({ createdAt: 1 });

    // Compute longest streak per mood (consecutive entries with same mood)
    const streaks = new Map();
    let lastMood = null;
    let currentLen = 0;
    for (const m of moods) {
      const mood = (m.mood || "unknown").toLowerCase();
      if (mood === lastMood) {
        currentLen += 1;
      } else {
        currentLen = 1;
        lastMood = mood;
      }
      streaks.set(mood, Math.max(streaks.get(mood) || 0, currentLen));
    }
    const data = Array.from(streaks.entries()).map(([mood, length]) => ({ mood, length }));
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


const parseDMY = str => {
  // "17/7/25" → new Date(2025, 6, 17)
  if (!str) return undefined;
  const [d, m, y] = str.split("/").map(Number);
  if (!d || !m || y === undefined) return undefined;
  const year = y < 100 ? 2000 + y : y;
  return new Date(year, m - 1, d);
};


const safeFloat = v => {
  const n = parseFloat(String(v).replace(/[^0-9.\-]/g, ""));
  return isNaN(n) ? undefined : n;
};

const safeInt = v => {
  const n = parseInt(String(v).replace(/[^0-9.\-]/g, ""));
  return isNaN(n) ? undefined : n;
};


const computeResult = ({ direction, entry, exit }) => {
  if (entry === undefined || exit === undefined) return "unknown";
  const pnl = direction?.toLowerCase() === "buy" ? exit - entry : entry - exit;
  return pnl > 0 ? "win" : pnl < 0 ? "loss" : "breakeven";
};

export const uploadTradesFromCSV = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ error: "Missing userId" });
    if (!req.file) return res.status(400).json({ error: "CSV file missing" });

    const trades = [];
    const badRows = [];

    await new Promise((resolve, reject) => {
      Readable.from(req.file.buffer)
        .pipe(csv())
        .on("data", row => {
          try {
            // map CSV → schema
            const trade = {
              userId,
              stockName: row["PRODUCT"] || "Unknown",
              tradeDate: parseDMY(row["TRADE DATE."]) ?? Date.now(),
              tradeType: row["TRADE TYPE"]?.trim(),
              setupName: row["SETUP NAME"]?.trim(),
              direction: row["DIRECTION"]?.trim(),
              entryPrice: safeFloat(row["ENTRY PRICE"]),
              exitPrice: safeFloat(row["EXIT PRICE"]),
              quantity: safeInt(row["QUANTITY"]),          // "1lot" → 1
              stopLoss: safeFloat(row["STOP LOSS"]),
              takeProfitTarget: safeFloat(row["TAKE PROFIT 1"]),
              actualExitPrice: safeFloat(row["ACTUAL EXIT PRICE"]),
              result: computeResult({
                direction: row["DIRECTION"],
                entry: safeFloat(row["ENTRY PRICE"]),
                exit: safeFloat(row["ACTUAL EXIT PRICE"])
              }),
              emotionalState: row["EMOTIONAL STATE"]?.trim() || "neutral",
              notes: row["REFLECTION NOTES"] || "",
              image: ""               // add later if you support screenshots
            };

            // quick validation – skip rows still missing required fields
            const required = [
              "tradeType",
              "setupName",
              "direction",
              "entryPrice",
              "exitPrice",
              "quantity",
              "stopLoss",
              "takeProfitTarget",
              "actualExitPrice",
              "result",
              "emotionalState"
            ];
            const hasAll = required.every(k => trade[k] !== undefined && trade[k] !== null);
            if (hasAll) trades.push(trade);
            else badRows.push({ row, reason: "missing required after parse" });
          } catch (err) {
            badRows.push({ row, reason: err.message });
          }
        })
        .on("end", resolve)
        .on("error", reject);
    });

    // Bulk‑insert only the good rows
    const inserted = await TradingForm.insertMany(trades);

    res.status(200).json({
      message: "Upload complete",
      insertedCount: inserted.length,
      skippedCount: badRows.length,
      skippedPreview: badRows.slice(0, 5)   // first few for debugging
    });

  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: err.message });
  }
};