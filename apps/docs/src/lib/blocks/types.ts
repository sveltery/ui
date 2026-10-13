import type { Block } from '$blocks/registry';

export type BlockFile = { target: string; raw: string; html: string };

export type FileTree = { name: string; path?: string; children?: FileTree[] };

/** A block with its files highlighted for the Code view, keyed by where they go in an app. */
export type BlockSource = Block & { files: BlockFile[]; tree: FileTree[] };
