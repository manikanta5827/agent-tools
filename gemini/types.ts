interface OutputPart {
  text?: string;
  functionResponse: {
    name: string;
    response: any;
  };
  functionCall?: {
    id: string;
    name: string;
    args: Record<string, any>;
  };
}

interface GenerationCandidate {
  content: {
    parts: OutputPart[];
  };
}

export interface GeminiResponse {
  candidates: GenerationCandidate[];
}

type TextPart = {
  text: string;
};

type FunctionResponsePart = {
  functionResponse: {
    name: string;
    response: any;
  };
};

type FunctionRequestPart = {
  functionCall?: {
    name: string;
    args: Record<string, any>;
  };
};

type Part = TextPart | FunctionRequestPart | FunctionResponsePart;

export enum Role {
  USER = "user",
  MODEL = "model",
}
export type Message = {
  role: Role.USER | Role.MODEL;
  parts: Part[];
};
