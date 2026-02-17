<script lang="ts">
  import type { InteriorStyle } from '../../lib/types';
  import { selection, selectStyle } from '../../lib/stores/selection';

  export let styles: InteriorStyle[] = [];

  function handleStyleClick(styleId: string) {
    selectStyle(styleId);
    // Scroll to render gallery
    document.getElementById('prostor')?.scrollIntoView({ behavior: 'smooth' });
  }

  // Style card gradient backgrounds
  const styleBgs: Record<string, string> = {
    'modern-minimal':
      'linear-gradient(135deg, #2C2824 0%, #1C1A17 40%, #141210 100%)',
    'nordic-calm':
      'linear-gradient(135deg, #262928 0%, #1A1D1C 40%, #111312 100%)',
    'luxe-edition':
      'linear-gradient(135deg, #2A2520 0%, #1E1A16 40%, #13110F 100%)',
  };

  // Style card accent radials
  const styleAccents: Record<string, string> = {
    'modern-minimal':
      'radial-gradient(ellipse at 60% 40%, rgba(220,200,170,0.08), transparent 60%)',
    'nordic-calm':
      'radial-gradient(ellipse at 40% 50%, rgba(180,200,190,0.06), transparent 60%)',
    'luxe-edition':
      'radial-gradient(ellipse at 50% 30%, rgba(197,164,108,0.1), transparent 50%)',
  };
</script>

<section class="style-section reveal" id="enterijeri">
  <div class="section-header">
    <div>
      <div class="label">Korak 2</div>
      <div class="heading-lg">Odaberite <em>stil</em></div>
    </div>
    <div class="section-desc">
      Tri pažljivo osmišljena paketa enterijera. Svaki sa jedinstvenim karakterom i atmosferom.
    </div>
  </div>

  <div class="styles-grid">
    {#each styles as style, i (style.id)}
      <button
        class="style-card"
        class:active={$selection.styleId === style.id}
        on:click={() => handleStyleClick(style.id)}
      >
        <div
          class="style-card-bg"
          style="background: {styleBgs[style.slug] || styleBgs['modern-minimal']}, {styleAccents[style.slug] || styleAccents['modern-minimal']};"
        ></div>
        <div class="style-number">0{i + 1}</div>
        <div class="style-overlay">
          <div class="style-name">{style.name}</div>
          <div class="style-desc">{style.description}</div>
          <div class="style-tags">
            {#each style.tags as tag}
              <span class="style-tag">{tag}</span>
            {/each}
          </div>
        </div>
      </button>
    {/each}
  </div>
</section>

<style>
  .style-section {
    padding: var(--space-30) var(--page-padding);
    background: linear-gradient(to bottom, var(--bg), #0F0E0D);
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

  .styles-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
  }

  .style-card {
    position: relative;
    aspect-ratio: 4/5;
    overflow: hidden;
    cursor: pointer;
    background: var(--bg-card);
    border: none;
    color: var(--text);
    text-align: left;
    padding: 0;
  }

  .style-card-bg {
    position: absolute;
    inset: 0;
    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .style-card:hover .style-card-bg {
    transform: scale(1.05);
  }

  .style-number {
    font-family: var(--serif);
    font-size: 72px;
    font-weight: 300;
    color: rgba(197, 164, 108, 0.15);
    position: absolute;
    top: 32px;
    left: 40px;
    z-index: 1;
  }

  .style-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(12,11,10,0.9) 0%, rgba(12,11,10,0) 60%);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 40px;
    transition: all 0.4s;
    z-index: 2;
  }

  .style-card:hover .style-overlay {
    background: linear-gradient(to top, rgba(12,11,10,0.95) 0%, rgba(12,11,10,0.1) 70%);
  }

  .style-card.active .style-overlay {
    border-bottom: 2px solid var(--gold);
  }

  .style-name {
    font-family: var(--serif);
    font-size: 32px;
    font-weight: 300;
    margin-bottom: 8px;
  }

  .style-card.active .style-name {
    color: var(--gold);
  }

  .style-desc {
    font-size: 12px;
    color: var(--text-dim);
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .style-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .style-tag {
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-dim);
    border: 1px solid var(--border);
    padding: 4px 10px;
  }

  @media (max-width: 768px) {
    .style-section {
      padding: var(--space-20) var(--page-padding);
    }

    .section-header {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-4);
    }

    .styles-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
