<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import type { RoomType } from '../../lib/types';

  let { apartmentType, room }: {
    apartmentType: string | undefined;
    room: RoomType | null;
  } = $props();

  let container: HTMLElement;
  let viewer: any = null;
  let viewerLoaded = $state(false);
  let error = $state('');

  const ROOM_LABELS: Record<string, string> = {
    living: 'Dnevni boravak',
    bedroom: 'Spavaca soba',
    kitchen: 'Kuhinja',
    bathroom: 'Kupatilo',
  };

  // Build panorama image URL
  const panoramaUrl = $derived(
    apartmentType && room
      ? `/assets/panoramas/belveder/${apartmentType}-${room}.svg`
      : null
  );

  // Try loading Photo Sphere Viewer, fall back to static image
  async function initViewer() {
    if (!container || !panoramaUrl) return;

    try {
      const { Viewer } = await import('@photo-sphere-viewer/core');
      // @ts-ignore - CSS import for photo-sphere-viewer
      await import('@photo-sphere-viewer/core/index.css');

      viewer = new Viewer({
        container,
        panorama: panoramaUrl,
        defaultPitch: 0,
        defaultYaw: 0,
        defaultZoomLvl: 50,
        navbar: false,
        touchmoveTwoFingers: false,
        mousewheelCtrlKey: false,
      });

      viewerLoaded = true;
    } catch {
      // Photo Sphere Viewer not installed — show static fallback
      viewerLoaded = false;
    }
  }

  $effect(() => {
    if (panoramaUrl && container) {
      // Clean up previous viewer
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
  {#if panoramaUrl}
    <!-- Room label -->
    <div class="room-label">
      <span class="room-label-prefix">360&deg;</span>
      <span class="room-label-name">{ROOM_LABELS[room || ''] || room}</span>
    </div>

    <!-- Panorama container — Photo Sphere Viewer or static fallback -->
    <div class="panorama-container" bind:this={container}>
      {#if !viewerLoaded}
        <!-- Static image fallback -->
        <img
          class="panorama-static"
          src={panoramaUrl}
          alt="{ROOM_LABELS[room || ''] || room} — 360 panorama"
          draggable="false"
        />
        <div class="panorama-overlay">
          <span class="panorama-hint">360&deg; panorama</span>
        </div>
      {/if}
    </div>
  {:else}
    <div class="panorama-empty">
      <span>Panorama nije dostupna</span>
    </div>
  {/if}
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

  .panorama-static {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .panorama-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(12, 11, 10, 0.3);
  }

  .panorama-hint {
    font-family: var(--sans);
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-dim);
    padding: 8px 20px;
    border: 1px solid rgba(197, 164, 108, 0.2);
    background: rgba(12, 11, 10, 0.6);
    backdrop-filter: blur(8px);
  }

  .panorama-empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--sans);
    font-size: 14px;
    color: var(--text-dim);
  }

  /* Photo Sphere Viewer overrides */
  .panorama-container :global(.psv-container) {
    background: var(--bg) !important;
  }

  @media (max-width: 768px) {
    .room-label-name {
      font-size: 16px;
    }
  }
</style>
