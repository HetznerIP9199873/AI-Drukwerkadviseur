import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { getCategory, getCategoryProducts, CATEGORIES } from "@/lib/products";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAiAdvisor } from "@/components/ai-advisor-provider";

export const Route = createFileRoute("/$category")({
  loader: ({ params }) => {
    const cat = getCategory(params.category);
    if (!cat) throw notFound();
    return { category: cat, products: getCategoryProducts(cat.slug) };
  },
  head: ({ loaderData }) => {
    const cat = loaderData?.category;
    if (!cat) return { meta: [] };
    return {
      meta: [
        { title: `${cat.name} — Unfold` },
        { name: "description", content: cat.description },
        { property: "og:title", content: `${cat.name} — Unfold` },
        { property: "og:description", content: cat.description },
      ],
    };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="flex-1 flex items-center justify-center px-6 text-center">
        <div>
          <h1 className="font-display text-4xl mb-3">Categorie niet gevonden</h1>
          <Link to="/" className="text-primary underline">Terug naar home</Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  ),
});

function CategoryPage() {
  const { category, products } = Route.useLoaderData();
  const { open } = useAiAdvisor();

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Breadcrumb + hero */}
        <section className="bg-surface border-b border-border">
          <div className="mx-auto max-w-7xl px-6 pt-12 pb-16">
            <nav className="text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-ink">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-ink">{category.name}</span>
            </nav>
            <div className="grid md:grid-cols-12 gap-10 items-end">
              <div className="md:col-span-8">
                <p className="font-script text-2xl text-primary mb-2">
                  {category.tagline}
                </p>
                <h1 className="font-display text-5xl md:text-7xl font-bold text-ink leading-[0.95] tracking-tight">
                  {category.name}.
                </h1>
                <p className="text-lg text-ink-soft mt-6 max-w-xl text-balance">
                  {category.description}
                </p>
              </div>
              <div className="md:col-span-4 md:text-right">
                <Button
                  onClick={() => open(`Ik zoek advies voor ${category.name.toLowerCase()}.`)}
                  size="lg"
                  className="rounded-full gap-2 bg-ink text-background hover:bg-ink/90"
                >
                  <Sparkles className="size-4" />
                  Vraag de AI-adviseur
                </Button>
              </div>
            </div>
          </div>
          <div className="mosaic-band h-1.5" aria-hidden />
        </section>

        {/* Filters (visueel) */}
        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-7xl px-6 py-6 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-2">
              Filter
            </span>
            {["Buiten", "Binnen", "Duurzaam", "Premium", "Tijdelijk"].map((f) => (
              <button
                key={f}
                className="px-4 py-1.5 text-sm rounded-full border border-border hover:border-ink hover:bg-surface-2 transition"
              >
                {f}
              </button>
            ))}
          </div>
        </section>

        {/* Products grid */}
        {products.length > 0 ? (
          <section className="mx-auto max-w-7xl px-6 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <Link
                  key={p.slug}
                  to="/$category/$product"
                  params={{ category: category.slug, product: p.slug }}
                  className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-ink hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <ProductVisual seed={p.slug} />
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-display text-2xl font-bold text-ink group-hover:text-primary transition">
                        {p.name}
                      </h3>
                      <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition" />
                    </div>
                    <p className="text-sm text-ink-soft line-clamp-2 mb-4">
                      {p.shortDescription}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.tags.slice(0, 3).map((t) => (
                        <Badge key={t} variant="secondary" className="rounded-full font-normal text-[11px]">
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-baseline justify-between pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground">vanaf</span>
                      <span className="font-display text-lg font-semibold text-ink">
                        € {p.basePrice.toFixed(2)}
                        <span className="text-xs text-muted-foreground font-normal"> / m²</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : (
          <section className="mx-auto max-w-7xl px-6 py-24 text-center">
            <Badge variant="secondary" className="mb-6">In aanbouw</Badge>
            <h2 className="font-display text-3xl font-bold text-ink mb-3">
              Deze categorie wordt binnenkort uitgewerkt
            </h2>
            <p className="text-ink-soft max-w-md mx-auto">
              In de volledige site krijgt {category.name.toLowerCase()} hetzelfde
              uitgebreide overzicht als Plaatmateriaal.
            </p>
            <Button asChild className="mt-8 rounded-full" size="lg">
              <Link to="/$category" params={{ category: "plaatmateriaal" }}>
                Bekijk plaatmateriaal
              </Link>
            </Button>
          </section>
        )}

        {/* Cross-sell andere categorieën */}
        <section className="border-t border-border bg-surface mt-12">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <h3 className="font-display text-2xl font-bold text-ink mb-6">
              Ook interessant
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
                <Link
                  key={c.slug}
                  to="/$category"
                  params={{ category: c.slug }}
                  className="rounded-xl border border-border bg-card p-5 hover:border-ink transition group"
                >
                  <div className="font-display font-semibold text-ink group-hover:text-primary transition">
                    {c.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {c.tagline}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function ProductVisual({ seed }: { seed: string }) {
  // Hash voor kleurkeuze
  const hash = Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0);
  const palette = [
    ["var(--mosaic-1)", "var(--mosaic-2)"],
    ["var(--mosaic-5)", "var(--mosaic-6)"],
    ["var(--mosaic-3)", "var(--mosaic-4)"],
    ["var(--mosaic-2)", "var(--mosaic-3)"],
    ["var(--mosaic-4)", "var(--mosaic-5)"],
    ["var(--mosaic-6)", "var(--mosaic-1)"],
  ];
  const [c1, c2] = palette[hash % palette.length];

  return (
    <div className="relative aspect-[4/3] bg-surface-2 overflow-hidden">
      <div
        className="absolute inset-6 rounded-xl shadow-2xl rotate-[-3deg] group-hover:rotate-[-1deg] transition-transform duration-500"
        style={{
          background: `linear-gradient(135deg, ${c1}, ${c2})`,
        }}
      />
      <div
        className="absolute inset-10 rounded-xl bg-card shadow-2xl rotate-[2deg] group-hover:rotate-[0deg] transition-transform duration-500"
      />
      <div
        className="absolute bottom-4 right-4 size-12 grid grid-cols-3 grid-rows-3 gap-[1px] rounded overflow-hidden opacity-90"
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: `var(--mosaic-${((hash + i) % 6) + 1})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
