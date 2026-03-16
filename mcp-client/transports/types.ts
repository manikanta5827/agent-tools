export type stdioArgs = {
  transport: string;
  command: string;
  args: string[];
};

export type httpArgs = {
  transport: string;
  url: string;
};

export type mcpServerSchema = stdioArgs | httpArgs;
