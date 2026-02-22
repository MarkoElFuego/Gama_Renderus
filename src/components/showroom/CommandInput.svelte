<script lang="ts">
  import type { Building } from '../../lib/types';
  import { showroom, rotateNext, rotatePrev } from '../../lib/stores/showroom';
  import { addMessage } from '../../lib/stores/conversation';
  import { sendMessage } from '../../lib/agent/client';
  import { executeIntent } from '../../lib/agent/handler';
  import { get } from 'svelte/store';

  let { buildings, project }: {
    buildings: Building[];
    project: any;
  } = $props();

  let inputValue = $state('');
  let isLoading = $state(false);
  let inputEl: HTMLInputElement;

  // Flatten apartments for context
  const allApartments = buildings.flatMap(b =>
    b.floors.flatMap(f =>
      f.apartments.map(a => ({
        code: a.code,
        type: a.type,
        typeLabel: a.typeLabel,
        areaM2: a.areaM2,
        priceEur: a.priceEur,
        status: a.status,
        orientation: a.orientation,
        floorId: a.floorId,
        rooms: a.rooms,
      }))
    )
  );

  // Get API key from env or localStorage
  function getApiKey(): string {
    // Try environment variable first
    const envKey = (import.meta as any).env?.PUBLIC_ANTHROPIC_API_KEY;
    if (envKey) return envKey;

    // Try localStorage
    const stored = localStorage.getItem('gamma_anthropic_key');
    if (stored) return stored;

    // Prompt user
    const key = prompt('Unesite Anthropic API kljuc:');
    if (key) {
      localStorage.setItem('gamma_anthropic_key', key);
      return key;
    }

    return '';
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const message = inputValue.trim();
    if (!message || isLoading) return;

    inputValue = '';
    isLoading = true;

    addMessage('user', message);

    try {
      const apiKey = getApiKey();
      if (!apiKey) {
        addMessage('assistant', 'API kljuc nije konfigurisan. Osvezite stranicu i unesite kljuc.');
        return;
      }

      const state = get(showroom);
      const result = await sendMessage(
        message,
        state,
        { projectName: project.name, apartments: allApartments },
        apiKey
      );

      addMessage('assistant', result.responseText);
      executeIntent(result.intent, buildings);
    } catch (err) {
      addMessage('assistant', 'Greska u komunikaciji. Pokusajte ponovo.');
    } finally {
      isLoading = false;
      inputEl?.focus();
    }
  }

  // Focus input on keyboard shortcut
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === '/' && document.activeElement !== inputEl) {
      e.preventDefault();
      inputEl?.focus();
    }
    if (e.key === 'Escape') {
      inputEl?.blur();
    }
    if (e.key === 'ArrowLeft' && document.activeElement !== inputEl) {
      rotatePrev();
    }
    if (e.key === 'ArrowRight' && document.activeElement !== inputEl) {
      rotateNext();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<form class="command-input" onsubmit={handleSubmit}>
  <span class="prompt-symbol">&gt;</span>
  <input
    bind:this={inputEl}
    bind:value={inputValue}
    type="text"
    placeholder="Pitajte me o stanovima..."
    disabled={isLoading}
    autocomplete="off"
    spellcheck="false"
  />
  {#if isLoading}
    <div class="loading">
      <span class="loading-dot"></span>
      <span class="loading-dot"></span>
      <span class="loading-dot"></span>
    </div>
  {/if}
</form>

<style>
  .command-input {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-4) var(--space-6);
    background: rgba(12, 11, 10, 0.95);
    border-top: 1px solid rgba(197, 164, 108, 0.1);
    backdrop-filter: blur(20px);
  }

  .prompt-symbol {
    font-family: var(--sans);
    font-size: 16px;
    font-weight: 400;
    color: var(--gold);
    user-select: none;
    flex-shrink: 0;
  }

  input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--text);
    font-family: var(--sans);
    font-size: 14px;
    font-weight: 300;
    letter-spacing: 0.5px;
    caret-color: var(--gold);
  }

  input::placeholder {
    color: var(--text-dim);
    opacity: 0.5;
  }

  input:disabled {
    opacity: 0.5;
  }

  /* Loading animation */
  .loading {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .loading-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--gold);
    animation: blink 1.4s infinite;
  }

  .loading-dot:nth-child(2) {
    animation-delay: 0.2s;
  }

  .loading-dot:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes blink {
    0%, 80%, 100% { opacity: 0.2; }
    40% { opacity: 1; }
  }

  @media (max-width: 768px) {
    .command-input {
      padding: var(--space-3) var(--space-4);
    }

    input {
      font-size: 16px; /* prevents iOS zoom on focus */
    }
  }
</style>
