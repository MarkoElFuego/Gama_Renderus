<script lang="ts">
  import type { Apartment, InteriorStyle } from '../../lib/types';
  import { selection } from '../../lib/stores/selection';

  export let styles: InteriorStyle[] = [];
  export let allApartments: Apartment[] = [];

  let firstName = '';
  let lastName = '';
  let email = '';
  let phone = '';
  let isSubmitting = false;
  let isSubmitted = false;

  $: selectedApt = allApartments.find(a => a.id === $selection.apartmentId);
  $: selectedStyle = styles.find(s => s.id === $selection.styleId);

  function formatPrice(price: number): string {
    return new Intl.NumberFormat('de-DE').format(price);
  }

  async function handleSubmit() {
    if (!firstName || !email || !selectedApt) return;

    isSubmitting = true;

    // TODO: Replace with Supabase insert
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Lead submitted:', {
      firstName,
      lastName,
      email,
      phone,
      apartmentId: selectedApt?.id,
      styleId: selectedStyle?.id,
    });

    isSubmitting = false;
    isSubmitted = true;
  }
</script>

{#if selectedApt && selectedStyle}
  <section class="cta-section reveal" id="kontakt">
    <div class="cta-left">
      <div class="label">Korak 4</div>
      <h2 class="heading-lg">
        Zainteresovani<br>ste za ovaj <em>dom?</em>
      </h2>
      <p class="body-text">
        Ostavite kontakt i dobićete detaljnu ponudu sa vizualizacijama
        vašeg stana u PDF formatu — prilagođenu vašem izboru stila.
      </p>
    </div>

    <div class="cta-right">
      {#if isSubmitted}
        <div class="success-message">
          <div class="success-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h3>Hvala vam!</h3>
          <p>Ponuda će biti poslata na <strong>{email}</strong> u narednih nekoliko minuta.</p>
        </div>
      {:else}
        <form class="cta-form" on:submit|preventDefault={handleSubmit}>
          <div class="form-row">
            <div class="form-field">
              <label class="form-label" for="firstName">Ime</label>
              <input
                class="form-input"
                type="text"
                id="firstName"
                placeholder="Vaše ime"
                bind:value={firstName}
                required
              />
            </div>
            <div class="form-field">
              <label class="form-label" for="lastName">Prezime</label>
              <input
                class="form-input"
                type="text"
                id="lastName"
                placeholder="Vaše prezime"
                bind:value={lastName}
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-field">
              <label class="form-label" for="email">Email</label>
              <input
                class="form-input"
                type="email"
                id="email"
                placeholder="email@primer.com"
                bind:value={email}
                required
              />
            </div>
            <div class="form-field">
              <label class="form-label" for="phone">Telefon</label>
              <input
                class="form-input"
                type="tel"
                id="phone"
                placeholder="+381 6X XXX XXXX"
                bind:value={phone}
              />
            </div>
          </div>

          <!-- Selection summary -->
          <div class="cta-summary">
            <div class="cta-summary-title">Vaš izbor</div>
            <div class="cta-summary-items">
              <div class="cta-summary-item">
                <div class="cta-summary-dot"></div>
                Stan {selectedApt.code} — {selectedApt.areaM2} m²
              </div>
              <div class="cta-summary-item">
                <div class="cta-summary-dot"></div>
                {selectedStyle.name}
              </div>
              <div class="cta-summary-item">
                <div class="cta-summary-dot"></div>
                € {formatPrice(selectedApt.priceEur)}
              </div>
            </div>
          </div>

          <button
            class="cta-btn"
            type="submit"
            disabled={isSubmitting || !firstName || !email}
          >
            {#if isSubmitting}
              Šaljem...
            {:else}
              Pošaljite mi ponudu →
            {/if}
          </button>
        </form>
      {/if}
    </div>
  </section>
{/if}

<style>
  .cta-section {
    padding: var(--space-30) var(--page-padding);
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    border-top: 1px solid var(--border);
  }

  .cta-left p {
    max-width: 400px;
    margin-top: var(--space-6);
  }

  /* Form */
  .cta-form {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
  }

  .form-field {
    background: var(--bg-card);
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-label {
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-dim);
  }

  .form-input {
    background: none;
    border: none;
    border-bottom: 1px solid var(--border);
    color: var(--text);
    font-family: var(--serif);
    font-size: 18px;
    padding: 8px 0;
    outline: none;
    transition: border-color 0.3s;
    width: 100%;
  }

  .form-input:focus {
    border-color: var(--gold);
  }

  .form-input::placeholder {
    color: var(--text-dim);
    font-style: italic;
    opacity: 0.5;
  }

  /* Summary */
  .cta-summary {
    background: var(--bg-card);
    padding: 24px;
  }

  .cta-summary-title {
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-dim);
    margin-bottom: 16px;
  }

  .cta-summary-items {
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
  }

  .cta-summary-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--text-mid);
  }

  .cta-summary-dot {
    width: 6px;
    height: 6px;
    background: var(--gold);
    flex-shrink: 0;
  }

  /* Submit button */
  .cta-btn {
    background: var(--gold);
    color: var(--bg);
    font-family: var(--sans);
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 20px 32px;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 500;
  }

  .cta-btn:hover:not(:disabled) {
    background: var(--gold-light);
  }

  .cta-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Success state */
  .success-message {
    text-align: center;
    padding: var(--space-16) var(--space-8);
  }

  .success-icon {
    color: var(--gold);
    margin-bottom: var(--space-6);
  }

  .success-message h3 {
    font-family: var(--serif);
    font-size: 32px;
    font-weight: 300;
    margin-bottom: var(--space-4);
  }

  .success-message p {
    color: var(--text-dim);
    font-size: 14px;
    line-height: 1.6;
  }

  .success-message strong {
    color: var(--gold);
  }

  @media (max-width: 768px) {
    .cta-section {
      grid-template-columns: 1fr;
      gap: var(--space-12);
      padding: var(--space-20) var(--page-padding);
    }

    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>
