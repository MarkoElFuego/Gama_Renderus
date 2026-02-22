<script lang="ts">
  import { onDestroy } from 'svelte';
  import { showRoom } from '../../lib/stores/showroom';
  import type { RoomType } from '../../lib/types';

  let { apartmentType, room }: {
    apartmentType: string | undefined;
    room: RoomType | null;
  } = $props();

  let container: HTMLElement;
  let viewer: any = null;
  let viewerLoaded = $state(false);

  const ROOM_LABELS: Record<string, string> = {
    living: 'Dnevni boravak',
    bedroom: 'Spavaca soba',
    kitchen: 'Kuhinja',
    bathroom: 'Kupatilo',
  };

  const ROOM_NAV: { room: RoomType; label: string }[] = [
    { room: 'living', label: 'Dnevna' },
    { room: 'kitchen', label: 'Kuhinja' },
    { room: 'bedroom', label: 'Spavaca' },
    { room: 'bathroom', label: 'Kupatilo' },
  ];

  // Build panorama image URL — use JPG for real panoramas, SVG as placeholder
  const panoramaUrl = $derived(
    apartmentType && room
      ? `/assets/panoramas/belveder/${apartmentType}-${room}.jpg`
      : null
  );

  const placeholderUrl = $derived(
    apartmentType && room
      ? `/assets/panoramas/belveder/${apartmentType}-${room}.svg`
      : null
  );

  // Generate a placeholder equirectangular image on canvas for the viewer
  function generatePlaceholderPanorama(label: string): string {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Dark gradient background
    const grad = ctx.createLinearGradient(0, 0, 0, 1024);
    grad.addColorStop(0, '#1A1918');
    grad.addColorStop(0.5, '#0C0B0A');
    grad.addColorStop(1, '#161514');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 2048, 1024);

    // Room walls suggestion
    ctx.strokeStyle = 'rgba(197, 164, 108, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 2048; x += 256) {
      ctx.beginPath();
      ctx.moveTo(x, 200);
      ctx.lineTo(x, 824);
      ctx.stroke();
    }
    // Floor line
    ctx.strokeStyle = 'rgba(197, 164, 108, 0.12)';
    ctx.beginPath();
    ctx.moveTo(0, 700);
    ctx.lineTo(2048, 700);
    ctx.stroke();

    // Room label
    ctx.fillStyle = 'rgba(197, 164, 108, 0.4)';
    ctx.font = '48px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(label.toUpperCase(), 1024, 512);

    ctx.fillStyle = 'rgba(197, 164, 108, 0.2)';
    ctx.font = '20px sans-serif';
    ctx.fillText('360\u00B0 panorama — placeholder', 1024, 570);

    return canvas.toDataURL('image/jpeg', 0.8);
  }

  async function initViewer() {
    if (!container) return;

    try {
      const { Viewer } = await import('@photo-sphere-viewer/core');
      await import('@photo-sphere-viewer/core/index.css');

      // Try real JPG first, fall back to generated canvas panorama
      let imageToUse: string;
      if (panoramaUrl) {
        try {
          const res = await fetch(panoramaUrl, { method: 'HEAD' });
          imageToUse = res.ok ? panoramaUrl : generatePlaceholderPanorama(ROOM_LABELS[room || ''] || '');
        } catch {
          imageToUse = generatePlaceholderPanorama(ROOM_LABELS[room || ''] || '');
        }
      } else {
        imageToUse = generatePlaceholderPanorama(ROOM_LABELS[room || ''] || '');
      }

      viewer = new Viewer({
        container,
        panorama: imageToUse,
        defaultPitch: 0,
        defaultYaw: 0,
        defaultZoomLvl: 50,
        navbar: false,
        touchmoveTwoFingers: false,
        mousewheelCtrlKey: false,
        moveSpeed: 1.5,
      });

      viewerLoaded = true;
    } catch {
      viewerLoaded = false;
    }
  }

  $effect(() => {
    if (room && container) {
      if (viewer) {
        viewer.destroy();
        viewer = null;
      }
      viewerLoaded = false;
      initViewer();
    }
  });

  onDestroy(() => {
    if (viewer) {
      viewer.destroy();
      viewer = null;
    }
  });
</script>

<div class="panorama-view">
  <!-- Room label -->
  <div class="room-label">
    <span class="room-label-prefix">360&deg;</span>
    <span class="room-label-name">{ROOM_LABELS[room || ''] || room}</span>
  </div>

  <!-- Panorama container -->
  <div class="panorama-container" bind:this={container}>
    {#if !viewerLoaded}
      <div class="panorama-loading">
        <div class="loading-spinner"></div>
      </div>
    {/if}
  </div>

  <!-- Room navigation tabs -->
  <div class="room-nav">
    {#each ROOM_NAV as nav}
      <button
        class="room-tab"
        class:active={room === nav.room}
        onclick={() => showRoom(nav.room)}
      >
        {nav.label}
      </button>
    {/each}
  </div>
</div>

<style>
  .panorama-view {
    position: absolute;
    inset: 0;
    background: var(--bg);
    display: flex;
    flex-direction: column;
  }

  .room-label {
    position: absolute;
    top: var(--space-8);
    left: 50%;
    transform: translateX(-50%);
    z-index: var(--z-above);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    pointer-events: none;
  }

  .room-label-prefix {
    font-family: var(--sans);
    font-size: 9px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--text-dim);
  }

  .room-label-name {
    font-family: var(--serif);
    font-size: 20px;
    font-weight: 300;
    color: var(--gold);
    letter-spacing: 2px;
  }

  .panorama-container {
    flex: 1;
    position: relative;
    overflow: hidden;
  }

  .panorama-loading {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
  }

  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 1px solid rgba(197, 164, 108, 0.15);
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Room navigation tabs at bottom of panorama */
  .room-nav {
    position: absolute;
    bottom: var(--space-4);
    left: 50%;
    transform: translateX(-50%);
    z-index: var(--z-above);
    display: flex;
    gap: 2px;
    background: rgba(12, 11, 10, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(197, 164, 108, 0.1);
    padding: 3px;
  }

  .room-tab {
    font-family: var(--sans);
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--text-dim);
    padding: 6px 14px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all var(--transition);
  }

  .room-tab:hover {
    color: var(--text);
  }

  .room-tab.active {
    color: var(--gold);
    background: rgba(197, 164, 108, 0.1);
  }

  /* Photo Sphere Viewer overrides */
  .panorama-container :global(.psv-container) {
    background: var(--bg) !important;
  }

  .panorama-container :global(.psv-loader-container) {
    display: none !important;
  }

  @media (max-width: 768px) {
    .room-label-name {
      font-size: 16px;
    }

    .room-tab {
      font-size: 9px;
      padding: 5px 10px;
    }
  }
</style>
