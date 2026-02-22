// Supabase Edge Function for AI Agent
// Deploy: supabase functions deploy agent
// For MVP, the client calls Claude API directly.
// This edge function is prepared for production use.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

serve(async (req: Request) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const { message, context, projectInfo } = await req.json();

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: buildSystemPrompt(context, projectInfo),
        messages: [{ role: 'user', content: message }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    return new Response(text, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

function buildSystemPrompt(context: any, projectInfo: any): string {
  return `Ti si AI agent za projekat "${projectInfo.projectName}".
Odgovori JSON formatom sa intent tipom i responseText.
Trenutno stanje: ${JSON.stringify(context)}
Stanovi: ${JSON.stringify(projectInfo.apartments?.slice(0, 20))}`;
}
