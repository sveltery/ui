import { blockSources } from '$lib/blocks/source.server';
import { featured } from '$blocks/registry';

export const load = async () => ({ blocks: await blockSources(featured) });
