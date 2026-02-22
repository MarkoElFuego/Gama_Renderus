<script lang="ts">
  import { lastAssistantMessage } from '../../lib/stores/conversation';

  let displayedText = $state('');
  let isTyping = $state(false);

  // Typing animation effect
  $effect(() => {
    const msg = $lastAssistantMessage;
    if (!msg) {
      displayedText = '';
      return;
    }

    const fullText = msg.content;
    if (fullText === displayedText) return;

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
    }, 20);

    return () => clearInterval(interval);
  });
</script>

<div class="response-bar" class:has-content={displayedText.length > 0}>
  {#if displayedText}
    <span class="response-prefix">AI:</span>
    <span class="response-text">{displayedText}</span>
    {#if isTyping}
      <span class="cursor">|</span>
    {/if}
  {/if}
</div>

<style>
  .response-bar {
    min-height: 0;
    max-height: 0;
    overflow: hidden;
    padding: 0 var(--space-6);
    background: rgba(12, 11, 10, 0.9);
    border-top: 1px solid transparent;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .response-bar.has-content {
    min-height: 40px;
    max-height: 80px;
    padding: var(--space-3) var(--space-6);
    border-top-color: rgba(197, 164, 108, 0.08);
  }

  .response-prefix {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--gold);
    flex-shrink: 0;
  }

  .response-text {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 300;
    color: var(--text-mid);
    letter-spacing: 0.3px;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
    .response-bar.has-content {
      padding: var(--space-2) var(--space-4);
    }

    .response-text {
      font-size: 12px;
    }
  }
</style>
