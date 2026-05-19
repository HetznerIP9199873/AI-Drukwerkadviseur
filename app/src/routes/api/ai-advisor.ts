import { createFileRoute } from "@tanstack/react-router";
import Anthropic from "@anthropic-ai/sdk";
import { KB_CONTEXT } from "@/lib/kb";

const SYSTEM_PROMPT = `Je bent de Unfold AI-adviseur. Unfold is een Nederlandse drukkerij in Haarlem met de payoff "Unfold print op echt álles!". Je adviseert klanten over welk materiaal en welke afwerking het best past bij hun project.

Je toon: vriendelijk, concreet, vakkundig, alsof een ervaren productiemanager meedenkt. Schrijf in gewoon, vloeiend Nederlands. Korte alinea's. Stel hooguit één korte vervolgvraag als belangrijke info ontbreekt (bv. binnen of buiten, hoe lang het mee moet gaan, oplage).

Schrijfstijl, strikt:
- Geen em dashes (—). Gebruik komma's, dubbele punten, haakjes of een nieuwe zin.
- Geen markdown opmaak: geen asterisken voor nadruk (*tekst*, **tekst**, ***tekst***), geen kop-tekens (#, ##, ###), geen horizontale lijnen (---, ***).
- Een opsomming is OK met simpele streepjes (- item), maar overdrijf niet, geef de voorkeur aan vloeiende zinnen.
- Geen emoji.

Het Unfold assortiment:

PLAATMATERIAAL:
- Dibond, aluminium sandwich, vlak, 10+ jaar buiten, voor gevelreclame en signage. Vanaf €47,50/m².
- Forex, PVC-hardschuim, licht, vooral binnen, beurzen en POS. Vanaf €32/m².
- Papier en Karton, honingraatkarton, 100% recyclebaar, voor displays en tijdelijke decoratie. Vanaf €24/m².
- Polypropyleen, holle PP-plaat, waterdicht, 1-2 jaar buiten, verkiezingsborden en bouwhekdoek. Vanaf €18/m².
- Stadur, aluminium-PU sandwich, ultra premium, 15+ jaar buiten. Vanaf €68/m².
- Trespa, HPL, onverwoestbaar, 20+ jaar buiten, gevelbekleding. Vanaf €89/m².

ZELFKLEVEND: Vinyl, raamfolie, vloerstickers, autobelettering. 9 producten.
PRINT MEDIA: Frontlit 510 (banner buiten), Backlit (lichtbakken), Mesh (windbestendig), Airtex (vlaggenstof), Posterpapier, Roll-up banner, Synaps, Pop Up Media, Transfers, Vloerzeil. Voor banners, doek, posters.
DISPLAYS: Roll-ups, beachflags, pop-up walls. 8 producten.
ACCESSOIRES: Ophangsystemen, ringen, koorden, lijmen. 12 producten.

Belangrijk:
- Adviseer concreet 1-3 producten met onderbouwing waarom (eigenschappen, levensduur, kosten-niveau).
- Wees eerlijk als je iets niet zeker weet, verwijs dan naar info@unfold.nu of 023-5290308.
- Sluit af met een korte uitnodiging: "Wil je hiervoor een offerte-indicatie? Klik op een productkaart of typ 'offerte voor [product]'."
- Antwoord in het Nederlands, tenzij de klant duidelijk een andere taal gebruikt.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

function withCors(headers: Record<string, string>): Record<string, string> {
  return { ...CORS_HEADERS, ...headers };
}

export const Route = createFileRoute("/api/ai-advisor")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS_HEADERS }),
      POST: async ({ request }) => {
        try {
          const { messages } = (await request.json()) as { messages: ChatMessage[] };

          if (!Array.isArray(messages) || messages.length === 0) {
            return new Response(JSON.stringify({ error: "messages required" }), {
              status: 400,
              headers: withCors({ "Content-Type": "application/json" }),
            });
          }

          const apiKey = process.env.ANTHROPIC_API_KEY;
          if (!apiKey) {
            return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY missing" }), {
              status: 500,
              headers: withCors({ "Content-Type": "application/json" }),
            });
          }

          const client = new Anthropic({ apiKey });

          const claudeMessages: Anthropic.MessageParam[] = messages.slice(-12).map((m) => ({
            role: m.role,
            content: m.content,
          }));

          const stream = client.messages.stream({
            model: "claude-sonnet-4-6",
            max_tokens: 2048,
            // Twee system-blokken: Unfold-specifieke instructie eerst, daarna industriebrede KB.
            // cache_control op het laatste blok cachet het hele system-prefix (~14k tokens),
            // wat na de eerste request ~0.1x kost in plaats van vol tarief.
            system: [
              { type: "text", text: SYSTEM_PROMPT },
              { type: "text", text: KB_CONTEXT, cache_control: { type: "ephemeral" } },
            ],
            messages: claudeMessages,
          });

          // Vertaal Anthropic stream naar OpenAI/Lovable SSE-format dat de bestaande frontend
          // (ai-advisor-drawer.tsx) verwacht: `data: {choices:[{delta:{content:"..."}}]}`
          const encoder = new TextEncoder();
          const sse = new ReadableStream<Uint8Array>({
            async start(controller) {
              try {
                stream.on("text", (delta) => {
                  const payload = JSON.stringify({ choices: [{ delta: { content: delta } }] });
                  controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
                });
                await stream.finalMessage();
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                controller.close();
              } catch (err) {
                console.error("ai-advisor stream error", err);
                try {
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                } catch {}
                controller.close();
              }
            },
            cancel() {
              stream.controller.abort();
            },
          });

          return new Response(sse, {
            headers: withCors({
              "Content-Type": "text/event-stream; charset=utf-8",
              "Cache-Control": "no-cache, no-transform",
              "X-Accel-Buffering": "no",
            }),
          });
        } catch (e) {
          if (e instanceof Anthropic.RateLimitError) {
            return new Response(JSON.stringify({ error: "rate_limited" }), {
              status: 429,
              headers: withCors({ "Content-Type": "application/json" }),
            });
          }
          if (e instanceof Anthropic.AuthenticationError) {
            return new Response(JSON.stringify({ error: "auth_error" }), {
              status: 500,
              headers: withCors({ "Content-Type": "application/json" }),
            });
          }
          if (e instanceof Anthropic.APIError) {
            console.error("ai-advisor api error", e.status, e.message);
            return new Response(JSON.stringify({ error: "ai_gateway_error" }), {
              status: 500,
              headers: withCors({ "Content-Type": "application/json" }),
            });
          }
          console.error("ai-advisor error", e);
          return new Response(JSON.stringify({ error: "unexpected" }), {
            status: 500,
            headers: withCors({ "Content-Type": "application/json" }),
          });
        }
      },
    },
  },
});
