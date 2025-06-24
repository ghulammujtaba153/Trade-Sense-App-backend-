import axios from "axios";
import Bot from "../models/botSchema.js";



export const create = async (req, res) => {
  const { session_id, message } = req.body;

  if (!session_id || !message) {
    return res.status(400).json({ error: "session_id and message are required" });
  }

  try {
    // Send message to chat API
    const apiRes = await axios.post("http://13.48.23.117:8000/chat", { session_id, message });

    const botResponse = apiRes.data.response; 

    
    const bot = new Bot({ sessionId: session_id, message, response: botResponse });
    await bot.save();
    console.log("chat save", bot);
    
    res.status(200).json({ response: botResponse });
  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({ error: "Something went wrong while processing the chat" });
  }
};
