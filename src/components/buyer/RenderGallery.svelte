<script lang="ts">
  import type { InteriorStyle, Apartment, RoomType } from '../../lib/types';
  import { selection, selectRoom } from '../../lib/stores/selection';

  export let styles: InteriorStyle[] = [];
  export let allApartments: Apartment[] = [];

  const rooms: { id: RoomType; label: string }[] = [
    { id: 'living', label: 'Dnevna soba' },
    { id: 'bedroom', label: 'Spavaća soba' },
    { id: 'kitchen', label: 'Kuhinja' },
    { id: 'bathroom', label: 'Kupatilo' },
  ];

  // Room label for display
  const roomLabels: Record<RoomType, string> = {
    living: 'Dnevna soba',
    bedroom: 'Spavaća soba',
    kitchen: 'Kuhinja',
    bathroom: 'Kupatilo',
  };

  $: selectedApt = allApartments.find(a => a.id === $selection.apartmentId);
  $: selectedStyle = styles.find(s => s.id === $selection.styleId);
  $: currentRoomLabel = roomLabels[$selection.currentRoom] || 'Dnevna soba';

  // Gradient backgrounds for room thumbnails
  const thumbBgs = [
    'linear-gradient(135deg, #222019, #151310)',
    'linear-gradient(135deg, #201E1A, #14120F)',
    'linear-gradient(135deg, #1F1D19, #131110)',
    'linear-gradient(135deg, #211F1B, #141210)',
  ];

  function handleRoomClick(room: RoomType) {
    selectRoom(room);
  }
</script>

{#if selectedApt && selectedStyle}
  <section class="gallery-section reveal" id="prostor">
    <div class="section-header">
      <div>
        <div class="label">Korak 3</div>
        <div class="heading-lg">Vaš <em>prostor</em></div>
      </div>
    </div>

    <!-- Apartment + Style info bar -->
    <div class="gallery-info">
      <div class="gallery-apt-info">
        <div class="info-item">
          <div class="info-label">Stan</div>
          <div class="info-value">{selectedApt.code}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Tip</div>
          <div class="info-value">{selectedApt.typeLabel}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Površina</div>
          <div class="info-value">{selectedApt.areaM2} m²</div>
        </div>
        <div class="info-item">
          <div class="info-label">Stil</div>
          <div class="info-value gold">{selectedStyle.name}</div>
        </div>
      </div>
    </div>

    <!-- Main render viewer -->
    <div class="gallery-main">
      <div class="gallery-main-bg"></div>
      <div class="gallery-room-label">{currentRoomLabel}</div>
      <div class="gallery-render-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        Fotorealistični V-Ray render
      </div>
      <div class="gallery-watermark">Forma</div>
    </div>

    <!-- Room thumbnails -->
    <div class="gallery-thumbs">
      {#each rooms as room, i (room.id)}
        <button
          class="thumb"
          class:active={$selection.currentRoom === room.id}
          on:click={() => handleRoomClick(room.id)}
        >
          <div class="thumb-bg" style="background: {thumbBgs[i]}; opacity: 0.8;"></div>
          <div class="thumb-label">{room.label}</div>
        </button>
      {/each}
    </div>
  </section>
{/if}

<style>
  .gallery-section {
    padding: var(--space-30) var(--page-padding);
  }

  .section-header {
    margin-bottom: var(--space-12);
  }

  .gallery-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-12);
    padding-bottom: var(--space-8);
    border-bottom: 1px solid var(--border);
  }

  .gallery-apt-info {
    display: flex;
    gap: var(--space-12);
  }

  .info-label {
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 6px;
  }

  .info-value {
    font-family: var(--serif);
    font-size: 20px;
    font-weight: 400;
  }

  .info-value.gold {
    color: var(--gold);
  }

  /* Main render */
  .gallery-main {
    position: relative;
    aspect-ratio: 16/9;
    background: var(--bg-card);
    margin-bottom: 16px;
    overflow: hidden;
  }

  .gallery-main-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 55% 45%, rgba(220,200,170,0.12) 0%, transparent 50%),
      radial-gradient(ellipse at 30% 70%, rgba(180,160,140,0.06) 0%, transparent 40%),
      radial-gradient(ellipse at 80% 20%, rgba(255,240,220,0.04) 0%, transparent 30%),
      linear-gradient(135deg, #222019 0%, #1A1815 30%, #131210 60%, #0E0D0C 100%);
  }

  .gallery-room-label {
    position: absolute;
    top: 32px;
    left: 32px;
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--gold);
    background: rgba(12, 11, 10, 0.7);
    padding: 8px 16px;
    backdrop-filter: blur(10px);
    z-index: 2;
  }

  .gallery-render-placeholder {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-dim);
    font-size: 13px;
    gap: 12px;
    z-index: 1;
  }

  .gallery-render-placeholder :global(svg) {
    opacity: 0.3;
  }

  .gallery-watermark {
    position: absolute;
    bottom: 24px;
    right: 32px;
    font-family: var(--serif);
    font-size: 14px;
    letter-spacing: 4px;
    color: rgba(197, 164, 108, 0.2);
    text-transform: uppercase;
    z-index: 2;
  }

  /* Thumbnails */
  .gallery-thumbs {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
  }

  .thumb {
    aspect-ratio: 16/9;
    background: var(--bg-card);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
    border: none;
    padding: 0;
    color: var(--text);
  }

  .thumb::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 2px solid transparent;
    transition: border-color 0.3s;
    pointer-events: none;
  }

  .thumb:hover::after,
  .thumb.active::after {
    border-color: var(--gold);
  }

  .thumb-bg {
    position: absolute;
    inset: 0;
  }

  .thumb-label {
    position: absolute;
    bottom: 8px;
    left: 12px;
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-dim);
    z-index: 1;
  }

  .thumb.active .thumb-label {
    color: var(--gold);
  }

  @media (max-width: 768px) {
    .gallery-section {
      padding: var(--space-20) var(--page-padding);
    }

    .gallery-apt-info {
      flex-wrap: wrap;
      gap: var(--space-6);
    }

    .gallery-thumbs {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
