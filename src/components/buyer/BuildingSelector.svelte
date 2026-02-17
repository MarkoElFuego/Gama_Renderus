<script lang="ts">
  import type { Floor, Apartment, ApartmentStatus } from '../../lib/types';
  import { selection, selectFloor, selectApartment } from '../../lib/stores/selection';

  export let floors: Floor[] = [];

  let activeFloorId: string = '';

  // Subscribe to selection store
  selection.subscribe(s => {
    activeFloorId = s.floorId || '';
  });

  // Initialize with the first available floor
  $: if (floors.length > 0 && !activeFloorId) {
    // Find first floor with available apartments, or use first floor
    const firstAvailable = floors.find(f =>
      f.apartments.some(a => a.status === 'available')
    );
    if (firstAvailable) {
      selectFloor(firstAvailable.id);
    }
  }

  $: activeFloor = floors.find(f => f.id === activeFloorId);
  $: activeApartments = activeFloor?.apartments || [];

  function getAvailableCount(floor: Floor): number {
    return floor.apartments.filter(a => a.status === 'available').length;
  }

  function formatPrice(price: number): string {
    return new Intl.NumberFormat('de-DE').format(price);
  }

  function handleFloorClick(floorId: string) {
    selectFloor(floorId);
  }

  function handleApartmentClick(apt: Apartment) {
    if (apt.status === 'sold') return;
    selectApartment(apt.id);
    // Smooth scroll to style section
    document.getElementById('enterijeri')?.scrollIntoView({ behavior: 'smooth' });
  }

  function getStatusLabel(status: ApartmentStatus): string {
    const labels: Record<ApartmentStatus, string> = {
      available: 'Slobodan',
      reserved: 'Rezervisan',
      sold: 'Prodat',
    };
    return labels[status];
  }
</script>

<section class="section reveal" id="stanovi">
  <div class="section-header">
    <div>
      <div class="label">Korak 1</div>
      <div class="heading-lg">Izaberite <em>stan</em></div>
    </div>
    <div class="section-desc">
      Odaberite sprat i stan koji vas zanima. Zeleno označeni stanovi su slobodni.
    </div>
  </div>

  <div class="building-view">
    <!-- Floors panel -->
    <div class="floors-panel">
      <div class="floor-label">Spratovi</div>
      {#each floors as floor (floor.id)}
        <button
          class="floor-item"
          class:active={activeFloorId === floor.id}
          on:click={() => handleFloorClick(floor.id)}
        >
          <div class="floor-name">
            {floor.name}
            {#if floor.label}
              <small>{floor.label}</small>
            {/if}
          </div>
          <div class="floor-count">
            <span class="available">{getAvailableCount(floor)}</span> / {floor.apartments.length}
          </div>
        </button>
      {/each}
    </div>

    <!-- Apartments panel -->
    <div class="apartments-panel">
      {#each activeApartments as apt (apt.id)}
        <button
          class="apt-card"
          class:sold={apt.status === 'sold'}
          class:reserved={apt.status === 'reserved'}
          class:selected={$selection.apartmentId === apt.id}
          on:click={() => handleApartmentClick(apt)}
          disabled={apt.status === 'sold'}
        >
          <div class="apt-id">{apt.code}</div>
          <div class="apt-type">{apt.typeLabel}</div>
          <div class="apt-size">{apt.areaM2} m²</div>
          <div class="apt-price">€ {formatPrice(apt.priceEur)}</div>
          <div class="apt-status {apt.status}">{getStatusLabel(apt.status)}</div>
        </button>
      {/each}
    </div>
  </div>
</section>

<style>
  .section {
    padding: var(--space-30) var(--page-padding);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: var(--space-16);
  }

  .section-desc {
    font-size: 14px;
    color: var(--text-dim);
    max-width: 400px;
    line-height: 1.7;
  }

  /* Building grid */
  .building-view {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2px;
    background: var(--border);
    border: 1px solid var(--border);
  }

  /* Floors */
  .floors-panel {
    background: var(--bg-card);
    padding: var(--space-8);
  }

  .floor-label {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: var(--space-6);
  }

  .floor-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 14px 16px;
    cursor: pointer;
    transition: all var(--transition);
    border: none;
    border-bottom: 1px solid var(--border);
    border-left: 2px solid transparent;
    background: transparent;
    color: var(--text);
    text-align: left;
  }

  .floor-item:hover {
    background: var(--bg-hover);
  }

  .floor-item.active {
    background: var(--gold-dim);
    border-left-color: var(--gold);
  }

  .floor-name {
    font-family: var(--serif);
    font-size: 18px;
    font-weight: 400;
  }

  .floor-name small {
    font-family: var(--sans);
    font-size: 11px;
    color: var(--text-dim);
    font-weight: 300;
    margin-left: 8px;
  }

  .floor-count {
    font-size: 11px;
    color: var(--text-dim);
  }

  .floor-count .available {
    color: var(--gold);
  }

  /* Apartments */
  .apartments-panel {
    background: var(--bg-card);
    padding: var(--space-8);
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 2px;
    align-content: start;
  }

  .apt-card {
    background: var(--bg);
    padding: var(--space-6);
    cursor: pointer;
    transition: all 0.4s;
    position: relative;
    overflow: hidden;
    text-align: left;
    color: var(--text);
    border: none;
  }

  .apt-card::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--gold);
    transform: scaleX(0);
    transition: transform 0.4s;
  }

  .apt-card:hover:not(.sold)::after {
    transform: scaleX(1);
  }

  .apt-card:hover:not(.sold) {
    background: var(--bg-hover);
  }

  .apt-card.sold {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .apt-card.reserved {
    opacity: 0.6;
  }

  .apt-card.selected {
    background: var(--gold-dim);
  }

  .apt-card.selected::after {
    transform: scaleX(1);
  }

  .apt-id {
    font-family: var(--serif);
    font-size: 24px;
    font-weight: 400;
    margin-bottom: 12px;
  }

  .apt-type {
    font-size: 11px;
    letter-spacing: 1px;
    color: var(--text-dim);
    margin-bottom: 4px;
  }

  .apt-size {
    font-size: 13px;
    color: var(--text-mid);
  }

  .apt-price {
    font-family: var(--serif);
    font-size: 18px;
    color: var(--gold);
    margin-top: 12px;
  }

  .apt-status {
    margin-top: 16px;
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 4px 8px;
    display: inline-block;
  }

  .apt-status.available {
    color: var(--gold);
    border: 1px solid var(--gold);
  }

  .apt-status.reserved {
    color: var(--status-reserved);
    border: 1px solid var(--status-reserved);
  }

  .apt-status.sold {
    color: var(--text-dim);
    border: 1px solid var(--text-dim);
  }

  @media (max-width: 768px) {
    .section {
      padding: var(--space-20) var(--page-padding);
    }

    .section-header {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-4);
    }

    .building-view {
      grid-template-columns: 1fr;
    }
  }
</style>
