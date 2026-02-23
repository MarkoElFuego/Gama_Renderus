<script lang="ts">
  import { currentView, currentFacade, canGoBack, goBack } from '../../lib/stores/showroom';
  import type { Apartment } from '../../lib/types';

  let { project, apartment }: {
    project: any;
    apartment: Apartment | null;
  } = $props();

  const VIEW_LABELS: Record<string, string> = {
    building: 'EKSTERIER',
    facade_highlight: 'FASADA',
    floor_plan: 'OSNOVA',
    panorama: '360\u00B0 TURA',
  };
</script>

<div class="hud">
  <!-- Corner brackets -->
  <div class="hud-corner hud-corner--tl"></div>
  <div class="hud-corner hud-corner--tr"></div>
  <div class="hud-corner hud-corner--bl"></div>
  <div class="hud-corner hud-corner--br"></div>

  <!-- Top-left: project name + state -->
  <div class="hud-info hud-info--tl">
    <span class="hud-project">{project.name}</span>
    <span class="hud-state">{VIEW_LABELS[$currentView] || ''}</span>
  </div>

  <!-- Top-right: apartment info when selected -->
  {#if apartment}
    <div class="hud-info hud-info--tr">
      <span class="hud-apt-code">{apartment.code}</span>
      <span class="hud-apt-detail">{apartment.typeLabel} &bull; {apartment.areaM2}m&sup2;</span>
      <span class="hud-apt-price">&euro;{apartment.priceEur.toLocaleString('de-DE')}</span>
    </div>
  {/if}

  <!-- Bottom-left: back button -->
  {#if $canGoBack}
    <button class="hud-back" onclick={() => goBack()}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      NAZAD
    </button>
  {/if}

  <!-- Scanline effect -->
  <div class="hud-scanline"></div>
</div>

<style>
  .hud {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: var(--z-above);
  }

  /* Corner brackets */
  .hud-corner {
    position: absolute;
    width: 32px;
    height: 32px;
    border-color: rgba(197, 164, 108, 0.25);
    border-style: solid;
    border-width: 0;
  }

  .hud-corner--tl {
    top: var(--space-6);
    left: var(--space-6);
    border-top-width: 1px;
    border-left-width: 1px;
  }

  .hud-corner--tr {
    top: var(--space-6);
    right: var(--space-6);
    border-top-width: 1px;
    border-right-width: 1px;
  }

  .hud-corner--bl {
    bottom: var(--space-6);
    left: var(--space-6);
    border-bottom-width: 1px;
    border-left-width: 1px;
  }

  .hud-corner--br {
    bottom: var(--space-6);
    right: var(--space-6);
    border-bottom-width: 1px;
    border-right-width: 1px;
  }

  /* Info panels */
  .hud-info {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .hud-info--tl {
    top: calc(var(--space-6) + 8px);
    left: calc(var(--space-6) + 12px);
  }

  .hud-info--tr {
    top: calc(var(--space-6) + 8px);
    right: calc(var(--space-6) + 12px);
    text-align: right;
  }

  .hud-project {
    font-family: var(--serif);
    font-size: 14px;
    font-weight: 400;
    color: var(--gold);
    letter-spacing: 4px;
    text-transform: uppercase;
  }

  .hud-state {
    font-family: var(--sans);
    font-size: 9px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--text-dim);
  }

  .hud-apt-code {
    font-family: var(--serif);
    font-size: 24px;
    font-weight: 300;
    color: var(--gold);
    letter-spacing: 2px;
  }

  .hud-apt-detail {
    font-family: var(--sans);
    font-size: 11px;
    color: var(--text-mid);
    letter-spacing: 1px;
  }

  .hud-apt-price {
    font-family: var(--sans);
    font-size: 12px;
    color: var(--gold-light);
    letter-spacing: 1px;
    margin-top: 2px;
  }

  /* Back button */
  .hud-back {
    position: absolute;
    bottom: calc(var(--space-6) + 8px);
    left: calc(var(--space-6) + 12px);
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--sans);
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-dim);
    background: rgba(12, 11, 10, 0.5);
    border: 1px solid rgba(197, 164, 108, 0.15);
    padding: 8px 16px;
    cursor: pointer;
    pointer-events: auto;
    transition: all var(--transition);
    backdrop-filter: blur(8px);
  }

  .hud-back:hover {
    color: var(--gold);
    border-color: rgba(197, 164, 108, 0.4);
    box-shadow: 0 0 8px rgba(197, 164, 108, 0.15);
  }

  /* Scanline effect */
  .hud-scanline {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(197, 164, 108, 0.015) 2px,
      rgba(197, 164, 108, 0.015) 4px
    );
    pointer-events: none;
  }

  @media (max-width: 768px) {
    .hud-corner {
      width: 20px;
      height: 20px;
    }

    .hud-corner--tl, .hud-info--tl {
      top: var(--space-4);
      left: var(--space-4);
    }

    .hud-corner--tr, .hud-info--tr {
      top: var(--space-4);
      right: var(--space-4);
    }

    .hud-info--tl {
      left: calc(var(--space-4) + 8px);
    }

    .hud-info--tr {
      right: calc(var(--space-4) + 8px);
    }

    .hud-project {
      font-size: 11px;
      letter-spacing: 3px;
    }

    .hud-apt-code {
      font-size: 18px;
    }
  }
</style>
