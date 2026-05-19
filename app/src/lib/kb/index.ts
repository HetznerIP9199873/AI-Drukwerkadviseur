import materialen from "./materialen.json";
import technieken from "./technieken.json";
import reasoning from "./reasoning.json";
import decisionLogic from "./decision-logic.json";

// Industriebrede drukwerk-kennisbank, gebruikt als referentie naast de Unfold-specifieke
// productcatalogus in de system prompt. Komt na de Unfold-prompt zodat productadvies
// primair uit Unfold's eigen assortiment komt, maar de adviseur kan terugvallen op
// materiaal/techniek/reasoning kennis voor onderbouwing.
export const KB_CONTEXT = `# Aanvullende drukwerk-kennisbank (industriebreed, ter onderbouwing van advies)

## Materialen (eigenschappen, geschiktheid, levensduur)
\`\`\`json
${JSON.stringify(materialen)}
\`\`\`

## Druktechnieken
\`\`\`json
${JSON.stringify(technieken)}
\`\`\`

## Beslissingslogica
\`\`\`json
${JSON.stringify(decisionLogic)}
\`\`\`

## Beoordelingsfactoren en reasoning frameworks
\`\`\`json
${JSON.stringify(reasoning)}
\`\`\`

Gebruik deze aanvullende kennis om je advies vakkundig te onderbouwen (waarom past X bij situatie Y), maar adviseer altijd primair vanuit het Unfold-assortiment hierboven.`;
