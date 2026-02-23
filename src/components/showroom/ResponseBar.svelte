<script lang="ts">
  import { lastAssistantMessage } from '../../lib/stores/conversation';

  let displayedText = $state('');
  let isTyping = $state(false);
  let prevMsgId = $state('');

  // Typing animation effect
  $effect(() => {
    const msg = $lastAssistantMessage;
    if (!msg) {
      displayedText = '';
      prevMsgId = '';
      return;
    }

    // Only animate if it's a new message
    if (msg.id === prevMsgId) return;
    prevMsgId = msg.id;

    const fullText = msg.content;
    isTyping = true;
    displayedText = '';
    let i = 0;

    const interval = setInterval(() => {
      if (i < fullText.length) {
        displayedText = fullText.slice(0, i + 1);
        i++;
      } else {
        clearInterval(interval);
        isTyping = false;
      }
    }, 18);

    return () => clearInterval(interval);
  });
</script>

<div class="response-bar">
  <span class="response-prefix">Belveder AI</span>
  <span class="response-divider"></span>
  {#if displayedText}
    <span class="response-text">{displayedText}</span>
    {#if isTyping}
      <span class="cursor">|</span>
    {/if}
  {:else}
    <span class="response-placeholder">Pitajte me nesto...</span>
  {/if}
</div>

<style>
  .response-bar {
    padding: var(--space-3) var(--space-6);
    background: rgba(12, 11, 10, 0.95);
    border-top: 1px solid rgba(197, 164, 108, 0.1);
    display: flex;
    align-items: baseline;
    gap: var(--space-3);
    min-height: 44px;
  }

  .response-prefix {
    font-family: var(--serif);
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--gold);
    flex-shrink: 0;
    white-space: nowrap;
  }

  .response-divider {
    width: 1px;
    height: 14px;
    background: rgba(197, 164, 108, 0.2);
    flex-shrink: 0;
    align-self: center;
  }

  .response-text {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 300;
    color: var(--text);
    letter-spacing: 0.3px;
    line-height: 1.5;
  }

  .response-placeholder {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 300;
    color: var(--text-dim);
    opacity: 0.4;
    letter-spacing: 0.3px;
  }

  .cursor {
    color: var(--gold);
    animation: cursor-blink 0.6s infinite;
    font-weight: 300;
  }

  @keyframes cursor-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  @media (max-width: 768px) {
    .response-bar {
      padding: var(--space-3) var(--space-4);
    }

    .response-prefix {
      font-size: 10px;
      letter-spacing: 1.5px;
    }

    .response-text {
      font-size: 12px;
    }
  }
</style>
