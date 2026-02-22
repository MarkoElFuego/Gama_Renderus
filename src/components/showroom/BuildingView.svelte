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

  // Touch swipe support
  let touchStartX = 0;
  let touchStartY = 0;
  const SWIPE_THRESHOLD = 50;

  function handleTouchStart(e: TouchEvent) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    // Only horizontal swipes (ignore vertical scrolling)
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) {
        rotatePrev();
      } else {
        rotateNext();
      }
    }
  }
</script>

<div
  class="building-view"
  ontouchstart={handleTouchStart}
  ontouchend={handleTouchEnd}
>
  <!-- Stacked facade images with crossfade -->
  {#each FACADES as facade}
    <div
      class="facade-layer"
      class:active={$currentFacade === facade}
      class:transitioning={$isTransitioning}
    >
      <img
        src={FACADE_IMAGES[facade]}
        alt="Belveder Residence"
        draggable="false"
      />
    </div>
  {/each}
</div>

<style>
  .building-view {
    position: absolute;
    inset: 0;
    background: var(--bg);
    touch-action: pan-y;
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
</style>
