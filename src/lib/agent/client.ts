import type { AgentIntent, ShowroomState } from '../types';

// For MVP: direct Claude API call from client
// In production: route through Supabase Edge Function
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export interface AgentResponse {
  intent: AgentIntent;
  responseText: string;
}

export async function sendMessage(
  message: string,
  state: ShowroomState,
  projectContext: {
    projectName: string;
    apartments: Array<{
      code: string;
      type: string;
      typeLabel: string;
      areaM2: number;
      priceEur: number;
      status: string;
      orientation?: string;
      floorId: string;
      rooms: number;
    }>;
  },
  apiKey: string
): Promise<AgentResponse> {
  const systemPrompt = buildSystemPrompt(state, projectContext);

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }],
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || '';

  return parseAgentResponse(text);
}

function buildSystemPrompt(
  state: ShowroomState,
  ctx: {
    projectName: string;
    apartments: Array<{
      code: string;
      type: string;
      typeLabel: string;
      areaM2: number;
      priceEur: number;
      status: string;
      orientation?: string;
      floorId: string;
      rooms: number;
    }>;
  }
): string {
  const availableApts = ctx.apartments.filter(a => a.status === 'available');
  const aptList = availableApts
    .map(a => `${a.code}: ${a.typeLabel}, ${a.areaM2}m², €${a.priceEur.toLocaleString('de-DE')}, sprat ${a.floorId.replace('floor-', '')}`)
    .join('\n');

  return `Ti si ljubazni vodič kroz showroom projekta "${ctx.projectName}".
Zamishi da si iskusan prodavac nekretnina — topao, profesionalan, ali opušten. Ne zvučiš kao robot.

TVOJE PONAŠANJE:
- Govori prirodno, kao da razgovaraš sa kupcem u showroom-u
- Kad korisnik tek dođe ili pita nešto opšte, SAM PONUDI da pokažeš nešto interesantno
- Kad pokažeš stan, dodaj detalj koji ga čini posebnim ("ugaoni stan sa pogledom", "najtraženija pozicija")
- Kad korisnik ne zna šta da traži, predloži: "Hajde da vam pokažem naš najpopularniji dvosoban?"
- Koristi kratke, tople rečenice. Max 2 rečenice u odgovoru.
- Govori srpski, ali prirodno — ne previše formalno

TRENUTNO STANJE:
- Prikaz: ${state.currentView}
- Fasada: ${state.currentFacade}
- Izabran stan: ${state.selectedApartmentId || 'nema'}
- Izabrana soba: ${state.selectedRoom || 'nema'}

SLOBODNI STANOVI:
${aptList}

FASADE (strane zgrade):
- A: Južna strana
- B: Zapadna strana
- C: Severna strana
- D: Istočna strana

ODGOVORI ISKLJUČIVO VALIDNIM JSON-om, bez ikakvog teksta pre ili posle:
{
  "intent": {
    "type": "<tip>",
    "params": { ... },
    "responseText": "<tvoj odgovor korisniku>",
    "confidence": <0.0-1.0>
  }
}

INTENTI:
- "rotate_building": params: { "direction": "next" | "prev" | "A" | "B" | "C" | "D" }
  Kad korisnik hoće drugu stranu zgrade, ili kad TI predlažeš da se pogleda nešto
- "show_apartment": params: { "apartmentCode": "<kod>" }
  Kad se traži konkretan stan. Ako korisnik pita za tip (npr. "dvosoban"), izaberi najbolji slobodan i ponudi ga
- "enter_apartment": params: {}
  Kad korisnik hoće da uđe u stan, vidi osnovu
- "show_room": params: { "room": "living" | "bedroom" | "kitchen" | "bathroom" }
  Kad korisnik hoće konkretnu sobu
- "go_back": params: {}
  Nazad, vrati se
- "list_available": params: { "filter": { "type": "...", "minArea": N, "maxPrice": N } }
  Kad pita šta ima slobodno
- "describe_element": params: { "element": "<opis>" }
  Kad pita šta vidi, opis prostora
- "general_info": params: { "topic": "<tema>" }
  Opšta pitanja o projektu

VAŽNO: Kad korisnik kaže nešto neodređeno kao "pokaži mi nešto", "šta ima?", "hajde" —
ti SAM izaberi nešto zanimljivo i pokaži. Ne pitaj, pokaži.`;
}

function parseAgentResponse(text: string): AgentResponse {
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found');

    const parsed = JSON.parse(jsonMatch[0]);
    const intent = parsed.intent || parsed;

    return {
      intent: {
        type: intent.type || 'general_info',
        params: intent.params || {},
        responseText: intent.responseText || '',
        confidence: intent.confidence || 0.5,
      },
      responseText: intent.responseText || '',
    };
  } catch {
    // Fallback: treat as general info
    return {
      intent: {
        type: 'general_info',
        params: { topic: 'unknown' },
        responseText: text.slice(0, 200),
        confidence: 0.3,
      },
      responseText: text.slice(0, 200),
    };
  }
}
