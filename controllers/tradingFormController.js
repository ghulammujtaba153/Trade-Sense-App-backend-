import TradingForm from "../models/tradingFormSchema.js";


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