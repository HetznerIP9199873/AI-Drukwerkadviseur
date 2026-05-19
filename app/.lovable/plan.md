
# Unfold — Moderne Website Mockup

Een verfijnde, moderne herinterpretatie van de huidige Unfold-site (deprintproductie.nl), met de payoff *"Unfold print op echt álles!"* als rode draad. Het wordt een pitch-klare mockup met twee werkende AI-demo's om de potentiële klant te overtuigen.

## Pagina's (3 totaal)

1. **Home** (`/`) — landingspagina die de "extra mile"-belofte uitstraalt
2. **Categorie: Plaatmateriaal** (`/plaatmateriaal`) — overzichtspagina met alle materialen
3. **Productdetail: Dibond** (`/plaatmateriaal/dibond`) — volledig productscherm met variabelen-configurator

Bovenin de header zit ook navigatie naar de andere categorieën (Zelfklevend, Print Media, Displays, Accessoires) — die werken in de mockup als "preview" (dezelfde categoriepagina-template, maar met placeholder-content) zodat de klant ziet hoe de structuur opschaalt.

## Visuele richting

Verfijnde evolutie van de huidige huisstijl, niet een kopie:

- **Kleuren**: wit/off-white als basis, diep antraciet voor typografie, één signaalkleur (warm rood-oranje, geïnspireerd op de logo-mozaïek) voor CTA's en accenten. De kleurrijke pixel-mozaïek uit het logo komt subtiel terug als hero-element en als visuele scheidingsband — niet meer als platte gekleurde balk in de footer.
- **Typografie**: moderne sans-serif (display + body), grote koppen, veel witruimte. De handgeschreven payoff blijft als signature-element op een paar plekken zichtbaar.
- **Geel uit de huidige top-bar verdwijnt** — vervangen door een rustige, donkere accent-strip met "Aanleverspecificaties" link.
- **Gevoel**: magazine-achtig + tech, voelt als een hedendaagse premium drukkerij — niet als jaren-2010 webshop.

## Home pagina

```text
┌────────────────────────────────────────┐
│  [Logo]   Plaat | Zelfkl | Print | …   │  Sticky header, transparant op hero
├────────────────────────────────────────┤
│                                        │
│   PRINT OP                             │  Hero: massive type
│   ECHT ÁLLES.                          │  rechts: animated mozaïek
│                                        │  van 25+ materialen
│   [Start AI-adviseur →]  [Bekijk werk] │
│                                        │
├────────────────────────────────────────┤
│  Logos / klant-strip                   │
├────────────────────────────────────────┤
│  5 categorieën als grote visuele tiles │
│  (Plaat / Zelfkl / Print / Displ / Acc)│
├────────────────────────────────────────┤
│  ✦ AI-adviseur (live demo, embedded)   │  Werkende chatbot in hero-card
├────────────────────────────────────────┤
│  "Wat we printen" — showcase grid      │
│  (festivals, retail, beurzen, …)       │
├────────────────────────────────────────┤
│  Wederverkopers-blok (verfijnd)        │
├────────────────────────────────────────┤
│  Footer (donker, mozaïek-detail)       │
└────────────────────────────────────────┘
```

## Categoriepagina (Plaatmateriaal)

Modern grid met alle materialen (Dibond, Forex, Papier en Karton, Polypropyleen, Stadur, Trespa). Elke kaart toont: foto, korte eigenschappen-tags (bv. "Aluminium • Buiten • Stevig"), prijs vanaf, hover → zachte zoom + "Configureer →".

Bovenaan: filterchips (Binnen/Buiten, Materiaal, Dikte) — visueel, niet functioneel in de mockup behalve voor het tonen van interactie.

## Productpagina (Dibond) — kern van de demo

```text
┌──────────────┬─────────────────────────┐
│              │  Dibond                 │
│  [Groot      │  Aluminium sandwich…    │
│   product-   │                         │
│   beeld +    │  Afwerking:  [Mat][Glans]│
│   gallery]   │  Dikte:      [2|3|4|6mm]│
│              │  Formaat:    [breedte]  │
│              │              [hoogte]   │
│              │  Aantal:     [─ 1 +]    │
│              │                         │
│              │  Prijs: € 47,50 excl.   │
│              │  [Vraag offerte aan →]  │
│              │  [Vraag de AI-adviseur] │
└──────────────┴─────────────────────────┘
   Tabs: Specs | Aanlever | Toepassingen
```

Variabelen worden visueel getoond (mat vs glans als swatch, dikte als segmented control). Prijs werkt live mee in de mockup met een eenvoudige formule.

## AI-functionaliteit (werkend, via Lovable AI)

**1. Slimme materiaal-adviseur (chatbot)**
Beschikbaar als embedded card op de home én als floating button site-breed. De gebruiker beschrijft een project ("Ik zoek iets voor een buitenbanner van 4 meter dat een zomer mee moet"), de AI:
- stelt verhelderende vragen (binnen/buiten, levensduur, budget)
- adviseert concreet 1–3 materialen uit het Unfold-assortiment
- legt uit waarom (bv. "Frontlit 510 is UV-bestendig en geschikt voor 6+ maanden buitengebruik")
- linkt door naar de juiste productpagina

Gestreamd antwoord (token-by-token) zodat het premium aanvoelt. Systeemprompt kent het volledige Unfold-assortiment.

**2. Instant offerte-generator**
Op de productpagina én via een eigen knop in de header. Gebruiker geeft:
- materiaal + variabelen (vooringevuld vanaf productpagina)
- aantal, gewenste leverdatum, eventuele afwerking
- optioneel: contactgegevens

AI berekent een indicatieve prijs, geeft een onderbouwing (materiaalkost, formaat-impact, oplage-korting) en biedt aan om te mailen naar Unfold. Resultaat verschijnt als een nette "offerte-kaart" op het scherm.

Beide draaien via één edge function (`/api/ai`) met Lovable AI Gateway, model `google/gemini-3-flash-preview`. 429/402-errors worden netjes opgevangen met een toast.

## Technische details

- TanStack Start + Tailwind v4, gebruik makend van bestaande shadcn componenten (button, card, dialog, input, tabs, sheet voor de chat-drawer)
- Routes: `src/routes/index.tsx`, `src/routes/plaatmateriaal.tsx`, `src/routes/plaatmateriaal.dibond.tsx`, plus stub-routes voor de andere 4 categorieën
- Gedeelde `<SiteHeader>` en `<SiteFooter>` componenten in `src/components/`
- AI streaming via `src/routes/api/ai.ts` server route, Lovable Cloud automatisch enabled (geen setup nodig van klant)
- Logo + mozaïek-asset uit de upload kopiëren naar `src/assets/`
- Per route eigen `head()` met titel + OG-tags
- Geen database nodig voor de mockup (alle productdata in een typed constants-bestand)

## Wat nog NIET in de mockup zit (bewust)

- Echte winkelwagen / checkout / betalen
- Account / login (visueel wel zichtbaar in header, maar niet functioneel)
- Backoffice / orderbeheer
- De andere 4 categorieën volledig uitgewerkt — alleen template + placeholder

Dit alles kan in fase 2 worden toegevoegd zodra de klant akkoord is.
