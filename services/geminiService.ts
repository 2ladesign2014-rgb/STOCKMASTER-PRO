
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

// Always initialize GoogleGenAI with a named apiKey parameter from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartStockInsights = async (products: Product[]) => {
  // Use 'gemini-3-flash-preview' for basic text tasks like summarization and simple inventory Q&A
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyse les données d'inventaire suivantes et fournis des recommandations stratégiques :
    ${JSON.stringify(products.map(p => ({ 
      nom: p.name, 
      quantité: p.quantity, 
      seuil: p.minThreshold, 
      prix: p.price 
    })))}
    
    Identifie les risques de rupture, les stocks dormants et suggère des optimisations de commande.
    Réponds de manière professionnelle et concise.
  `;

  try {
    // Calling generateContent with both model name and prompt as per guidelines
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.7,
        // Disable thinking budget to reduce latency for this specific analysis task
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    // Access the extracted string output via the .text property (not a method)
    return response.text || "Impossible d'obtenir des analyses pour le moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erreur lors de la génération des insights par l'IA.";
  }
};
