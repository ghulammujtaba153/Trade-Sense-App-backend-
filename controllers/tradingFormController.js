import TradingForm from "../models/tradingFormSchema.js";
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
    const userId = req.body.userId; 

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