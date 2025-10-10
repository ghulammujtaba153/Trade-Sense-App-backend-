import axios from "axios";
import Bot from "../models/botSchema.js";


export const create = async (req, res) => {
  const { userId, session_id, message } = req.body;

  if (!session_id || !message) {
    return res.status(400).json({ error: "session_id and message are required" });
  }

  try {
    // Prepare SSE response to client
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    if (typeof res.flushHeaders === 'function') res.flushHeaders();

    // const legacyRes = await axios.post("http://13.48.23.117:8000/chat", { session_id, message }); // [Commented out: previous API]
    const controller = new AbortController();
    const apiRes = await axios.post(
      "http://51.20.64.9:8000/chat/stream",
      { session_id, message },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        responseType: "stream",
        signal: controller.signal,
      }
    );

    // Proxy upstream SSE to client while accumulating content to save
    let buffer = "";
    let acc = "";
    const forwardChunk = (chunkStr) => {
      try { res.write(chunkStr); } catch {}
    };

    apiRes.data.on("data", (chunk) => {
      const str = chunk.toString("utf8");
      forwardChunk(str);
      // Parse and accumulate data payloads for persistence
      buffer += str.replace(/\r\n/g, "\n");
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

    const finalize = async () => {
      try {
        // Drain any remaining buffered lines
        const lines = buffer.split("\n");
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data:")) {
            const data = trimmed.slice(5).trim();
            if (data && data !== "[DONE]") acc += data;
          }
        }
        if (acc) {
          const bot = new Bot({ userId, sessionId: session_id, message, response: acc });
          await bot.save();
          console.log("Chat saved:", bot);
        }
      } catch (e) {
        console.error("Chat save error:", e?.message || e);
      }
      try { res.write("data: [DONE]\n\n"); } catch {}
      try { res.end(); } catch {}
    };

    apiRes.data.on("end", finalize);
    apiRes.data.on("error", async (err) => {
      console.error("Upstream stream error:", err?.message || err);
      try { res.write(`event: error\ndata: ${JSON.stringify({ message: "stream error" })}\n\n`); } catch {}
      await finalize();
    });

    // Handle client disconnect
    req.on("close", () => {
      try { controller.abort(); } catch {}
    });
  } catch (error) {
    console.error("Chat error:", error.message);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Something went wrong while processing the chat" });
    }
    try { res.write(`event: error\ndata: ${JSON.stringify({ message: "init error" })}\n\n`); } catch {}
    try { res.end(); } catch {}
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