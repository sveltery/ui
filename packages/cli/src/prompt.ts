import { confirm, isCancel, select, text } from '@clack/prompts';
import { CliError } from './parse.js';

/** A prompt with no terminal behind stdin never settles, and Node exits 13 on the unsettled top-level await. */
function assertTerminal() {
  if (!process.stdin.isTTY) throw new CliError('No terminal to confirm in. Re-run with --yes.');
}

export async function ask(message: string, initialValue: boolean): Promise<boolean> {
  assertTerminal();
  const answer = await confirm({ message, initialValue });
  if (isCancel(answer)) throw new CliError('Cancelled.');
  return answer;
}

export async function choose<T extends string>(message: string, options: { value: T; label: string; hint?: string }[], initialValue: T): Promise<T> {
  assertTerminal();
  const answer = await select<T>({ message, options: options as Parameters<typeof select<T>>[0]['options'], initialValue });
  if (isCancel(answer)) throw new CliError('Cancelled.');
  return answer;
}

export async function input(message: string, initialValue: string, validate: (value: string) => string | undefined): Promise<string> {
  assertTerminal();
  const answer = await text({ message, initialValue, validate: (value) => validate((value ?? '').trim()) });
  if (isCancel(answer)) throw new CliError('Cancelled.');
  return answer.trim();
}
