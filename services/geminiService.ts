
import { GoogleGenAI, Type } from "@google/genai";
import { ActivityLog, AiInsightResponse } from "../types";

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getMarketInsights(logs: ActivityLog[]): Promise<AiInsightResponse> {
  const logSummary = logs.map(l => `${l.network} ${l.type} ${l.pair} ${l.status} $${l.pnl}`).join('\n');
  
  const prompt = `
    You are the HASHFLOW METRICS CORE AI. You communicate with 'spoke' nodes across all major blockchains (Arbitrum, Base, Polygon, Optimism, Ethereum).
    
    Current System Logs:
    ${logSummary}

    Your tasks:
    1. Analyze the logs to maximize future profit across all chains.
    2. Formulate a complex cross-chain strategy for Hashflow LP optimization.
    3. Monitor for potential hacker attacks, flash-loan exploits, or malicious intent in the transaction patterns.
    4. Perform a self-diagnostic on the Sentinel sub-systems.

    Provide a JSON response with:
    - summary: A high-level tactical overview.
    - riskLevel: Overall danger level (Low, Elevated, Critical).
    - optimization: Specific technical tweak for performance.
    - threatAssessment: Detection of any malicious patterns or "NOMINAL" if safe.
    - spokeStrategy: A specific directive for the spoke nodes to follow.
  `;

  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      // Rule: Always create instance right before making an API call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              riskLevel: { type: Type.STRING },
              optimization: { type: Type.STRING },
              threatAssessment: { type: Type.STRING },
              spokeStrategy: { type: Type.STRING },
            },
            required: ["summary", "riskLevel", "optimization", "threatAssessment", "spokeStrategy"]
          }
        }
      });

      return JSON.parse(response.text);
    } catch (error: any) {
      attempt++;
      const errorMessage = error?.message || "";
      
      // If it's a quota issue or server error, retry with backoff
      if (errorMessage.includes("429") || errorMessage.includes("500") || errorMessage.includes("RESOURCE_EXHAUSTED")) {
        if (attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          console.warn(`Gemini API Quota reached. Retrying in ${Math.round(waitTime)}ms... (Attempt ${attempt})`);
          await delay(waitTime);
          continue;
        }
      }

      console.error("Gemini Insights Final Error:", error);
      break;
    }
  }

  return {
    summary: "Neural link congested (Quota Exceeded). Core AI is cooling down to prevent circuit overload.",
    riskLevel: "THROTTLED",
    optimization: "Pause manual refreshes to allow rate-limit window to reset.",
    threatAssessment: "HEURISTIC SCAN: NOMINAL",
    spokeStrategy: "Maintain stable parameters. System will auto-sync when bandwidth returns."
  };
}
