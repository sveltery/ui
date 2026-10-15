import { confirm, isCancel } from '@clack/prompts';
import { CliError } from './parse.js';

export async function ask(message: string, initialValue: boolean): Promise<boolean> {
  const answer = await confirm({ message, initialValue });
  if (isCancel(answer)) throw new CliError('Cancelled.');
  return answer;
}
