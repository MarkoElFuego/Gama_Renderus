<script lang="ts">
  import { showRoom } from '../../lib/stores/showroom';
  import type { Apartment, RoomType } from '../../lib/types';

  let { apartment }: {
    apartment: Apartment | null;
  } = $props();

  let svgContent = $state('');
  let svgContainer: HTMLElement;

  // Map apartment type to floor plan SVG
  const typeToSvg: Record<string, string> = {
    studio: '/assets/floorplans/belveder/studio.svg',
    '1br': '/assets/floorplans/belveder/1br.svg',
    '2br': '/assets/floorplans/belveder/2br.svg',
    '3br': '/assets/floorplans/belveder/3br.svg',
    penthouse: '/assets/floorplans/belveder/penthouse.svg',
  };

  // Load floor plan SVG
  $effect(() => {
    if (!apartment) return;
    const svgUrl = typeToSvg[apartment.type] || typeToSvg['2br'];
    fetch(svgUrl)
      .then(r => r.text())
      .then(text => {
        svgContent = text;
      });
  });

  // Attach click handlers to room zones after SVG renders
  $effect(() => {
    if (!svgContainer || !svgContent) return;

    const rooms = svgContainer.querySelectorAll('[data-room]');
    rooms.forEach(room => {
      const el = room as SVGElement;
      const roomType = el.getAttribute('data-room') as RoomType;

      if (!roomType || roomType === 'hallway') return;

      el.style.cursor = 'pointer';
      el.style.transition = 'all 0.3s ease';

      el.addEventListener('mouseenter', () => {
        const rects = el.querySelectorAll('rect');
        rects.forEach(r => {
          r.style.fill = 'rgba(197, 164, 108, 0.15)';
          r.style.stroke = '#C5A46C';
          r.style.strokeOpacity = '0.6';
        });
      });

      el.addEventListener('mouseleave', () => {
        const rects = el.querySelectorAll('rect');
        rects.forEach(r => {
          r.style.fill = 'rgba(30, 29, 27, 0.6)';
          r.style.stroke = '#C5A46C';
          r.style.strokeOpacity = '0.3';
        });
      });

      el.addEventListener('click', () => {
        showRoom(roomType);
      });
    });
  });
</script>

<div class="floor-plan-view">
  {#if apartment}
    <!-- Floor plan header -->
    <div class="plan-header">
      <span class="plan-label">OSNOVA STANA</span>
      <span class="plan-code">{apartment.code}</span>
      <span class="plan-detail">{apartment.typeLabel} &bull; {apartment.areaM2}m&sup2;</span>
    </div>

    <!-- Interactive SVG floor plan -->
    <div class="plan-container" bind:this={svgContainer}>
      {@html svgContent}
    </div>

    <!-- Room navigation hint -->
    <div class="plan-hint">
      Kliknite na prostoriju za 360&deg; turu
    </div>
  {:else}
    <div class="plan-empty">
      <span>Nije odabran stan</span>
    </div>
  {/if}
</div>

<style>
  .floor-plan-view {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    padding: var(--space-8);
  }

  .plan-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    margin-bottom: var(--space-6);
  }

  .plan-label {
    font-family: var(--sans);
    font-size: 9px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--text-dim);
  }

  .plan-code {
    font-family: var(--serif);
    font-size: 28px;
    font-weight: 300;
    color: var(--gold);
    letter-spacing: 4px;
  }

  .plan-detail {
    font-family: var(--sans);
    font-size: 12px;
    color: var(--text-mid);
    letter-spacing: 1px;
  }

  .plan-container {
    flex: 1;
    max-width: 700px;
    max-height: 60vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .plan-container :global(svg) {
    width: 100%;
    height: 100%;
    max-height: 60vh;
  }

  .plan-hint {
    font-family: var(--sans);
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-top: var(--space-6);
    opacity: 0.6;
  }

  .plan-empty {
    font-family: var(--sans);
    font-size: 14px;
    color: var(--text-dim);
  }

  @media (max-width: 768px) {
    .floor-plan-view {
      padding: var(--space-4);
    }

    .plan-code {
      font-size: 22px;
    }

    .plan-container {
      max-height: 50vh;
    }
  }
</style>
