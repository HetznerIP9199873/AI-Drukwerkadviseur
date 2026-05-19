import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { KB_CONTEXT } from "@/lib/kb";

const QuoteSchema = z.object({
  product: z.string().min(1).max(100),
  finish: z.string().min(1).max(50),
  thicknessMm: z.number().min(0).max(100),
  widthCm: z.number().min(1).max(500),
  heightCm: z.number().min(1).max(500),
  quantity: z.number().int().min(1).max(10000),
  basePrice: z.number().min(0).max(1000),
  thicknessMultiplier: z.number().min(0.1).max(10),
  notes: z.string().max(500).optional(),
});

const QUOTE_SYSTEM_PROMPT =
  "Je bent de offerte-assistent van Unfold drukkerij in Haarlem. Schrijf bondig en professioneel in het Nederlands.";

export const Route = createFileRoute("/api/ai-quote")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const input = QuoteSchema.parse(body);

          const apiKey = process.env.ANTHROPIC_API_KEY;
          if (!apiKey) {
            return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY missing" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          const m2 = (input.widthCm * input.heightCm) / 10000;
          const unitPrice = input.basePrice * input.thicknessMultiplier * Math.max(m2, 0.5);
          let qtyDiscount = 0;
          if (input.quantity >= 50) qtyDiscount = 0.18;
          else if (input.quantity >= 20) qtyDiscount = 0.12;
          else if (input.quantity >= 10) qtyDiscount = 0.07;
          else if (input.quantity >= 5) qtyDiscount = 0.04;

          const subtotal = unitPrice * input.quantity * (1 - qtyDiscount);
          const setup = input.quantity < 5 ? 25 : 0;
          const total = subtotal + setup;

          const userPrompt = `Klant wil een offerte:
- Product: ${input.product}
- Afwerking: ${input.finish}
- Dikte: ${input.thicknessMm} mm
- Formaat: ${input.widthCm} × ${input.heightCm} cm (${m2.toFixed(2)} m²)
- Aantal: ${input.quantity} stuks
${input.notes ? `- Opmerkingen: ${input.notes}` : ""}

Berekende indicatieprijs: € ${total.toFixed(2)} excl. BTW
(stuksprijs € ${unitPrice.toFixed(2)}, korting ${(qtyDiscount * 100).toFixed(0)}%${setup > 0 ? `, setup € ${setup.toFixed(2)}` : ""})

Schrijf een korte, professionele onderbouwing (3-4 zinnen) van deze offerte. Leg kort uit hoe het formaat, de dikte en de oplage de prijs beïnvloeden. Sluit af met een vriendelijk advies of een tip (bv. over levertijd, afwerking, of dat de klant kan bellen voor maatwerk). Geen markdown opmaak, alleen vloeiende tekst.`;

          const client = new Anthropic({ apiKey });

          const message = await client.messages.create({
            model: "claude-sonnet-4-6",
            max_tokens: 512,
            // Cache het zware KB-blok zodat herhaalde offerte-aanvragen ~0.1x kosten.
            system: [
              { type: "text", text: QUOTE_SYSTEM_PROMPT },
              { type: "text", text: KB_CONTEXT, cache_control: { type: "ephemeral" } },
            ],
            messages: [{ role: "user", content: userPrompt }],
          });

          const explanation = message.content
            .filter((b): b is Anthropic.TextBlock => b.type === "text")
            .map((b) => b.text)
            .join("");

          return new Response(
            JSON.stringify({
              total,
              subtotal,
              unitPrice,
              setup,
              qtyDiscount,
              m2,
              explanation,
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        } catch (e) {
          if (e instanceof z.ZodError) {
            return new Response(JSON.stringify({ error: "invalid_input", details: e.errors }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }
          if (e instanceof Anthropic.RateLimitError) {
            return new Response(JSON.stringify({ error: "rate_limited" }), {
              status: 429,
              headers: { "Content-Type": "application/json" },
            });
          }
          if (e instanceof Anthropic.AuthenticationError) {
            return new Response(JSON.stringify({ error: "auth_error" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }
          if (e instanceof Anthropic.APIError) {
            console.error("ai-quote api error", e.status, e.message);
            return new Response(JSON.stringify({ error: "ai_gateway_error" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }
          console.error("ai-quote error", e);
          return new Response(JSON.stringify({ error: "unexpected" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
