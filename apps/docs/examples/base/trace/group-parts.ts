import type { UIMessage } from 'ai';

type Part = UIMessage['parts'][number];

// Splits a message into runs of trace parts and runs of text, in order, and drops every other part.
export function groupParts(parts: Part[], isTrace: (part: Part) => boolean) {
  const runs: { trace: boolean; parts: Part[] }[] = [];

  for (const part of parts) {
    const trace = isTrace(part);

    if (!trace && part.type !== 'text') {
      continue;
    }

    const last = runs.at(-1);

    if (last?.trace === trace) {
      last.parts.push(part);
    } else {
      runs.push({ trace, parts: [part] });
    }
  }

  return runs;
}
