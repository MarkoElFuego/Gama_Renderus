<section class="admin-section reveal">
  <div class="section-header">
    <div>
      <div class="label">Admin Dashboard</div>
      <div class="heading-lg">Vaša prodajna <em>komanda</em></div>
    </div>
    <div class="section-desc">
      Kontrolna tabla za developere — pratite leadove, stanove i analitiku u realnom vremenu.
    </div>
  </div>

  <div class="admin-grid">
    <!-- Leads card -->
    <div class="admin-card">
      <div class="admin-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </div>
      <h3>Leadovi</h3>
      <p>Svaki zainteresovani kupac sa kontaktom, izabranim stanom i stilom. Automatski.</p>
      <div class="admin-stat">
        <div class="admin-stat-item">
          <div class="admin-stat-num">127</div>
          <div class="admin-stat-label">Ovog meseca</div>
        </div>
        <div class="admin-stat-item">
          <div class="admin-stat-num">34%</div>
          <div class="admin-stat-label">Konverzija</div>
        </div>
      </div>
    </div>

    <!-- Apartments status card -->
    <div class="admin-card">
      <div class="admin-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="7" height="7"/>
          <rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
        </svg>
      </div>
      <h3>Status stanova</h3>
      <p>Ažurirajte status u realnom vremenu. Kupci vide šta je slobodno odmah.</p>
      <div class="admin-stat">
        <div class="admin-stat-item">
          <div class="admin-stat-num">23</div>
          <div class="admin-stat-label">Slobodnih</div>
        </div>
        <div class="admin-stat-item">
          <div class="admin-stat-num">25</div>
          <div class="admin-stat-label">Prodatih</div>
        </div>
      </div>
    </div>

    <!-- Analytics card -->
    <div class="admin-card">
      <div class="admin-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      </div>
      <h3>Analitika</h3>
      <p>Koji stilovi su najpopularniji, koji stanovi se najviše gledaju, kad je peak saobraćaj.</p>
      <div class="admin-stat">
        <div class="admin-stat-item">
          <div class="admin-stat-num">68%</div>
          <div class="admin-stat-label">Modern</div>
        </div>
        <div class="admin-stat-item">
          <div class="admin-stat-num">2.4k</div>
          <div class="admin-stat-label">Poseta</div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .admin-section {
    padding: var(--space-30) var(--page-padding);
    border-top: 1px solid var(--border);
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

  .admin-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
  }

  .admin-card {
    background: var(--bg-card);
    padding: 40px 32px;
    position: relative;
    overflow: hidden;
  }

  .admin-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--gold);
    transform: scaleX(0);
    transition: transform 0.6s;
    transform-origin: left;
  }

  .admin-card:hover::before {
    transform: scaleX(1);
  }

  .admin-icon {
    width: 40px;
    height: 40px;
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    color: var(--gold);
  }

  h3 {
    font-family: var(--serif);
    font-size: 22px;
    font-weight: 400;
    margin-bottom: 12px;
  }

  p {
    font-size: 13px;
    color: var(--text-dim);
    line-height: 1.6;
  }

  .admin-stat {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
  }

  .admin-stat-item {
    text-align: center;
  }

  .admin-stat-num {
    font-family: var(--serif);
    font-size: 28px;
    color: var(--gold);
  }

  .admin-stat-label {
    font-size: 9px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-top: 4px;
  }

  @media (max-width: 768px) {
    .admin-section {
      padding: var(--space-20) var(--page-padding);
    }

    .section-header {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-4);
    }

    .admin-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
