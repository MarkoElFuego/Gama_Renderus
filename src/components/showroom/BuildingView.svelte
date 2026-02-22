<script lang="ts">
  import { currentFacade, isTransitioning, rotateNext, rotatePrev } from '../../lib/stores/showroom';
  import type { FacadeId } from '../../lib/types';

  const FACADES: FacadeId[] = ['A', 'B', 'C', 'D'];

  const FACADE_IMAGES: Record<FacadeId, string> = {
    A: '/assets/buildings/belveder/facade-a.svg',
    B: '/assets/buildings/belveder/facade-b.svg',
    C: '/assets/buildings/belveder/facade-c.svg',
    D: '/assets/buildings/belveder/facade-d.svg',
  };
</script>

<div class="building-view">
  <!-- Stacked facade images with crossfade -->
  {#each FACADES as facade}
    <div
      class="facade-layer"
      class:active={$currentFacade === facade}
      class:transitioning={$isTransitioning}
    >
      <img
        src={FACADE_IMAGES[facade]}
        alt="Belveder Residence — Fasada {facade}"
        draggable="false"
      />
    </div>
  {/each}

  <!-- Facade navigation arrows -->
  <button class="nav-arrow nav-arrow--left" onclick={() => rotatePrev()} aria-label="Prethodna fasada">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>

  <button class="nav-arrow nav-arrow--right" onclick={() => rotateNext()} aria-label="Sledeca fasada">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>

  <!-- Facade indicator dots -->
  <div class="facade-indicators">
    {#each FACADES as facade}
      <span
        class="indicator-dot"
        class:active={$currentFacade === facade}
      ></span>
    {/each}
  </div>
</div>

<style>
  .building-view {
    position: absolute;
    inset: 0;
    background: var(--bg);
  }

  .facade-layer {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
  }

  .facade-layer.active {
    opacity: 1;
    pointer-events: auto;
  }

  .facade-layer img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  /* Navigation arrows */
  .nav-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gold);
    background: rgba(12, 11, 10, 0.5);
    border: 1px solid rgba(197, 164, 108, 0.2);
    backdrop-filter: blur(8px);
    transition: all var(--transition);
    cursor: pointer;
  }

  .nav-arrow:hover {
    background: rgba(197, 164, 108, 0.15);
    border-color: var(--gold);
    box-shadow: 0 0 12px rgba(197, 164, 108, 0.2);
  }

  .nav-arrow--left {
    left: var(--space-6);
  }

  .nav-arrow--right {
    right: var(--space-6);
  }

  /* Facade indicator dots */
  .facade-indicators {
    position: absolute;
    bottom: var(--space-8);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: var(--space-3);
    z-index: 10;
  }

  .indicator-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(197, 164, 108, 0.25);
    border: 1px solid rgba(197, 164, 108, 0.3);
    transition: all var(--transition);
  }

  .indicator-dot.active {
    background: var(--gold);
    box-shadow: 0 0 8px rgba(197, 164, 108, 0.4);
  }

  @media (max-width: 768px) {
    .nav-arrow {
      width: 40px;
      height: 40px;
    }

    .nav-arrow--left {
      left: var(--space-3);
    }

    .nav-arrow--right {
      right: var(--space-3);
    }
  }
</style>
