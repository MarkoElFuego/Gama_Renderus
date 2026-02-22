<script lang="ts">
  import { currentFacade, showroom, enterApartment } from '../../lib/stores/showroom';
  import { getFacadeForApartment } from '../../lib/utils/facade-mapping';
  import type { Apartment, FacadeId } from '../../lib/types';

  let { apartments, selectedApartment }: {
    apartments: Apartment[];
    selectedApartment: Apartment | null;
  } = $props();

  let svgContent = $state('');
  let svgContainer: HTMLElement;

  // Get apartments visible on current facade
  const facadeApartments = $derived(
    apartments.filter(a => getFacadeForApartment(a.orientation) === $currentFacade)
  );

  // Load SVG overlay when facade changes
  $effect(() => {
    const facade = $currentFacade;
    fetch(`/assets/overlays/belveder/facade-${facade.toLowerCase()}.svg`)
      .then(r => r.text())
      .then(text => {
        svgContent = text;
      });
  });

  // After SVG content is rendered, attach click handlers to zones
  $effect(() => {
    if (!svgContainer || !svgContent) return;

    const zones = svgContainer.querySelectorAll('.apartment-zone');
    zones.forEach(zone => {
      const el = zone as SVGElement;
      // Highlight selected apartment
      const aptId = el.getAttribute('data-apartment-id');
      if (selectedApartment && aptId) {
        el.style.fill = 'transparent';
        el.style.strokeOpacity = '0.3';
      }

      el.style.cursor = 'pointer';
      el.style.transition = 'all 0.3s ease';

      el.addEventListener('mouseenter', () => {
        el.style.fill = 'rgba(197, 164, 108, 0.1)';
        el.style.strokeOpacity = '0.6';
      });

      el.addEventListener('mouseleave', () => {
        el.style.fill = 'transparent';
        el.style.strokeOpacity = '0.3';
      });
    });

    // Highlight selected apartment zone
    if (selectedApartment) {
      const selectedZone = svgContainer.querySelector(`[data-apartment-id]`);
      // For now, highlight all zones since mapping isn't 1:1 yet
      // Real mapping will connect apartment IDs to SVG zone IDs
    }
  });

  function handleEnter() {
    if (selectedApartment) {
      enterApartment();
    }
  }
</script>

<div class="facade-overlay">
  <!-- Base facade image -->
  <img
    class="facade-bg"
    src="/assets/buildings/belveder/facade-{$currentFacade.toLowerCase()}.svg"
    alt="Fasada {$currentFacade}"
    draggable="false"
  />

  <!-- SVG overlay with apartment zones -->
  <div class="svg-layer" bind:this={svgContainer}>
    {@html svgContent}
  </div>

  <!-- Selected apartment highlight pulse -->
  {#if selectedApartment}
    <div class="selected-indicator">
      <div class="pulse-ring"></div>
    </div>
  {/if}

  <!-- Enter apartment button -->
  {#if selectedApartment}
    <button class="enter-btn" onclick={handleEnter}>
      <span class="enter-label">UDI U STAN</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  {/if}
</div>

<style>
  .facade-overlay {
    position: absolute;
    inset: 0;
    background: var(--bg);
  }

  .facade-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .svg-layer {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .svg-layer :global(svg) {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .selected-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .pulse-ring {
    width: 80px;
    height: 80px;
    border: 1px solid var(--gold);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.8);
      opacity: 0.8;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.3;
    }
    100% {
      transform: scale(0.8);
      opacity: 0.8;
    }
  }

  .enter-btn {
    position: absolute;
    bottom: var(--space-12);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: 12px 28px;
    background: rgba(12, 11, 10, 0.7);
    border: 1px solid var(--gold);
    color: var(--gold);
    font-family: var(--sans);
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    cursor: pointer;
    backdrop-filter: blur(12px);
    transition: all var(--transition);
  }

  .enter-btn:hover {
    background: rgba(197, 164, 108, 0.15);
    box-shadow: 0 0 20px rgba(197, 164, 108, 0.2);
  }

  @media (max-width: 768px) {
    .enter-btn {
      bottom: var(--space-8);
      padding: 10px 20px;
      font-size: 10px;
    }
  }
</style>
