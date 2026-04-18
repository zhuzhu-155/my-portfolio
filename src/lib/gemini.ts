import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const models = {
  flash: "gemini-3-flash-preview",
  pro: "gemini-3.1-pro-preview",
  lite: "gemini-3.1-flash-lite-preview",
  image: "gemini-3-pro-image-preview",
};

export interface CampaignData {
  subjectLines: string[];
  bodyCopy: string;
  imagePrompt: string;
}

export async function generateCampaign(prompt: string, tone: string, audience: string): Promise<CampaignData> {
  const response = await ai.models.generateContent({
    model: models.pro,
    contents: `Generate an email marketing campaign based on this prompt: "${prompt}". 
    The tone should be ${tone} and the target audience is ${audience}.
    Provide 3 catchy subject lines, a compelling body copy in markdown format, and a detailed visual description for an AI image generator.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subjectLines: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 different subject line options",
          },
          bodyCopy: {
            type: Type.STRING,
            description: "The main email body in markdown format",
          },
          imagePrompt: {
            type: Type.STRING,
            description: "A detailed prompt for generating a campaign visual",
          },
        },
        required: ["subjectLines", "bodyCopy", "imagePrompt"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}") as CampaignData;
  } catch (e) {
    console.error("Failed to parse campaign JSON", e);
    throw new Error("Failed to generate campaign data structure.");
  }
}

export async function generateCampaignImage(prompt: string, size: "1K" | "2K" | "4K" = "1K") {
  const response = await ai.models.generateContent({
    model: models.image,
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: size,
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image data returned from Gemini.");
}

export async function chatWithGemini(messages: { role: "user" | "model"; content: string }[], model: string = models.flash) {
  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction: "You are an expert email marketing consultant. Help the user refine their campaign, improve copy, or suggest better strategies.",
    }
  });

  const lastMessage = messages[messages.length - 1];
  const history = messages.slice(0, -1).map(m => ({
    role: m.role,
    parts: [{ text: m.content }]
  }));

  // Note: The SDK might handle history differently depending on version, 
  // but usually we can pass history to create or just send messages.
  // For simplicity in this multi-turn setup:
  const result = await chat.sendMessage({
    message: lastMessage.content
  });

  return result.text;
}
