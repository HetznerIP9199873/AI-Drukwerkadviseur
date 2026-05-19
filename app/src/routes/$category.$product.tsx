import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Loader2, Sparkles, Check, ArrowLeft } from "lucide-react";
import { getCategory, getProduct, PRODUCTS } from "@/lib/products";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAiAdvisor } from "@/components/ai-advisor-provider";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/$category/$product")({
  loader: ({ params }) => {
    const cat = getCategory(params.category);
    const prod = getProduct(params.product);
    if (!cat || !prod || prod.category !== cat.slug) throw notFound();
    return { category: cat, product: prod };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return { meta: [] };
    return {
      meta: [
        { title: `${p.name} drukken — Unfold` },
        { name: "description", content: p.shortDescription },
        { property: "og:title", content: `${p.name} drukken — Unfold` },
        { property: "og:description", content: p.shortDescription },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="flex-1 flex items-center justify-center px-6 text-center">
        <div>
          <h1 className="font-display text-4xl mb-3">Product niet gevonden</h1>
          <Link to="/" className="text-primary underline">Terug naar home</Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  ),
});

function ProductPage() {
  const { category, product } = Route.useLoaderData();
  const { open: openAdvisor } = useAiAdvisor();

  const [finish, setFinish] = useState(product.finishes[0].value);
  const [thickness, setThickness] = useState(product.thicknesses[0]);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(70);
  const [quantity, setQuantity] = useState(1);
  const [quoteOpen, setQuoteOpen] = useState(false);

  const m2 = useMemo(() => (width * height) / 10000, [width, height]);
  const unitPrice = useMemo(
    () => product.basePrice * thickness.multiplier * Math.max(m2, 0.5),
    [product.basePrice, thickness.multiplier, m2],
  );
  const qtyDiscount = useMemo(() => {
    if (quantity >= 50) return 0.18;
    if (quantity >= 20) return 0.12;
    if (quantity >= 10) return 0.07;
    if (quantity >= 5) return 0.04;
    return 0;
  }, [quantity]);
  const total = unitPrice * quantity * (1 - qtyDiscount);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 pt-8 pb-4">
          <Link
            to="/$category"
            params={{ category: category.slug }}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-ink"
          >
            <ArrowLeft className="size-4" />
            Terug naar {category.name}
          </Link>
        </div>

        <section className="mx-auto max-w-7xl px-6 pb-16 grid lg:grid-cols-12 gap-10">
          {/* Visual */}
          <div className="lg:col-span-7">
            <ProductHeroVisual finish={finish} thicknessMm={thickness.value} />
            <div className="grid grid-cols-4 gap-3 mt-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "aspect-square rounded-lg border-2 cursor-pointer overflow-hidden bg-surface-2",
                    i === 0 ? "border-ink" : "border-transparent hover:border-border",
                  )}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      background: `linear-gradient(${45 + i * 30}deg, var(--mosaic-${(i % 6) + 1}), var(--mosaic-${((i + 2) % 6) + 1}))`,
                      opacity: 0.85,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Configurator */}
          <div className="lg:col-span-5">
            <p className="font-script text-xl text-primary">{category.name}</p>
            <h1 className="font-display text-5xl font-bold text-ink mt-1 leading-[0.95]">
              {product.name}
            </h1>
            <p className="text-ink-soft mt-4 leading-relaxed">
              {product.shortDescription}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {product.tags.map((t) => (
                <Badge key={t} variant="secondary" className="rounded-full font-normal">{t}</Badge>
              ))}
            </div>

            <div className="mt-8 space-y-6">
              {/* Afwerking */}
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Afwerking
                </Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {product.finishes.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFinish(f.value)}
                      className={cn(
                        "px-3 py-3 rounded-lg border text-sm font-medium transition flex items-center justify-center gap-1.5",
                        finish === f.value
                          ? "border-ink bg-ink text-background"
                          : "border-border hover:border-ink/50",
                      )}
                    >
                      {finish === f.value && <Check className="size-3.5" />}
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dikte */}
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Dikte
                </Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {product.thicknesses.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setThickness(t)}
                      className={cn(
                        "px-2 py-3 rounded-lg border text-sm font-medium transition",
                        thickness.value === t.value
                          ? "border-ink bg-ink text-background"
                          : "border-border hover:border-ink/50",
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Formaat */}
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Formaat (cm)
                </Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Breedte</Label>
                    <Input
                      type="number"
                      value={width}
                      min={10}
                      max={300}
                      onChange={(e) => setWidth(Math.max(10, Math.min(300, +e.target.value || 0)))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Hoogte</Label>
                    <Input
                      type="number"
                      value={height}
                      min={10}
                      max={300}
                      onChange={(e) => setHeight(Math.max(10, Math.min(300, +e.target.value || 0)))}
                      className="mt-1"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {m2.toFixed(2)} m² per stuk
                </p>
              </div>

              {/* Aantal */}
              <div>
                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Aantal
                </Label>
                <div className="flex items-center gap-3 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >−</Button>
                  <Input
                    type="number"
                    value={quantity}
                    min={1}
                    onChange={(e) => setQuantity(Math.max(1, +e.target.value || 1))}
                    className="w-24 text-center"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((q) => q + 1)}
                  >+</Button>
                  {qtyDiscount > 0 && (
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/10 rounded-full">
                      −{(qtyDiscount * 100).toFixed(0)}% volume
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Prijs + CTA's */}
            <div className="mt-8 p-6 rounded-2xl bg-ink text-background">
              <div className="flex items-baseline justify-between">
                <span className="text-background/60 text-sm">Indicatieprijs</span>
                <div className="text-right">
                  <div className="font-display text-4xl font-bold">
                    € {total.toFixed(2)}
                  </div>
                  <div className="text-xs text-background/60">excl. BTW</div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button
                  size="lg"
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                  onClick={() => setQuoteOpen(true)}
                >
                  <Sparkles className="size-4" />
                  AI-offerte genereren
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full bg-transparent border-background/30 text-background hover:bg-background/10 hover:text-background"
                  onClick={() =>
                    openAdvisor(
                      `Ik bekijk ${product.name} (${thickness.label}, ${finish}). Klopt deze keuze voor mijn project?`,
                    )
                  }
                >
                  Vraag de adviseur
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs met meer info */}
        <section className="border-t border-border bg-surface">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <Tabs defaultValue="specs">
              <TabsList className="bg-transparent p-0 h-auto gap-6 border-b border-border rounded-none w-full justify-start">
                <TabsTrigger value="specs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-ink data-[state=active]:shadow-none data-[state=active]:bg-transparent px-0 pb-3 font-display">
                  Specificaties
                </TabsTrigger>
                <TabsTrigger value="aanlever" className="rounded-none border-b-2 border-transparent data-[state=active]:border-ink data-[state=active]:shadow-none data-[state=active]:bg-transparent px-0 pb-3 font-display">
                  Aanleveren
                </TabsTrigger>
                <TabsTrigger value="toepassingen" className="rounded-none border-b-2 border-transparent data-[state=active]:border-ink data-[state=active]:shadow-none data-[state=active]:bg-transparent px-0 pb-3 font-display">
                  Toepassingen
                </TabsTrigger>
              </TabsList>

              <TabsContent value="specs" className="pt-8">
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-3 max-w-3xl">
                  <p className="md:col-span-2 text-ink-soft mb-6 leading-relaxed">
                    {product.longDescription}
                  </p>
                  {product.specs.map((s) => (
                    <div key={s.label} className="flex justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className="text-ink font-medium">{s.value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="aanlever" className="pt-8 max-w-2xl">
                <ul className="space-y-3 text-ink-soft">
                  <li className="flex gap-3"><Check className="size-5 text-primary shrink-0 mt-0.5" /> PDF (X-1a:2001), CMYK kleurprofiel</li>
                  <li className="flex gap-3"><Check className="size-5 text-primary shrink-0 mt-0.5" /> Minimaal 100 dpi op ware grootte (banners) of 300 dpi (klein formaat)</li>
                  <li className="flex gap-3"><Check className="size-5 text-primary shrink-0 mt-0.5" /> 3 mm afloop rondom, snijlijnen op aparte spotcolor laag</li>
                  <li className="flex gap-3"><Check className="size-5 text-primary shrink-0 mt-0.5" /> Lettertypes embedded of omgezet naar contouren</li>
                </ul>
              </TabsContent>

              <TabsContent value="toepassingen" className="pt-8">
                <div className="flex flex-wrap gap-2">
                  {product.applications.map((a) => (
                    <Badge key={a} variant="outline" className="rounded-full text-base px-4 py-1.5 font-normal">
                      {a}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Gerelateerd */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <h3 className="font-display text-2xl font-bold text-ink mb-6">
            Andere {category.name.toLowerCase()}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PRODUCTS.filter((p) => p.category === category.slug && p.slug !== product.slug)
              .slice(0, 4)
              .map((p) => (
                <Link
                  key={p.slug}
                  to="/$category/$product"
                  params={{ category: category.slug, product: p.slug }}
                  className="group rounded-xl border border-border p-5 hover:border-ink transition"
                >
                  <div
                    className="aspect-[4/3] rounded-lg mb-3"
                    style={{
                      background: `linear-gradient(135deg, var(--mosaic-${(p.slug.length % 6) + 1}), var(--mosaic-${((p.slug.length + 2) % 6) + 1}))`,
                    }}
                  />
                  <div className="font-display font-semibold text-ink group-hover:text-primary transition">
                    {p.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    vanaf € {p.basePrice.toFixed(2)} / m²
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </main>

      <SiteFooter />

      <QuoteDialog
        open={quoteOpen}
        onOpenChange={setQuoteOpen}
        product={product}
        finish={finish}
        thickness={thickness}
        width={width}
        height={height}
        quantity={quantity}
      />
    </div>
  );
}

function ProductHeroVisual({ finish, thicknessMm }: { finish: string; thicknessMm: number }) {
  const isGlossy = finish === "glans";
  return (
    <div className="relative aspect-[4/3] rounded-2xl bg-surface-2 overflow-hidden">
      {/* Plaat */}
      <div
        className="absolute inset-12 rounded-md shadow-2xl transition-all duration-500"
        style={{
          background: isGlossy
            ? "linear-gradient(135deg, oklch(0.95 0.005 90), oklch(0.85 0.01 90))"
            : "linear-gradient(135deg, oklch(0.92 0.005 90), oklch(0.88 0.005 90))",
          transform: `perspective(1200px) rotateY(-12deg) rotateX(6deg)`,
          boxShadow: `0 ${10 + thicknessMm * 2}px ${40 + thicknessMm * 4}px -10px oklch(0 0 0 / 0.3)`,
        }}
      >
        {/* Print artwork */}
        <div className="absolute inset-6 grid grid-cols-6 grid-rows-4 gap-1">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              style={{
                backgroundColor: `var(--mosaic-${(i % 6) + 1})`,
                opacity: 0.85,
              }}
              className="rounded-[2px]"
            />
          ))}
        </div>
        {/* Glans-overlay */}
        {isGlossy && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.45) 50%, transparent 60%)",
            }}
          />
        )}
        {/* Dikte-rand */}
        <div
          className="absolute -bottom-[2px] left-0 right-0 bg-ink/40"
          style={{ height: Math.max(2, thicknessMm * 0.7) }}
        />
      </div>
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 backdrop-blur px-2.5 py-1 rounded-full">
        {thicknessMm} mm · {finish}
      </div>
    </div>
  );
}

type QuoteResult = {
  total: number;
  subtotal: number;
  unitPrice: number;
  setup: number;
  qtyDiscount: number;
  m2: number;
  explanation: string;
};

function QuoteDialog({
  open,
  onOpenChange,
  product,
  finish,
  thickness,
  width,
  height,
  quantity,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: ReturnType<typeof getProduct> & object;
  finish: string;
  thickness: { value: number; label: string; multiplier: number };
  width: number;
  height: number;
  quantity: number;
}) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuoteResult | null>(null);

  async function generate() {
    setLoading(true);
    setResult(null);
    try {
      const resp = await fetch("/api/ai-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: product.name,
          finish,
          thicknessMm: thickness.value,
          widthCm: width,
          heightCm: height,
          quantity,
          basePrice: product.basePrice,
          thicknessMultiplier: thickness.multiplier,
          notes: notes || undefined,
        }),
      });
      if (resp.status === 429) { toast.error("Even rustig — te veel verzoeken."); return; }
      if (resp.status === 402) { toast.error("AI-credits op."); return; }
      if (!resp.ok) { toast.error("Offerte genereren mislukt."); return; }
      setResult(await resp.json());
    } catch (e) {
      console.error(e);
      toast.error("Onverwachte fout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            AI-offerte
          </DialogTitle>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-surface-2 p-4 text-sm space-y-1">
              <div className="flex justify-between"><span className="text-muted-foreground">Product</span><span className="font-medium">{product.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Afwerking</span><span className="font-medium">{finish}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Dikte</span><span className="font-medium">{thickness.label}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Formaat</span><span className="font-medium">{width} × {height} cm</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Aantal</span><span className="font-medium">{quantity} stuks</span></div>
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Opmerkingen (optioneel)
              </Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Bv. gewenste leverdatum, speciale afwerking, montage…"
                rows={3}
                className="mt-1"
              />
            </div>

            <Button
              onClick={generate}
              disabled={loading}
              size="lg"
              className="w-full rounded-full bg-ink text-background hover:bg-ink/90"
            >
              {loading ? <><Loader2 className="size-4 animate-spin mr-2" />AI rekent…</> : "Genereer offerte"}
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="text-center py-2">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Totaal indicatie</div>
              <div className="font-display text-5xl font-bold text-ink mt-1">€ {result.total.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">excl. BTW</div>
            </div>

            <div className="rounded-xl bg-surface-2 p-4 text-sm space-y-1.5">
              <div className="flex justify-between"><span className="text-muted-foreground">Stuksprijs ({result.m2.toFixed(2)} m²)</span><span>€ {result.unitPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">× {quantity} stuks</span><span>€ {(result.unitPrice * quantity).toFixed(2)}</span></div>
              {result.qtyDiscount > 0 && (
                <div className="flex justify-between text-primary"><span>Volumekorting</span><span>−{(result.qtyDiscount * 100).toFixed(0)}%</span></div>
              )}
              {result.setup > 0 && (
                <div className="flex justify-between"><span className="text-muted-foreground">Setup</span><span>€ {result.setup.toFixed(2)}</span></div>
              )}
            </div>

            <div className="rounded-xl border border-border p-4 text-sm leading-relaxed text-ink-soft">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-primary" /> AI toelichting
              </div>
              {result.explanation}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => setResult(null)} className="rounded-full">
                Aanpassen
              </Button>
              <Button
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  toast.success("Offerte verzonden naar info@unfold.nu (mockup)");
                  onOpenChange(false);
                }}
              >
                Verstuur naar Unfold
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
