import type { UIDataTypes, UIMessage } from 'ai';

export type ChatMessage = UIMessage<
  unknown,
  UIDataTypes,
  {
    runCommand: {
      input: { command: string };
      output: { stdout: string };
    };
  }
>;

export type Part = ChatMessage['parts'][number];
