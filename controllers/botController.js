import axios from "axios";
import Bot from "../models/botSchema.js";


export const create = async (req, res) => {
  const { userId, session_id, message } = req.body;

  if (!session_id || !message) {
    return res.status(400).json({ error: "session_id and message are required" });
  }

  try {
    // Send message to new chat streaming API (SSE)
    // const legacyRes = await axios.post("http://13.48.23.117:8000/chat", { session_id, message }); // [Commented out: previous API]
    const apiRes = await axios.post(
      "http://51.20.64.9:8000/chat/stream",
      { session_id, message },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        responseType: "stream",
      }
    );

    // Collect streamed SSE data into a single response string
    const botResponse = await new Promise((resolve, reject) => {
      let buffer = "";
      let acc = "";
      apiRes.data.on("data", (chunk) => {
        buffer += chunk.toString("utf8");
        // Normalize Windows CRLF to LF for parsing
        buffer = buffer.replace(/\r\n/g, "\n");
        const parts = buffer.split("\n\n");
        buffer = parts.pop();
        for (const part of parts) {
          const lines = part.split("\n");
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("data:")) {
              const data = trimmed.slice(5).trim();
              if (data && data !== "[DONE]") acc += data;
            }
          }
        }
      });
      apiRes.data.on("end", () => resolve(acc));
      apiRes.data.on("error", (err) => reject(err));
    });

    // Tokenize the response (simple whitespace split)
  const tokens = (botResponse || "").split(/\s+/).filter(Boolean);

    // Save conversation
    const bot = new Bot({
      userId,
      sessionId: session_id,
      message,
      response: botResponse,
    });
    await bot.save();

    console.log("Chat saved:", bot);

    // Respond with both raw and tokenized response
    res.status(200).json({
      response: botResponse,
      tokens,
    });
  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({ error: "Something went wrong while processing the chat" });
  }
};




export const getTodayChat = async (req, res) => {
  const {id} = req.params

  try {
    const bots = await Bot.find({ userId: id, createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } });
    res.status(200).json(bots);
  } catch (error) {
    console.error("Error fetching today's bots:", error);
    res.status(500).json({ error: "Failed to fetch today's bots" });
  }
};