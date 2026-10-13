// Scripted chat for the Message Scroller examples. It stands in for a chat SDK: a user message is sent, the reply
// waits for `sleep`, then streams in word by word.
export type ChatMessage = { id: string; role: 'user' | 'assistant'; text: string };
export type ChatStatus = 'ready' | 'submitted' | 'streaming';
type Turn = ChatMessage & { delay: number };

export function createChat() {
  const turns: Turn[] = [];
  let delay = 0;
  const script = {
    user(text: string, { id = `user-${turns.length}` } = {}) {
      turns.push({ id, role: 'user', text, delay: 0 });
      return script;
    },
    sleep(ms: number) {
      delay = ms;
      return script;
    },
    assistant(text: string) {
      turns.push({ id: `assistant-${turns.length}`, role: 'assistant', text, delay });
      delay = 0;
      return script;
    },
    at: (index: number): Turn | undefined => turns[index],
    get: (count = turns.length): ChatMessage[] => turns.slice(0, count).map(({ id, role, text }) => ({ id, role, text })),
  };
  return script;
}

export class Chat {
  messages = $state<ChatMessage[]>([]);
  status = $state<ChatStatus>('ready');
  #script: ReturnType<typeof createChat>;
  #initial: number;
  #delayMs: number;
  #timer: ReturnType<typeof setTimeout> | undefined;

  constructor(script: ReturnType<typeof createChat>, { initial = 0, delayMs = 20 } = {}) {
    this.#script = script;
    this.#initial = initial;
    this.#delayMs = delayMs;
    this.messages = script.get(initial);
  }

  get busy() {
    return this.status !== 'ready';
  }

  /** The user message that `send` appends next. */
  get next() {
    const turn = this.#script.at(this.messages.length);
    return turn?.role === 'user' ? turn : undefined;
  }

  send() {
    const user = this.next;
    if (!user || this.busy) return;
    this.messages.push({ id: user.id, role: user.role, text: user.text });
    const reply = this.#script.at(this.messages.length);
    if (reply?.role !== 'assistant') return;
    this.status = 'submitted';
    this.#timer = setTimeout(() => this.#stream(reply), reply.delay);
  }

  reset() {
    this.stop();
    this.messages = this.#script.get(this.#initial);
  }

  stop() {
    clearTimeout(this.#timer);
    this.status = 'ready';
  }

  #stream(reply: Turn) {
    this.messages.push({ id: reply.id, role: reply.role, text: '' });
    this.status = 'streaming';
    const words = reply.text.match(/\S+\s*/g) ?? [];
    let index = 0;
    const tick = () => {
      this.messages.at(-1)!.text += words[index++];
      if (index < words.length) this.#timer = setTimeout(tick, this.#delayMs);
      else this.status = 'ready';
    };
    tick();
  }
}
