import { writable, derived } from 'svelte/store';
import type { AgentMessage } from '../types';

let messageCounter = 0;

export const messages = writable<AgentMessage[]>([]);

export const lastMessage = derived(messages, $m =>
  $m.length > 0 ? $m[$m.length - 1] : null
);

export const lastAssistantMessage = derived(messages, $m => {
  for (let i = $m.length - 1; i >= 0; i--) {
    if ($m[i].role === 'assistant') return $m[i];
  }
  return null;
});

export function addMessage(role: 'user' | 'assistant' | 'system', content: string): AgentMessage {
  const message: AgentMessage = {
    id: `msg-${++messageCounter}`,
    role,
    content,
    timestamp: new Date().toISOString(),
  };

  messages.update(m => [...m, message]);
  return message;
}

export function addWelcomeMessage(projectName: string) {
  addMessage('assistant', `Dobrodosli u ${projectName}. Pitajte me o stanovima, ili recite "rotiraj" da pogledate zgradu.`);
}

export function clearMessages() {
  messages.set([]);
  messageCounter = 0;
}
