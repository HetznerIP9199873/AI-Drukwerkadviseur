import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Zap, Recycle, ShieldCheck, MessageSquare } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { useAiAdvisor } from "@/components/ai-advisor-provider";
import { MosaicMark } from "@/components/site-header";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { open } = useAiAdvisor();

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <BigMosaicBackground />
          <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-24 md:pt-24 md:pb-32">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink/5 border border-ink/10 text-xs font-medium text-ink mb-6">
                  <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                  Nieuw: AI-adviseur live
                </div>
                <h1 className="font-display font-bold text-ink leading-[0.92] tracking-tight text-balance text-[clamp(3rem,9vw,7.5rem)]">
                  Print op
                  <br />
                  echt <span className="relative inline-block">
                    <span className="relative z-10">álles</span>
                    <span className="absolute left-0 right-0 bottom-1 h-3 md:h-4 bg-primary -z-0 -skew-x-6" />
                  </span>.
                </h1>
                <p className="mt-8 text-lg md:text-xl text-ink-soft max-w-xl text-balance">
                  Van industriëel vloerzeil tot premium aluminium plaat, Unfold drukt
                  het in elke afwerking en op elk formaat. En onze AI-adviseur denkt
                  met je mee.
                </p>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Button
                    onClick={() => open()}
                    size="lg"
                    className="rounded-full text-base h-14 px-7 gap-2 bg-ink text-background hover:bg-ink/90"
                  >
                    <Sparkles className="size-5" />
                    Start AI-adviseur
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full text-base h-14 px-7"
                  >
                    <Link to="/$category" params={{ category: "plaatmateriaal" }}>
                      Bekijk producten
                      <ArrowRight className="size-5" />
                    </Link>
                  </Button>
                </div>

                <div className="mt-12 flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-primary" />
                    25+ jaar ervaring
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="size-4 text-primary" />
                    Levering binnen 48u
                  </div>
                  <div className="hidden md:flex items-center gap-2">
                    <Recycle className="size-4 text-primary" />
                    Lokaal & duurzaam
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 hidden lg:block">
                <HeroMosaicTilt />
              </div>
            </div>
          </div>
        </section>

        {/* Mosaic divider */}
        <div className="mosaic-band h-1.5" aria-hidden />

        {/* Categorieën */}
        <section className="relative bg-surface overflow-hidden">
          {/* Subtiele kleurrijke achtergrond-blobs */}
          <div className="absolute inset-0 -z-0 pointer-events-none" aria-hidden>
            <div
              className="absolute -top-32 left-1/4 size-[480px] rounded-full opacity-[0.10] blur-3xl"
              style={{ backgroundColor: "var(--mosaic-3)" }}
            />
            <div
              className="absolute top-1/3 -right-32 size-[420px] rounded-full opacity-[0.12] blur-3xl"
              style={{ backgroundColor: "var(--mosaic-4)" }}
            />
            <div
              className="absolute bottom-0 left-0 size-[380px] rounded-full opacity-[0.10] blur-3xl"
              style={{ backgroundColor: "var(--mosaic-5)" }}
            />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 py-24">
            <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <div>
                <p className="font-script text-2xl text-primary">wat we drukken</p>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mt-1">
                  Vijf werelden, één drukker.
                </h2>
              </div>
              <p className="text-ink-soft max-w-sm">
                Welk materiaal je ook nodig hebt wij hebben het, of we vinden het.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {CATEGORIES.map((cat, i) => {
                const c1 = (i % 6) + 1;
                const c2 = ((i + 2) % 6) + 1;
                return (
                  <Link
                    key={cat.slug}
                    to="/$category"
                    params={{ category: cat.slug }}
                    className="group relative rounded-3xl bg-card border border-border hover:border-ink hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Kleurrijke top-strook */}
                    <div
                      className="h-24 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, var(--mosaic-${c1}), var(--mosaic-${c2}))`,
                      }}
                    >
                      <div className="absolute inset-0 grid grid-cols-12 grid-rows-3 gap-[2px] p-1 opacity-40 mix-blend-overlay">
                        {Array.from({ length: 36 }).map((_, j) => (
                          <div
                            key={j}
                            className="rounded-[2px]"
                            style={{
                              backgroundColor: `var(--mosaic-${((j + i) % 6) + 1})`,
                              opacity: 0.3 + ((j * 3) % 6) * 0.12,
                            }}
                          />
                        ))}
                      </div>
                      <div className="absolute top-3 left-4 text-[11px] font-mono text-background/90 tracking-wider">
                        0{i + 1} / 0{CATEGORIES.length}
                      </div>
                    </div>

                    {/* Hover halo */}
                    <div
                      className="absolute -bottom-16 -right-16 size-44 rounded-full opacity-0 group-hover:opacity-25 transition-opacity duration-500 blur-2xl"
                      style={{ backgroundColor: `var(--mosaic-${c1})` }}
                    />

                    <div className="relative p-8 pt-6">
                      <h3 className="font-display text-3xl font-bold text-ink mb-2 group-hover:text-primary transition">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-ink-soft mb-8">{cat.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{cat.productCount} producten</span>
                        <ArrowRight className="size-5 text-ink group-hover:translate-x-1 group-hover:text-primary transition" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* AI Showcase */}
        <section className="relative bg-ink text-background overflow-hidden">
          <div className="absolute inset-0 opacity-[0.07]">
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
              {Array.from({ length: 144 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-background/20"
                  style={{
                    backgroundColor: i % 7 === 0 ? `var(--mosaic-${(i % 6) + 1})` : "transparent",
                  }}
                />
              ))}
            </div>
          </div>
          <div className="relative mx-auto max-w-7xl px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/10 text-xs font-medium mb-6">
                <Sparkles className="size-3.5 text-primary" />
                AI-functie
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
                Niet zeker welk materiaal je nodig hebt?
              </h2>
              <p className="font-script text-3xl text-primary mt-3">
                De AI denkt met je mee.
              </p>
              <p className="mt-6 text-background/70 text-lg leading-relaxed max-w-md">
                Beschrijf je project, een banner voor buiten, een vloersticker voor
                een beurs, geveldecoratie voor je winkel, en je krijgt direct een
                onderbouwd materiaaladvies.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  onClick={() => open()}
                  size="lg"
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-14 px-7 text-base"
                >
                  <MessageSquare className="size-5" />
                  Probeer de adviseur
                </Button>
              </div>
            </div>

            <div className="bg-surface text-ink rounded-3xl p-6 shadow-2xl shadow-black/40">
              <div className="flex items-center gap-2 pb-4 border-b border-border">
                <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="size-4" />
                </span>
                <div className="text-sm">
                  <div className="font-semibold">Unfold AI-adviseur</div>
                  <div className="text-xs text-muted-foreground">live demo</div>
                </div>
              </div>
              <div className="space-y-3 py-5 text-sm">
                <div className="bg-ink text-background rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[85%] ml-auto">
                  Buitenbanner van 4m, moet 3 maanden mee
                </div>
                <div className="bg-surface-2 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[90%]">
                  Voor 3 maanden buiten op 4m raad ik <strong>Frontlit 510</strong> aan:
                  UV-bestendig, weersbestendig en betaalbaar. Met messing ringen kan je 'm
                  strak ophangen.
                  <br /><br />
                  <span className="text-muted-foreground">Wil je een offerte-indicatie?</span>
                </div>
              </div>
              <Button
                onClick={() => open()}
                variant="outline"
                className="w-full rounded-full mt-2"
              >
                Open de adviseur →
              </Button>
            </div>
          </div>
        </section>

        {/* Showcase */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="font-script text-2xl text-primary">in het wild</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mt-1">
                Voor wie wij printen.
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {["Festivals", "Beurzen", "Retail", "Evenementen", "Bouw", "Musea"].map((t, i) => (
              <div
                key={t}
                className="aspect-square rounded-2xl p-5 flex items-end relative overflow-hidden group cursor-default"
                style={{
                  background: `linear-gradient(135deg, var(--mosaic-${(i % 6) + 1}), var(--mosaic-${((i + 3) % 6) + 1}))`,
                }}
              >
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition" />
                <span className="relative font-display font-bold text-xl text-background drop-shadow-md">
                  {t}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured products */}
        <section className="bg-surface border-y border-border">
          <div className="mx-auto max-w-7xl px-6 py-24">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
                Populaire producten
              </h2>
              <Link
                to="/$category"
                params={{ category: "plaatmateriaal" }}
                className="text-sm font-medium text-ink hover:text-primary transition inline-flex items-center gap-1"
              >
                Alles bekijken <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PRODUCTS.slice(0, 4).map((p, i) => (
                <Link
                  key={p.slug}
                  to="/$category/$product"
                  params={{ category: p.category, product: p.slug }}
                  className="group rounded-2xl bg-card border border-border p-5 hover:border-ink hover:-translate-y-1 hover:shadow-xl transition-all"
                >
                  <div
                    className="aspect-[5/4] rounded-xl mb-4 relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, var(--mosaic-${(i % 6) + 1}), var(--mosaic-${((i + 2) % 6) + 1}))`,
                    }}
                  >
                    <div className="absolute inset-4 bg-card rounded-md shadow-lg rotate-[-2deg] group-hover:rotate-0 transition-transform duration-500" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-ink group-hover:text-primary transition">
                    {p.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {p.tags.slice(0, 2).join(" · ")}
                  </p>
                  <div className="text-sm text-ink mt-3 font-medium">
                    vanaf € {p.basePrice.toFixed(2)} <span className="text-muted-foreground font-normal">/ m²</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Wederverkopers */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="rounded-3xl bg-card border border-border p-10 md:p-16 grid lg:grid-cols-2 gap-10 items-center overflow-hidden relative">
            <div
              className="absolute -right-20 -top-20 size-72 rounded-full opacity-20 blur-3xl"
              style={{ backgroundColor: "var(--mosaic-1)" }}
            />
            <div className="relative">
              <p className="font-script text-2xl text-primary mb-2">wederverkopers</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-ink leading-tight">
                Druk je veel?
                <br />
                Praat met ons.
              </h2>
              <p className="text-ink-soft mt-5 max-w-md">
                Bureaus, signmakers, eventbouwers, als wederverkoper krijg je
                scherpe staffels, een vaste contactpersoon en prioriteit in de
                planning.
              </p>
              <Button size="lg" className="mt-8 rounded-full bg-ink text-background hover:bg-ink/90">
                Neem contact op
              </Button>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl bg-ink overflow-hidden">
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-6 gap-1 p-2 opacity-90">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-sm"
                    style={{
                      backgroundColor: `var(--mosaic-${(i % 6) + 1})`,
                      opacity: 0.3 + (i % 5) * 0.15,
                    }}
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-background/95 backdrop-blur px-8 py-6 rounded-2xl shadow-2xl text-center">
                  <div className="font-script text-3xl text-primary">Unfold</div>
                  <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                    print op echt álles
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function BigMosaicBackground() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      <div
        className="absolute -top-40 -right-40 size-[600px] rounded-full opacity-[0.10] blur-3xl"
        style={{ backgroundColor: "var(--mosaic-1)" }}
      />
      <div
        className="absolute top-40 -left-40 size-[500px] rounded-full opacity-[0.09] blur-3xl"
        style={{ backgroundColor: "var(--mosaic-5)" }}
      />
      <div
        className="absolute bottom-0 left-1/3 size-[420px] rounded-full opacity-[0.08] blur-3xl"
        style={{ backgroundColor: "var(--mosaic-3)" }}
      />
      <div
        className="absolute top-1/2 right-1/4 size-[300px] rounded-full opacity-[0.07] blur-3xl"
        style={{ backgroundColor: "var(--mosaic-4)" }}
      />
    </div>
  );
}

function HeroMosaicTilt() {
  return (
    <div
      className="relative aspect-square w-full"
      style={{ perspective: "1200px" }}
    >
      <div
        className="absolute inset-6 rounded-3xl shadow-2xl shadow-ink/20 overflow-hidden"
        style={{
          transform: "rotateY(-12deg) rotateX(8deg) rotateZ(-3deg)",
        }}
      >
        <div className="grid grid-cols-10 grid-rows-10 gap-[2px] bg-ink p-1 size-full">
          {Array.from({ length: 100 }).map((_, i) => {
            const colorIdx = (i * 7 + (i % 6)) % 6;
            const opacity = 0.4 + ((i * 3) % 6) * 0.1;
            return (
              <div
                key={i}
                className="rounded-[2px]"
                style={{
                  backgroundColor: `var(--mosaic-${colorIdx + 1})`,
                  opacity,
                }}
              />
            );
          })}
        </div>
      </div>
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-background border border-border px-5 py-3 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center gap-2">
          <MosaicMark className="size-6" />
          <span className="font-script text-xl text-ink">Unfold print op álles</span>
        </div>
      </div>
    </div>
  );
}
