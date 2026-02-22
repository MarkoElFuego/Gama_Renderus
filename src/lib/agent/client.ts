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

  return `Ti si AI agent za projekat "${ctx.projectName}" — luksuzni stambeni kompleks.
Pomažeš korisnicima da razgledaju zgradu i stanove kroz interaktivni showroom.

TRENUTNO STANJE:
- Prikaz: ${state.currentView}
- Fasada: ${state.currentFacade}
- Izabran stan: ${state.selectedApartmentId || 'nema'}
- Izabrana soba: ${state.selectedRoom || 'nema'}

SLOBODNI STANOVI:
${aptList}

FASADE:
- A: Južna (S, SW orijentacija)
- B: Zapadna (W, NW orijentacija)
- C: Severna (N, NE orijentacija)
- D: Istočna (E, SE orijentacija)

TVOJ ODGOVOR mora biti JSON u sledećem formatu (NIKAD ne dodaji tekst pre ili posle JSON-a):
{
  "intent": {
    "type": "<tip_intenta>",
    "params": { ... },
    "responseText": "<kratak odgovor za korisnika na srpskom, max 2 rečenice>",
    "confidence": <0.0-1.0>
  }
}

DOZVOLJENI TIPOVI INTENTA:
- "rotate_building": params: { "direction": "next" | "prev" | "A" | "B" | "C" | "D" }
  Koristi kad korisnik kaže: rotiraj, okreni, pokaži drugu stranu, pokaži fasadu B
- "show_apartment": params: { "apartmentCode": "<kod stana>" }
  Koristi kad korisnik kaže: pokaži stan A2, koji je stan 14, imam pitanje o PH1
- "enter_apartment": params: {}
  Koristi kad korisnik kaže: uđi, uđi u stan, pokaži osnovu
- "show_room": params: { "room": "living" | "bedroom" | "kitchen" | "bathroom" }
  Koristi kad korisnik kaže: pokaži kuhinju, uđi u dnevnu sobu, pokaži kupatilo
- "go_back": params: {}
  Koristi kad korisnik kaže: nazad, vrati se, izađi
- "list_available": params: { "filter": { "type": "...", "minArea": N, "maxPrice": N } }
  Koristi kad korisnik kaže: koji stanovi su slobodni, šta ima do 100k, dvosobni
- "describe_element": params: { "element": "<opis>" }
  Koristi kad korisnik pita: šta je ovo, opisi, detalji
- "general_info": params: { "topic": "<tema>" }
  Koristi za opšta pitanja: lokacija, parking, rok useljenja, cene

Budi kratak i konkretan. Govori kao profesionalni vodič kroz showroom.`;
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
