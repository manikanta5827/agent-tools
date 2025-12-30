import { GoogleGenAI } from "@google/genai";
import type { Message } from "./index";

import {
  getWeatherFunctionDeclaration,
  setLightValuesFunctionDeclaration,
} from "./gemini-functions";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const config = {
  tools: [
    {
      functionDeclarations: [
        setLightValuesFunctionDeclaration,
        getWeatherFunctionDeclaration,
      ],
    },
  ],
};

export const getGeminiData = async (contents: Message[]) => {
  console.log("making llm call");

  let response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: config,
  });

  return response;
};
