# GAMMA RENDERUS — Master Plan

## Šta je ovo?
Archviz platforma za real estate developere. Kupac stana bira stan, stil enterijera i materijale — vidi fotorealistične V-Ray rendere. Developer dobija prodajni alat + lead management.

**Platforma:** Gamma Renderus (tvoj proizvod)
**Demo projekat:** "Belveder Residence" (primer deployment-a za jednog klijenta)
**Powered by:** "Renderus Studio" u footeru svakog klijentskog sajta

---

## Arhitektura — Big Picture

```
┌─────────────────────────────────────────────────────────┐
│                   GAMMA RENDERUS                         │
│                                                          │
│  ┌──────────────┐         ┌──────────────────────────┐  │
│  │  KUPAC PWA   │         │    ADMIN DASHBOARD       │  │
│  │  (mobile 1st)│         │    (desktop)             │  │
│  │              │         │                          │  │
│  │ Zgrada →     │         │ Lead management          │  │
│  │ Sprat →      │  ←DB→   │ Status stanova           │  │
│  │ Stan →       │         │ Analitika                │  │
│  │ Stil →       │         │ Upload rendera           │  │
│  │ Renderi →    │         │ Konfiguracija projekta   │  │
│  │ Lead forma → │         │                          │  │
│  │ PDF ponuda   │         │                          │  │
│  └──────────────┘         └──────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐│
│  │              SUPABASE BACKEND                        ││
│  │  PostgreSQL │ Auth │ Storage │ Realtime │ Edge Fn    ││
│  └──────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

---

## Tech Stack — Preporuka

### Frontend: **Astro + Svelte islands**
**Zašto Astro:**
- Outputuje čist, brz HTML — kritično za SEO i brzinu (kupac PWA)
- "Islands architecture" — statičan HTML sa interaktivnim komponentama gde treba
- Svelte za interaktivne delove (konfigurator, admin) — kompajlira u vanilla JS, ultra brz
- Built-in PWA support preko @vite-pwa/astro
- Dva odvojena build targeta: kupac site + admin dashboard
- Zero JS po defaultu, dodaješ samo gde treba

**Zašto Svelte za islands (ne React):**
- Manji bundle (konfigurator mora biti brz na mobilnom)
- Nema virtual DOM overhead
- Reaktivnost ugrađena u jezik
- Odličan za animacije i tranzicije (render galerija)

### Backend: **Supabase**
**Zašto:**
- PostgreSQL — pravi relacioni model za stanove/spratove/zgrade/leadove
- Row Level Security — admin vidi sve, kupac vidi samo slobodne
- Auth — admin login, opciono kupac registracija
- Storage — za V-Ray rendere, sprite sheets, PDF-ove
- Realtime — kad admin promeni status stana, kupac PWA se ažurira
- Edge Functions — PDF generacija, email notifikacije
- Besplatan tier za development, skalira se lako

### Build & Deploy: **Vite (through Astro) + Vercel/Netlify**

### Ostalo:
- **TailwindCSS** — NE. Mockup ima specifičan custom design system. Koristimo CSS custom properties (kao u mockupu) + malo SCSS za nesting
- **PDF generacija** — jsPDF ili server-side sa Puppeteer edge function
- **Sprite sheets** — CSS sprite + canvas za layer compositing
- **Parallax** — Intersection Observer + CSS transforms (kao u mockupu)

---

## Struktura projekta

```
gama-renderus/
├── README.md
├── astro.config.mjs
├── package.json
├── tsconfig.json
│
├── public/
│   ├── fonts/
│   ├── favicon.svg
│   └── manifest.json          # PWA manifest
│
├── src/
│   ├── layouts/
│   │   ├── BaseLayout.astro       # Zajednički head, meta, fonts
│   │   ├── BuyerLayout.astro      # Kupac PWA layout (nav, footer)
│   │   └── AdminLayout.astro      # Admin dashboard layout (sidebar)
│   │
│   ├── styles/
│   │   ├── global.css             # CSS variables, reset, typography
│   │   ├── buyer.css              # Kupac-specifični stilovi
│   │   └── admin.css              # Admin-specifični stilovi
│   │
│   ├── components/
│   │   ├── buyer/                 # Kupac PWA komponente (Svelte)
│   │   │   ├── HeroSection.svelte
│   │   │   ├── BuildingSelector.svelte    # Zgrada → Sprat → Stan
│   │   │   ├── FloorPlan.svelte           # SVG floor plan interaktivan
│   │   │   ├── StyleSelector.svelte       # Stil enterijera picker
│   │   │   ├── MaterialPicker.svelte      # Swap materijala unutar stila
│   │   │   ├── RenderGallery.svelte       # Layer compositing + galerija
│   │   │   ├── RenderViewer.svelte        # Main render sa hotspotima
│   │   │   ├── LeadForm.svelte            # Kontakt forma
│   │   │   └── PdfPreview.svelte          # Preview pre slanja
│   │   │
│   │   ├── admin/                 # Admin komponente (Svelte)
│   │   │   ├── Sidebar.svelte
│   │   │   ├── LeadTable.svelte
│   │   │   ├── ApartmentManager.svelte
│   │   │   ├── AnalyticsDashboard.svelte
│   │   │   ├── RenderUploader.svelte
│   │   │   └── ProjectSettings.svelte
│   │   │
│   │   └── shared/                # Deljene komponente
│   │       ├── Logo.svelte
│   │       ├── StatusBadge.svelte
│   │       └── LoadingSpinner.svelte
│   │
│   ├── pages/
│   │   ├── index.astro                # Landing / Hero → Konfigurator flow
│   │   ├── configure/
│   │   │   └── [building].astro       # Konfigurator za konkretnu zgradu
│   │   │
│   │   └── admin/
│   │       ├── index.astro            # Admin dashboard home
│   │       ├── leads.astro            # Lead management
│   │       ├── apartments.astro       # Status stanova
│   │       ├── analytics.astro        # Analitika
│   │       └── settings.astro         # Podešavanja projekta
│   │
│   ├── lib/
│   │   ├── supabase.ts               # Supabase client init
│   │   ├── types.ts                   # TypeScript tipovi
│   │   ├── render-engine.ts           # Layer compositing engine
│   │   ├── pdf-generator.ts           # PDF ponuda generacija
│   │   └── stores/                    # Svelte stores
│   │       ├── selection.ts           # Trenutni izbor kupca
│   │       ├── project.ts             # Podaci o projektu
│   │       └── auth.ts               # Admin auth state
│   │
│   └── data/                          # Demo podaci (za development)
│       ├── buildings.json
│       ├── apartments.json
│       ├── styles.json
│       └── materials.json
│
├── supabase/
│   ├── migrations/                    # SQL migracije
│   │   └── 001_initial_schema.sql
│   ├── seed.sql                       # Demo podaci
│   └── functions/                     # Edge functions
│       ├── generate-pdf/
│       └── send-notification/
│
└── docs/
    └── render-pipeline.md             # Kako pripremiti rendere
```

---

## Database Schema

```sql
-- Projekti (svaki klijent = 1 projekat)
projects
  id, name, slug, description, hero_image, developer_name, location
  settings (jsonb: boje, logo, kontakt...)
  created_at

-- Zgrade unutar projekta
buildings
  id, project_id, name, slug, floors_count, image_url
  sort_order

-- Spratovi
floors
  id, building_id, floor_number, name, label
  floor_plan_svg (za interaktivni SVG)

-- Stanovi
apartments
  id, floor_id, code (A1, A2...), type (studio/1br/2br/3br/penthouse)
  area_m2, price_eur, rooms, bathrooms
  status (available/reserved/sold)
  position_on_plan (jsonb: x,y koordinate na SVG)
  orientation (N/S/E/W)

-- Stilovi enterijera
styles
  id, project_id, name, slug, description
  thumbnail_url, color_scheme (jsonb)
  sort_order

-- Materijali (swap opcije unutar stila)
materials
  id, style_id, category (floor/wall/kitchen/furniture/details)
  name, thumbnail_url, render_layer_id
  is_default

-- Renderi (V-Ray outputi)
renders
  id, apartment_id (ili apartment_type_id za tipske osnove)
  style_id, room (living/bedroom/kitchen/bathroom)
  layers (jsonb: niz layera sa URL-ovima)
  camera_angle, resolution

-- Render layeri
render_layers
  id, render_id, material_id
  layer_url (sprite sheet URL)
  z_index, blend_mode, opacity

-- Leadovi
leads
  id, project_id, apartment_id, style_id
  first_name, last_name, email, phone
  message, materials_chosen (jsonb)
  pdf_url, status (new/contacted/qualified/converted/lost)
  source (web/qr/agent)
  created_at

-- Admin users
admin_users
  id (auth.users ref), project_id, role (owner/editor/viewer)
  name, email

-- Analitika events
analytics_events
  id, project_id, event_type, apartment_id, style_id
  session_id, device_type, timestamp
  metadata (jsonb)
```

---

## Kupac PWA Flow (Mobile First)

### Korak po korak:

```
1. LANDING (Hero)
   - Ime projekta, hero render, statistika
   - CTA: "Istražite stanove" → scrolluje ili navigira

2. IZBOR STANA
   a) Zgrada (ako ima više) — kartice sa slikama
   b) Sprat — vertikalni listing ili interaktivni presjek zgrade
   c) Stan — grid kartica ILI interaktivni floor plan SVG
      - Prikaži: kod, tip, m², cena, status
      - Klik → prelaz na stil

3. IZBOR STILA
   - 3 kartice (Modern Minimal, Nordic Calm, Luxe Edition)
   - Hover/tap → preview render se blenduje
   - Klik → potvrda stila

4. MATERIJALI (opciono, unutar stila)
   - Kategorije: Pod, Kuhinja, Nameštaj, Detalji
   - Swipe kroz opcije → render se ažurira (layer swap)
   - Ovo je core "magic" — compositing engine

5. RENDER GALERIJA
   - Prostorije: Dnevna, Spavaća, Kuhinja, Kupatilo
   - Svaka prostorija = composite render sa hotspotima
   - Hotspot klik → zoom na detalj materijala
   - Parallax efekat na scroll

6. LEAD FORMA + PDF
   - Rezime izbora (stan, stil, materijali)
   - Kontakt podaci
   - "Pošaljite mi ponudu" → generiše PDF + šalje lead u bazu

7. HVALA STRANICA
   - Potvrda, PDF download link, CTA za zakazivanje obilaska
```

### Render Engine — Layer Compositing

```
Kako radi:

1. Fotograf/3D artist renderuje svaku sobu sa V-Ray
2. Svaki materijal = poseban layer (podna obloga, zidovi, nameštaj...)
3. Layeri se čuvaju kao optimizovane slike (WebP, sprite sheets)

U browseru:
┌──────────────────────────────┐
│  Base layer (zidovi, prozori) │  z-index: 0
├──────────────────────────────┤
│  Floor layer (parket/mermer)  │  z-index: 1
├──────────────────────────────┤
│  Kitchen layer               │  z-index: 2  ← swap!
├──────────────────────────────┤
│  Furniture layer             │  z-index: 3  ← swap!
├──────────────────────────────┤
│  Details layer (dekor)       │  z-index: 4  ← swap!
├──────────────────────────────┤
│  Lighting/mood overlay       │  z-index: 5
│  (CSS filter: color grading) │
└──────────────────────────────┘

Tehnički:
- Canvas API za compositing (ili CSS stacked images za simple slučajeve)
- Sprite sheets za materijal varijante (1 slika = 4 opcije poda, itd.)
- CSS color grading: filter + mix-blend-mode za mood
- Crossfade animacija pri swapu (200-400ms)
- Lazy loading: base + default materijali odmah, ostali on-demand
- Preload: kad korisnik hovera nad materijalom, počni fetch
```

---

## Admin Dashboard

### Sekcije:

```
1. OVERVIEW
   - Ukupno leadova (danas/nedelja/mesec)
   - Status stanova pie chart
   - Najgledaniji stanovi/stilovi
   - Poslednji leadovi lista

2. LEADOVI
   - Tabela sa filterima (status, stan, stil, datum)
   - Klik → detalji: šta je kupac izabrao, render preview
   - Status update: new → contacted → qualified → converted/lost
   - Export CSV
   - Email notifikacije za nove leadove

3. STANOVI
   - Grid ili tabela svih stanova
   - Inline status update (available/reserved/sold)
   - Bulk update
   - Cene edit

4. ANALITIKA
   - Posete po danu/nedelji/mesecu
   - Najpopularniji stilovi (pie chart)
   - Funnel: Landing → Stan izabran → Stil izabran → Lead → Konverzija
   - Device breakdown (mobile/desktop)
   - Heatmap: koji stanovi se najviše gledaju

5. PODEŠAVANJA
   - Ime projekta, logo, boje
   - Kontakt informacije
   - Email za notifikacije
   - Upload rendera (drag & drop)
```

---

## AI Agent — "Renderus Assistant"

Premium feature koji diferencira platformu. Umesto da kupac klika kroz korake,
vodi ga AI kroz konverzaciju — kao lični real estate konsultant koji poznaje svaki
stan, stil i materijal.

### Šta radi:

```
KUPAC: "Trebam dvosoban stan do 150k, volim moderan stil"

AGENT: "Imam 3 odlična dvosobna stana u tom budžetu:
        • A2 (62m², 4. sprat) — €142,600 — sjajan pogled na park
        • A7 (65.4m², 4. sprat) — €150,400 — ugaoni, više svetla
        • B3 (59m², 3. sprat) — €135,800 — tiha strana zgrade

        Za moderan stil, preporučujem 'Modern Minimal' — čiste linije,
        hrast pod, antracit kuhinja. Hoćete da vidite renderovane sobe
        za stan A2?"

KUPAC: "Da, pokaži A2"

AGENT: [Prikazuje rendere A2 u Modern Minimal stilu]
       "Evo dnevne sobe sa hrastovim parketom i antracit kuhinjom.
        Možete swipe-ovati za spavaću sobu i kupatilo.
        Hoćete da vam pošaljem kompletnu ponudu na email?"

KUPAC: "Da, na marko@email.com"

AGENT: [Generiše PDF, šalje email]
       "Ponuda je poslata! Sadrži rendere svih soba, specifikaciju
        materijala i cenu. Naš tim će vas kontaktirati u roku od 24h.
        Imate li još pitanja o stanu ili zgradi?"
```

### Arhitektura:

```
┌─────────────────────────────────────────────────────────────────┐
│                     AI AGENT SYSTEM                              │
│                                                                  │
│  ┌──────────────┐    ┌─────────────────┐    ┌───────────────┐  │
│  │  CHAT UI     │───▶│  EDGE FUNCTION  │───▶│  CLAUDE API   │  │
│  │  (Svelte)    │◀───│  /api/agent     │◀───│  (Anthropic)  │  │
│  │              │    │                 │    │               │  │
│  │ • Bubble msg │    │ • Auth/rate lim │    │ • claude-sonnet│  │
│  │ • Typing ind │    │ • RAG retrieval │    │ • System prompt│  │
│  │ • Render     │    │ • Tool calls    │    │ • Tool use    │  │
│  │   preview    │    │ • Session mgmt  │    │               │  │
│  │ • Quick acts │    │                 │    │               │  │
│  └──────────────┘    └────────┬────────┘    └───────────────┘  │
│                               │                                  │
│                    ┌──────────▼──────────┐                      │
│                    │   RAG KNOWLEDGE     │                      │
│                    │                     │                      │
│                    │ • Apartments DB     │                      │
│                    │ • Styles + mats     │                      │
│                    │ • Project info      │                      │
│                    │ • Pricing rules     │                      │
│                    │ • FAQ / policies    │                      │
│                    │ • Location info     │                      │
│                    └──────────┬──────────┘                      │
│                               │                                  │
│                    ┌──────────▼──────────┐                      │
│                    │   AGENT TOOLS       │                      │
│                    │                     │                      │
│                    │ • search_apartments │                      │
│                    │ • get_renders       │                      │
│                    │ • generate_pdf      │                      │
│                    │ • send_email        │                      │
│                    │ • book_viewing      │                      │
│                    │ • save_lead         │                      │
│                    └─────────────────────┘                      │
└─────────────────────────────────────────────────────────────────┘
```

### RAG — Knowledge Base

Agent ne halucira jer ima pristup svim podacima iz baze u realnom vremenu:

```
1. STRUKTURIRANI PODACI (direktno iz Supabase):
   - Svi stanovi: kod, tip, m², cena, sprat, status, orijentacija
   - Svi stilovi: ime, opis, materijali, tagovi
   - Status zgrade: koliko slobodnih, prodatih, rezervisanih
   - Cenovnik: cena po m², dodatne opcije

2. NESTRUKTURIRANI PODACI (embeddings u pgvector):
   - Opis projekta / zgrade / lokacije
   - FAQ: uslovi kupovine, rate, PDV, rok useljenja
   - Opis svakog stila (detaljno, za agenta)
   - Prednosti svakog stana (pogled, svetlo, tiha strana...)
   - Informacije o okruženju (škole, prodavnice, transport)

3. ADMIN KONFIGURIŠE:
   - Custom FAQ za svaki projekat
   - Prodajni argumenti (selling points)
   - Politika cena i popusti
   - Ton glasa agenta (formalan/opušten)
```

### RAG Pipeline — Kako radi:

```
Korisnik pita: "Koji stan ima najbolji pogled?"

1. QUERY ANALYSIS (Claude)
   → Detektuje intent: apartment_search
   → Extrahuje filtere: feature=view

2. HYBRID RETRIEVAL
   a) Structured query → Supabase:
      SELECT * FROM apartments
      WHERE status = 'available'
      ORDER BY floor DESC  -- viši sprat = bolji pogled

   b) Semantic search → pgvector:
      Embed("najbolji pogled") → cosine similarity
      → Vrati opise stanova koji pominju pogled

3. CONTEXT ASSEMBLY
   → Merge rezultate u context window
   → Dodaj project info, FAQ, selling points

4. CLAUDE GENERATES RESPONSE
   → System prompt: "Ti si ljubazan real estate konsultant..."
   → Context: relevantni stanovi + opisi
   → Generiše prirodan odgovor sa preporukama

5. TOOL CALLS (opciono)
   → Ako kupac kaže "pokaži mi rendere" → get_renders tool
   → Ako kaže "pošalji ponudu" → generate_pdf + send_email tools
```

### Agent Tools (Claude Tool Use):

```typescript
// Tools koje Claude može da pozove:

search_apartments({
  type?: "1br" | "2br" | "3br" | "penthouse",
  min_price?: number,
  max_price?: number,
  min_area?: number,
  floor?: number,
  status?: "available",
  features?: string[]  // "pogled", "ugaoni", "terasa"
})
→ Vraća listu stanova sa detaljima

get_apartment_details({ apartment_id: string })
→ Sve o stanu: sobe, orijentacija, sprat, cena, render URLs

get_renders({ apartment_id: string, style_id: string })
→ Vraća URL-ove rendera za prikaz u chatu

compare_apartments({ ids: string[] })
→ Side-by-side poređenje 2-3 stana

generate_pdf({
  apartment_id: string,
  style_id: string,
  materials?: object,
  customer_name: string,
  customer_email: string
})
→ Generiše PDF ponudu i vraća URL

send_email({
  to: string,
  pdf_url: string,
  apartment_summary: string
})
→ Šalje email sa ponudom

save_lead({
  name: string, email: string, phone?: string,
  apartment_id: string, style_id: string,
  conversation_summary: string,
  source: "agent"
})
→ Čuva lead u bazu sa celom konverzacijom

book_viewing({
  name: string, email: string, phone: string,
  preferred_date?: string,
  apartment_id?: string
})
→ Zakazuje obilazak, šalje notifikaciju adminu

get_project_info()
→ Opšte info: lokacija, rok useljenja, developer, uslovi
```

### Chat UI Komponenta:

```
┌─────────────────────────────────────────┐
│  ✦ Renderus Assistant          ── ✕    │  ← Header
├─────────────────────────────────────────┤
│                                         │
│  Zdravo! 👋 Ja sam vaš virtuelni       │  ← Welcome message
│  konsultant za Belveder Residence.      │
│  Kako vam mogu pomoći?                  │
│                                         │
│  ┌─────────┐ ┌──────────┐ ┌────────┐  │  ← Quick actions
│  │Slobodni  │ │ Stilovi  │ │ Cene   │  │
│  │stanovi   │ │enterijera│ │        │  │
│  └─────────┘ └──────────┘ └────────┘  │
│                                         │
│  ╭─ Kupac ─────────────────────────╮   │
│  │ Trebam dvosoban do 150k         │   │
│  ╰─────────────────────────────────╯   │
│                                         │
│  ╭─ Assistant ─────────────────────╮   │
│  │ Imam 3 odlična stana:          │   │
│  │                                  │   │
│  │ ┌────────────────────────────┐  │   │  ← Apartment cards
│  │ │ A2 · Dvosoban · 62m²      │  │   │    (inline u chatu)
│  │ │ 4. sprat · €142,600       │  │   │
│  │ │ [Vidi rendere] [Detalji]  │  │   │
│  │ └────────────────────────────┘  │   │
│  │ ┌────────────────────────────┐  │   │
│  │ │ A7 · Dvosoban · 65.4m²    │  │   │
│  │ │ 4. sprat · €150,400       │  │   │
│  │ │ [Vidi rendere] [Detalji]  │  │   │
│  │ └────────────────────────────┘  │   │
│  │                                  │   │
│  │ Koji vas zanima?                │   │
│  ╰─────────────────────────────────╯   │
│                                         │
│  ╭─ Kupac ─────────────────────────╮   │
│  │ Pokaži A2 u modern stilu       │   │
│  ╰─────────────────────────────────╯   │
│                                         │
│  ╭─ Assistant ─────────────────────╮   │
│  │ ┌────────────────────────────┐  │   │  ← Render preview
│  │ │      [RENDER IMAGE]        │  │   │    (inline u chatu)
│  │ │    Dnevna soba · A2        │  │   │
│  │ │    Modern Minimal          │  │   │
│  │ └────────────────────────────┘  │   │
│  │ Swipe za ostale sobe →         │   │
│  │                                  │   │
│  │ [📄 Pošalji ponudu]            │   │  ← Action button
│  │ [📅 Zakaži obilazak]           │   │
│  ╰─────────────────────────────────╯   │
│                                         │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────┐  ↑   │  ← Input
│  │ Pitajte bilo šta...         │  │   │
│  └─────────────────────────────┘  ▲   │
└─────────────────────────────────────────┘
```

**UI detalji:**
- Floating button dole-desno (kao Intercom)
- Otvara se kao slide-up panel na mobilnom, sidebar na desktopu
- Agent poruke imaju typing indicator (3 tačke animacija)
- Rich content u porukama: apartment kartice, render slike, action buttons
- Conversation se čuva u session (opciono u localStorage)
- Dark tema konzistentna sa buyer PWA dizajnom

### Database — Agent tabele:

```sql
-- Chat sesije
agent_sessions
  id, project_id, session_token
  customer_name, customer_email  -- opciono, popuni se tokom razgovora
  lead_id (FK → leads, popuni se kad se lead kreira)
  started_at, last_message_at
  device_type, referrer

-- Chat poruke
agent_messages
  id, session_id
  role (user/assistant/system)
  content (text)
  rich_content (jsonb: kartice, renderi, actions)
  tool_calls (jsonb: koje toolove je agent koristio)
  tokens_used (input + output za cost tracking)
  created_at

-- Agent konfiguracija (per projekat)
agent_config
  id, project_id
  system_prompt (text: custom prompt za ovaj projekat)
  welcome_message
  quick_actions (jsonb: predefinisani brzi odgovori)
  tone (formal/casual/luxury)
  language (sr/en/de...)
  max_tokens_per_session
  enabled (boolean)
  model (sonnet/haiku — haiku za jeftinije, sonnet za bolje)

-- Knowledge base entries (za RAG nestrukturirane podatke)
knowledge_base
  id, project_id
  category (faq/location/selling_points/policies/custom)
  title, content (text)
  embedding (vector(1536))  -- pgvector za semantic search
  updated_at

-- Agent analitika
agent_analytics
  id, project_id, session_id
  event (session_start/message_sent/tool_used/lead_created/pdf_sent)
  metadata (jsonb)
  created_at
```

### System Prompt — Šablon:

```
Ti si ljubazan i profesionalan virtuelni konsultant za {project_name}.
Pomaže kupcima da pronađu savršen stan u {location}.

TVOJ KARAKTER:
- Ljubazan ali ne previše formalan
- Znaš SVE o projektu — nikad ne izmišljaš podatke
- Ako nešto ne znaš, reci "Provericu sa timom i javim vam"
- Cilj ti je da pomogneš kupcu, ne da forsiraš prodaju
- Koristi srpski jezik (ili jezik kupca)

PRAVILA:
- NIKAD ne izmišljaj podatke o stanovima, cenama ili materijalima
- Uvek koristi search_apartments tool za tačne podatke
- Kad kupac izrazi interes, predloži "Mogu da vam pošaljem ponudu na email"
- Ako kupac pita nešto van tvog domena, ljubazno preusmeri
- Ne pričaj o konkurenciji

ZNANJE O PROJEKTU:
{project_info}
{faq_entries}
{selling_points}
```

### Troškovi i optimizacija:

```
Strategija: Haiku za rutinu, Sonnet za kompleksne razgovore

1. FIRST MESSAGE → claude-haiku (jeftin, brz)
   - Pozdrav, jednostavna pitanja, FAQ

2. COMPLEX QUERIES → claude-sonnet (kvalitetniji)
   - Poređenje stanova, preporuke, pregovaranje
   - Auto-upgrade kad detektuje složenost

3. COST CONTROL:
   - Max 50 poruka po sesiji
   - Max tokens per session: 20K input + 5K output
   - Cache system prompt (Anthropic prompt caching)
   - Rate limit: 10 req/min per session
   - Monthly budget cap per project u admin settings

4. ESTIMATED COST:
   - Prosečna konverzacija: ~15 poruka = ~$0.02-0.05
   - 100 konverzacija/dan = ~$2-5/dan
   - Mesečno: $60-150 (uklopljeno u €300-500 pretplatu)
```

### Integracija sa postojećim flow-om:

```
Chat agent NIJE zamena za UI konfigurator — to su dva puta do istog cilja:

PUT 1: UI Konfigurator (klikanje)
  Zgrada → Sprat → Stan → Stil → Materijali → Renderi → Lead

PUT 2: AI Agent (konverzacija)
  Chat → Agent pronalazi stan → Pokazuje rendere → PDF → Lead

SINHRONIZACIJA:
- Ako kupac koristi UI pa otvori chat, agent ZNAŠ šta je izabrao
  (čita iz selection store)
- Ako kupac koristi chat i agent preporuči stan, UI se ažurira
  (agent piše u selection store)
- Lead se kreira na istom mestu, bez obzira na put
  (source: "web" vs "agent")
```

### Projekat folder — AI Agent fajlovi:

```
src/
├── components/
│   ├── buyer/
│   │   ├── AgentChat.svelte           # Chat widget UI
│   │   ├── AgentMessage.svelte        # Pojedinačna poruka
│   │   ├── AgentApartmentCard.svelte  # Stan kartica u chatu
│   │   ├── AgentRenderPreview.svelte  # Render preview u chatu
│   │   └── AgentQuickActions.svelte   # Brze akcije dugmad
│   │
│   └── admin/
│       ├── AgentConfig.svelte         # Konfiguracija agenta
│       ├── AgentConversations.svelte  # Pregled konverzacija
│       └── AgentAnalytics.svelte      # Agent statistika
│
├── lib/
│   ├── agent/
│   │   ├── client.ts                  # Chat client (WebSocket/SSE)
│   │   ├── types.ts                   # Agent tipovi
│   │   └── stores.ts                  # Chat state management
│   │
│   └── stores/
│       └── selection.ts               # ← Sinhronizacija sa agentom
│
supabase/
├── functions/
│   ├── agent-chat/                    # Edge function za chat
│   │   ├── index.ts                   # Main handler
│   │   ├── rag.ts                     # RAG retrieval
│   │   ├── tools.ts                   # Agent tools definicije
│   │   ├── prompt.ts                  # System prompt builder
│   │   └── pdf.ts                     # PDF generation
│   │
│   └── agent-embed/                   # Edge function za embedding
│       └── index.ts                   # Knowledge base embedding
│
├── migrations/
│   ├── 001_initial_schema.sql
│   ├── 002_agent_tables.sql           # Agent DB tabele
│   └── 003_pgvector_setup.sql         # pgvector extension + index
```

---

## Faze implementacije (7 nedelja: 23.feb — 10.apr)

### Faza 1: Temelj (Nedelja 1 — 23.feb - 1.mar)
- [x] Inicijalizacija projekta (Astro + Svelte + TypeScript)
- [ ] Design system — CSS variables, tipografija, komponente
- [ ] Base layout (Buyer + Admin)
- [ ] Supabase setup + initial schema
- [ ] Routing struktura
- [ ] Demo JSON podaci

### Faza 2: Kupac Flow — Statički (Nedelja 2-3 — 2-15.mar)
- [ ] Hero sekcija (sa mockup dizajnom)
- [ ] Building/Floor/Apartment selektor
- [ ] Style selector sa karticama
- [ ] Render galerija (placeholder slike)
- [ ] Lead forma (UI only)
- [ ] Responsive mobile layout
- [ ] Scroll animacije

### Faza 3: Render Engine (Nedelja 3-4 — 10-22.mar)
- [ ] Layer compositing engine (Canvas API)
- [ ] Sprite sheet loader
- [ ] Material swap sa crossfade
- [ ] CSS color grading per stil
- [ ] Hotspot sistem za detalje
- [ ] Performance optimizacija (lazy load, preload)

### Faza 4: Backend Integracija (Nedelja 4-5 — 17-29.mar)
- [ ] Supabase integracija — CRUD za stanove
- [ ] Lead submission flow
- [ ] Realtime status update
- [ ] PDF generacija
- [ ] Email notifikacije
- [ ] Auth za admin

### Faza 5: Admin Dashboard (Nedelja 5-6 — 24.mar - 5.apr)
- [ ] Lead management tabla
- [ ] Status stanova management
- [ ] Analitika osnovna
- [ ] Render upload
- [ ] Project settings

### Faza 6: AI Agent (Nedelja 6 — 31.mar - 5.apr)
- [ ] Supabase: agent tabele + pgvector setup
- [ ] Edge function: /agent-chat sa Claude API
- [ ] RAG pipeline: structured + semantic search
- [ ] Agent tools: search_apartments, get_renders, generate_pdf, send_email
- [ ] Chat UI: AgentChat.svelte (floating widget)
- [ ] Rich messages: apartment kartice, render preview u chatu
- [ ] Sinhronizacija sa UI selektorom (selection store)
- [ ] Admin: agent konfiguracija + pregled konverzacija

### Faza 7: Polish & PWA (Nedelja 7 — 5-10.apr)
- [ ] PWA manifest + service worker
- [ ] Offline support (cached renderi)
- [ ] Performance audit (Lighthouse 90+)
- [ ] Cross-browser testing
- [ ] Demo podaci za prezentaciju (realan scenario za pitchovanje)
- [ ] Deploy na Vercel
- [ ] Agent fine-tuning: system prompt, ton, quick actions

---

## Prvo što radimo DANAS:

1. `npm create astro@latest` — inicijalizacija
2. Svelte integration
3. CSS design system iz mockupa (varijable, tipografija, grain overlay)
4. Base layout sa navigacijom
5. Hero sekcija — pixel-perfect iz mockupa
6. Apartment selector — funkcionalan sa demo podacima

**Cilj za kraj dana: Kupac PWA landing stranica koja izgleda kao mockup, sa interaktivnim selektorima i demo podacima.**

---

## Rezime — Šta čini Gamma Renderus jedinstvenim:

```
1. VIZUELNI KVALITET — V-Ray renderi, ne AI slop, ne real-time 3D
2. LAYER COMPOSITING — Kupac menja materijale, vidi rezultat odmah
3. AI AGENT — Konverzacioni put do stana, kao lični konsultant
4. LEAD MACHINE — Svaka interakcija = lead sa kontekstom šta kupca zanima
5. PRISTUPAČNA CENA — €12-15K setup, ne €50-200K enterprise rešenje
6. PWA — Radi na telefonu, developer može dati link kupcu na licu mesta
```
