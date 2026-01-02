import { GenerateContentResponse, GoogleGenAI } from "@google/genai";
import type { Message } from "./types";

import {
  getLatitudeLongitudeOfUserFunctionDeclaration,
  getLocationOfUserFunctionDeclaration,
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
        getLocationOfUserFunctionDeclaration,
        getLatitudeLongitudeOfUserFunctionDeclaration,
      ],
    },
  ],
};

export const getGeminiData = async (contents: Message[]) => {
  console.log("making llm call");

  let response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: config,
  });

  return response;
};
