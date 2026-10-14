export type BlockFile = { target: string; raw: string; html: string };

export type FileTree = { name: string; path?: string; children?: FileTree[] };

/** A block's files highlighted for the Code view, keyed by where they go in an app. */
export type BlockFiles = { files: BlockFile[]; tree: FileTree[] };
