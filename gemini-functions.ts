import { Type } from "@google/genai";

// Define a function that the model can call to control smart lights
export const setLightValuesFunctionDeclaration = {
  name: "set_light_values",
  description: "Sets the brightness and color temperature of a light.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      brightness: {
        type: Type.NUMBER,
        description:
          "Light level from 0 to 100. Zero is off and 100 is full brightness",
      },
      color_temp: {
        type: Type.STRING,
        enum: ["daylight", "cool", "warm"],
        description:
          "Color temperature of the light fixture, which can be `daylight`, `cool` or `warm`.",
      },
    },
    required: ["brightness", "color_temp"],
  },
};

export const getWeatherFunctionDeclaration = {
  name: "get_weather",
  description: "Get the weather of a city",
  parameters: {
    type: Type.OBJECT,
    properties: {
      city: {
        type: Type.STRING,
        description: "Name of the city example Bengaluru, Hyderabad",
      },
    },
    required: ["city"],
  },
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
