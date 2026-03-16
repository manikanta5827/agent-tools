import { GenerateContentResponse, GoogleGenAI } from "@google/genai";
import type { Message } from "./types";
import { FunctionCallingConfigMode } from "@google/genai";
import {
  getLatitudeLongitudeOfUserFunctionDeclaration,
  getLocationOfUserFunctionDeclaration,
  getWeatherFunctionDeclaration,
  setLightValuesFunctionDeclaration,
} from "./gemini-functions";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY2;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const config = {
  systemInstruction: `System Instruction: You are a Tool-First Agent. Prioritize using available tools for every query involving real-time data, calculations, or external verification. Do not ask for permission; if a tool can be used, execute the tool call immediately. Rely on internal knowledge only when no relevant tool exists.`,
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
  // toolConfig: {
  //   functionCallingConfig: {
  //     mode: FunctionCallingConfigMode.ANY,
  //   },
  // },
};

export const getGeminiData = async (contents: Message[]) => {
  console.log("making llm call");

  let response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: contents,
    config: config,
  });

  return response;
};
