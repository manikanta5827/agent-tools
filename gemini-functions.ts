import { Type } from "@google/genai";
import { z } from "zod";
// Define a function that the model can call to control smart lights
export const setLightValuesFunctionDeclaration = {
  name: "set_light_values",
  description: "Sets the brightness and color temperature of a light.",
  parameters: z.toJSONSchema(
    z.object({
      brightness: z.string(),
      color_temp: z.enum(["daylight", "cool", "warm"]),
    })
  ),
};

export const getWeatherFunctionDeclaration = {
  name: "get_weather",
  description: "Get the weather of a city",
  parameters: z.toJSONSchema(
    z.object({
      city: z.string(),
    })
  ),
};

export const setLightValues = (brightness: number, color_temp: string) => {
  return {
    brightness: brightness,
    colorTemperature: color_temp,
  };
};

export const getWeather = (city: string) => {
  return `The Temperature is 22 C, and little foggy in ${city}`;
};
