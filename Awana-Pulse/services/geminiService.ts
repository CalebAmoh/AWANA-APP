import { GoogleGenAI } from "@google/genai";
import { Kid } from '../types';

// Initialize the Gemini AI client
// Note: In a real production app, this should be proxied through a backend to protect the key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'YOUR_API_KEY_HERE' });

export const getCoachingInsights = async (kids: Kid[]): Promise<string> => {
  try {
    const kidSummary = kids.map(k => 
      `- ${k.name} (${k.group}): Status: ${k.status}, Attendance: ${k.attendanceRate}%, Sections: ${k.sectionsCompleted}`
    ).join('\n');

    const prompt = `
      You are an experienced Awana Ministry Director. Analyze the following roster of kids and provide 3 brief, actionable coaching tips for the leaders.
      Focus on how to help the kids labeled "Needs Help" and how to challenge the "Ahead" kids.
      Keep the tone encouraging and spiritual.
      
      Roster:
      ${kidSummary}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Error fetching Gemini insights:", error);
    return "AI Coaching is currently unavailable. Please check your API configuration.";
  }
};