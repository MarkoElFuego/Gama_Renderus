<script lang="ts">
  import { onMount } from 'svelte';
  import type { Building, InteriorStyle } from '../../lib/types';
  import { showroom, currentView, isTransitioning } from '../../lib/stores/showroom';
  import { addWelcomeMessage } from '../../lib/stores/conversation';
  import BuildingView from './BuildingView.svelte';
  import FacadeOverlay from './FacadeOverlay.svelte';
  import FloorPlanView from './FloorPlanView.svelte';
  import PanoramaView from './PanoramaView.svelte';
  import HudOverlay from './HudOverlay.svelte';
  import ResponseBar from './ResponseBar.svelte';
  import CommandInput from './CommandInput.svelte';

  let { project, buildings, styles }: {
    project: any;
    buildings: Building[];
    styles: InteriorStyle[];
  } = $props();

  onMount(() => {
    addWelcomeMessage(project.name);
  });

  // Flatten all apartments for lookups
  const allApartments = $derived(
    buildings.flatMap(b => b.floors.flatMap(f => f.apartments))
  );

  // Find selected apartment data
  const selectedApartment = $derived(
    $showroom.selectedApartmentId
      ? allApartments.find(a => a.id === $showroom.selectedApartmentId)
      : null
  );
</script>

<div class="showroom" class:transitioning={$isTransitioning}>
  <!-- Viewport -->
  <div class="viewport">
    {#if $currentView === 'building'}
      <BuildingView />
    {:else if $currentView === 'facade_highlight'}
      <FacadeOverlay
        apartments={allApartments}
        selectedApartment={selectedApartment}
      />
    {:else if $currentView === 'floor_plan'}
      <FloorPlanView
        apartment={selectedApartment}
      />
    {:else if $currentView === 'panorama'}
      <PanoramaView
        apartmentType={selectedApartment?.type}
        room={$showroom.selectedRoom}
      />
    {/if}

    <!-- HUD sits on top of all viewport content -->
    <HudOverlay
      project={project}
      apartment={selectedApartment}
    />
  </div>

  <!-- Response bar -->
  <ResponseBar />

  <!-- Command input -->
  <CommandInput
    {buildings}
    {project}
  />
</div>

<style>
  .showroom {
    display: contents;
  }

  .viewport {
    position: relative;
    overflow: hidden;
    background: var(--bg);
  }

  .viewport :global(> *) {
    position: absolute;
    inset: 0;
  }

  .viewport :global(> :last-child) {
    z-index: var(--z-above);
  }
</style>
