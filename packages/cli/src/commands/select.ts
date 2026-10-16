import { isCancel, select } from '@clack/prompts';
import { CliError } from '../parse.js';

export async function choose<T extends string>(message: string, options: { value: T; label: string; hint?: string }[], initialValue: T): Promise<T> {
  const answer = await select<T>({ message, options: options as Parameters<typeof select<T>>[0]['options'], initialValue });
  if (isCancel(answer)) throw new CliError('Cancelled.');
  return answer;
}
