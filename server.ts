import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client lazily/safely
  let aiClient: GoogleGenAI | null = null;
  function getAiClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("GEMINI_API_KEY environment variable is not defined!");
      }
      aiClient = new GoogleGenAI({
        apiKey: apiKey || "MOCK_KEY",
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // API Route for AI Coach
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Surasho dhab ah ayaa loo baahan yahay!" });
      }

      const client = getAiClient();
      
      const systemInstruction = 
        "Waxaad tahay Kheyre Fit AI, oo ah macalin caafimaad, cuntada caafimaadka leh, iyo jimicsiga oo aad u khibrad badan. " +
        "Waxaad caawisaa dadka Soomaaliyeed ee raba inay hagaajiyaan jidhkooda, dhisidda murqaha (Muruq Dhisid), " +
        "ama dhimista baruurta (Baruur Dhimis). Waxaad si qoto dheer u fahamtaa cuntada Soomaalida (sida bariiska, baastada, hilibka, caanaha, boorashka, laxooxda, sambuuska, muufada, badarka, kaluunka, canjeerada, baastada) iyo sida loomaareeyo micro/macro nutrients-ka " +
        "iyada oo loo eegayo barotiinka, carbohydrates-ka, iyo dufanka (Macros: Borotiin, Karbohaydrayt, Dufan). " +
        "Had iyo jeer u jawaab si dhiirigelin leh, saaxiibtinimo leh, oo af-Soomaali qoran oo sax ah dhexdeeda ku hadal. " +
        "Ugu jawaab si kooban oo cad oo waxtar leh (marna ha dhererinin jawaabta haddaan loo baahan dhibic-dhibic qoraal). " +
        "Haddaad u baahatid, waxaad siin kartaa qorshayaal fudud ama beddelaado hufan oo cuntooyin caafimaad leh.";

      // Formulate history to acceptable format
      const formattedHistory = Array.isArray(history) 
        ? history.map((item: any) => ({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.content || "" }]
          }))
        : [];

      const chat = client.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction,
          temperature: 0.7,
        },
        history: formattedHistory
      });

      const response = await chat.sendMessage({ message });
      const reply = response.text || "Waan ka xumahay, hadda ma awoodo inaan ka jawaabo.";
      
      res.json({ reply });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ 
        error: "Khalad ayaa ka dhacay adeegga AI. Fadlan hubi in GEMINI_API_KEY uu sax yahay ee Settings-ka.",
        details: error?.message || ""
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running directly on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});
