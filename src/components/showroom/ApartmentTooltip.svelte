<script lang="ts">
  import type { Apartment } from '../../lib/types';

  let { apartment, x, y }: {
    apartment: Apartment;
    x: number;
    y: number;
  } = $props();

  const statusLabels: Record<string, string> = {
    available: 'Slobodan',
    reserved: 'Rezervisan',
    sold: 'Prodat',
  };
</script>

<div
  class="tooltip"
  style="left: {x}px; top: {y}px;"
>
  <div class="tooltip-header">
    <span class="tooltip-code">{apartment.code}</span>
    <span class="tooltip-status" class:available={apartment.status === 'available'} class:reserved={apartment.status === 'reserved'} class:sold={apartment.status === 'sold'}>
      {statusLabels[apartment.status]}
    </span>
  </div>
  <div class="tooltip-body">
    <span class="tooltip-type">{apartment.typeLabel}</span>
    <span class="tooltip-area">{apartment.areaM2}m&sup2;</span>
  </div>
  <div class="tooltip-price">
    &euro;{apartment.priceEur.toLocaleString('de-DE')}
  </div>
</div>

<style>
  .tooltip {
    position: absolute;
    z-index: var(--z-overlay);
    background: rgba(22, 21, 20, 0.95);
    border: 1px solid rgba(197, 164, 108, 0.25);
    padding: 12px 16px;
    min-width: 160px;
    backdrop-filter: blur(12px);
    pointer-events: none;
    transform: translate(-50%, -100%) translateY(-12px);
  }

  .tooltip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .tooltip-code {
    font-family: var(--serif);
    font-size: 18px;
    font-weight: 400;
    color: var(--gold);
    letter-spacing: 2px;
  }

  .tooltip-status {
    font-family: var(--sans);
    font-size: 9px;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 2px 8px;
    border: 1px solid;
  }

  .tooltip-status.available {
    color: var(--gold);
    border-color: rgba(197, 164, 108, 0.3);
  }

  .tooltip-status.reserved {
    color: var(--status-reserved);
    border-color: rgba(196, 122, 58, 0.3);
  }

  .tooltip-status.sold {
    color: var(--text-dim);
    border-color: rgba(138, 133, 126, 0.2);
  }

  .tooltip-body {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .tooltip-type {
    font-size: 11px;
    color: var(--text-mid);
  }

  .tooltip-area {
    font-size: 11px;
    color: var(--text-mid);
  }

  .tooltip-price {
    font-family: var(--sans);
    font-size: 13px;
    color: var(--gold-light);
    letter-spacing: 0.5px;
  }
</style>
