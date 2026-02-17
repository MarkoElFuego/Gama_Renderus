<script lang="ts">
  export let projectName: string = 'Belveder Residence';
  export let location: string = 'Novi Beograd';
  export let totalApartments: number = 48;
  export let stylesCount: number = 3;
  export let areaRange: string = '35–92';
  export let moveInYear: string = '2026';
</script>

<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-render"></div>
  <div class="hero-content">
    <div class="hero-badge">
      {projectName} — {location}
    </div>
    <h1>Zamislite svoj<br>budući <em>dom</em></h1>
    <p class="hero-sub">
      Izaberite stan, odaberite stil enterijera i pogledajte
      fotorealističnu vizualizaciju vašeg prostora — pre nego
      što se useli prvi komšija.
    </p>
    <div class="hero-stats">
      <div class="stat">
        <div class="stat-num">{totalApartments}</div>
        <div class="stat-label">Stanova</div>
      </div>
      <div class="stat">
        <div class="stat-num">{stylesCount}</div>
        <div class="stat-label">Stila enterijera</div>
      </div>
      <div class="stat">
        <div class="stat-num">{areaRange}</div>
        <div class="stat-label">m² površine</div>
      </div>
      <div class="stat">
        <div class="stat-num">{moveInYear}</div>
        <div class="stat-label">Useljenje</div>
      </div>
    </div>
  </div>
</section>

<style>
  .hero {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: var(--page-padding);
    position: relative;
    overflow: hidden;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to bottom, rgba(12,11,10,0) 0%, rgba(12,11,10,0.3) 40%, rgba(12,11,10,0.85) 75%, rgba(12,11,10,1) 100%),
      linear-gradient(135deg, #2a2520 0%, #1a1816 30%, #12110f 60%, #0d0c0b 100%);
    z-index: 0;
  }

  .hero-render {
    position: absolute;
    inset: 0;
    z-index: 0;
    opacity: 0.4;
    background:
      radial-gradient(ellipse at 70% 30%, rgba(197,164,108,0.08) 0%, transparent 60%),
      radial-gradient(ellipse at 30% 60%, rgba(180,160,130,0.05) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 40%, rgba(255,245,230,0.03) 0%, transparent 40%);
  }

  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 800px;
    animation: fadeUp 1.2s ease-out;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .hero-badge {
    font-size: 10px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: var(--space-6);
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .hero-badge::before {
    content: '';
    width: 40px;
    height: 1px;
    background: var(--gold);
  }

  h1 {
    font-family: var(--serif);
    font-size: clamp(42px, 6vw, 80px);
    font-weight: 300;
    line-height: 1.05;
    letter-spacing: -1px;
    margin-bottom: var(--space-6);
  }

  .hero-sub {
    font-size: 15px;
    color: var(--text-dim);
    line-height: 1.7;
    max-width: 500px;
    margin-bottom: var(--space-12);
  }

  .hero-stats {
    display: flex;
    gap: var(--space-12);
    padding-top: var(--space-8);
    border-top: 1px solid var(--border);
  }

  .stat-num {
    font-family: var(--serif);
    font-size: 36px;
    font-weight: 300;
    color: var(--gold);
  }

  .stat-label {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-top: 4px;
  }

  @media (max-width: 768px) {
    .hero-stats {
      gap: var(--space-6);
      flex-wrap: wrap;
    }
  }
</style>
