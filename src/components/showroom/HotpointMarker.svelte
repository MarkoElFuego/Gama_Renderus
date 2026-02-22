<script lang="ts">
  import type { PanoramaHotpoint } from '../../lib/types';

  let { hotpoint, onclick }: {
    hotpoint: PanoramaHotpoint;
    onclick?: () => void;
  } = $props();

  let expanded = $state(false);
</script>

<button
  class="hotpoint"
  class:info={hotpoint.type === 'info'}
  class:navigate={hotpoint.type === 'navigate'}
  onclick={() => {
    if (hotpoint.type === 'info') {
      expanded = !expanded;
    }
    onclick?.();
  }}
  aria-label={hotpoint.label}
>
  <span class="hotpoint-ring"></span>
  <span class="hotpoint-dot"></span>

  {#if expanded && hotpoint.content}
    <div class="hotpoint-tooltip">
      <span class="tooltip-label">{hotpoint.label}</span>
      <span class="tooltip-content">{hotpoint.content}</span>
    </div>
  {:else}
    <span class="hotpoint-label">{hotpoint.label}</span>
  {/if}
</button>

<style>
  .hotpoint {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }

  .hotpoint-ring {
    position: absolute;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid var(--gold);
    opacity: 0.4;
    animation: hotpoint-pulse 2.5s infinite;
  }

  .hotpoint-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--gold);
    box-shadow: 0 0 8px rgba(197, 164, 108, 0.6);
  }

  .hotpoint.navigate .hotpoint-dot {
    background: var(--gold-light);
  }

  .hotpoint-label {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 8px;
    font-family: var(--sans);
    font-size: 9px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-dim);
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity var(--transition);
  }

  .hotpoint:hover .hotpoint-label {
    opacity: 1;
  }

  .hotpoint-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 12px;
    background: rgba(22, 21, 20, 0.95);
    border: 1px solid rgba(197, 164, 108, 0.2);
    padding: 10px 14px;
    min-width: 140px;
    backdrop-filter: blur(12px);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .tooltip-label {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--gold);
  }

  .tooltip-content {
    font-family: var(--sans);
    font-size: 11px;
    color: var(--text-mid);
    line-height: 1.4;
  }

  @keyframes hotpoint-pulse {
    0% { transform: scale(0.8); opacity: 0.4; }
    50% { transform: scale(1.3); opacity: 0.1; }
    100% { transform: scale(0.8); opacity: 0.4; }
  }
</style>
