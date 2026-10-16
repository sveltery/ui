import { dev } from '$app/env';
import { env } from 'cloudflare:workers';
import { respondInit } from './handler';
import type { RequestHandler } from './$types';

type AssetsBinding = { fetch: (url: URL) => Promise<Response> };

// A built site serves /r as prerendered files, which event.fetch would request over HTTP from the Worker's own URL, so it reads them from the assets binding.
export const GET: RequestHandler = ({ url, fetch }) => {
  const assets = env.ASSETS as AssetsBinding | undefined;
  return respondInit(url, (path) => (dev || !assets ? fetch(path) : assets.fetch(new URL(path, url))));
};
