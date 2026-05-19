import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Sparkles, X } from "lucide-react";
import { CATEGORIES } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAiAdvisor } from "@/components/ai-advisor-provider";

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open } = useAiAdvisor();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !transparent || scrolled;

  return (
    <>
      {/* Top utility bar */}
      <div className="hidden md:block bg-ink text-background text-xs">
        <div className="mx-auto max-w-7xl px-6 h-9 flex items-center justify-between">
          <span className="text-background/70">
            Lokaal geprint in Haarlem · Levering door heel Nederland
          </span>
          <div className="flex items-center gap-5 text-background/80">
            <a href="#" className="hover:text-background transition">Aanleverspecificaties</a>
            <a href="#" className="hover:text-background transition">Contact</a>
            <a href="#" className="hover:text-background transition">Account</a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-300",
          solid
            ? "bg-background/85 backdrop-blur-xl border-b border-border"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto max-w-7xl px-6 h-18 flex items-center gap-8 py-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Logo />
          </Link>

          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to="/$category"
                params={{ category: cat.slug }}
                className="px-4 py-2 text-sm font-medium text-ink-soft hover:text-ink rounded-full hover:bg-surface-2 transition"
                activeProps={{ className: "text-ink bg-surface-2" }}
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2 ml-auto">
            <Button
              onClick={() => open()}
              variant="default"
              size="sm"
              className="rounded-full gap-2 bg-ink text-background hover:bg-ink/90"
            >
              <Sparkles className="size-4" />
              AI-adviseur
            </Button>
          </div>

          <button
            className="lg:hidden ml-auto p-2 rounded-md hover:bg-surface-2"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <nav className="px-6 py-4 flex flex-col gap-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to="/$category"
                  params={{ category: cat.slug }}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-3 rounded-lg hover:bg-surface-2 text-ink"
                >
                  <div className="font-medium">{cat.name}</div>
                  <div className="text-xs text-muted-foreground">{cat.tagline}</div>
                </Link>
              ))}
              <Button
                onClick={() => {
                  setMobileOpen(false);
                  open();
                }}
                className="mt-3 rounded-full gap-2 bg-ink text-background hover:bg-ink/90"
              >
                <Sparkles className="size-4" />
                AI-adviseur
              </Button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="font-display font-bold text-2xl tracking-tight text-ink">
        unfold
      </span>
      <MosaicMark className="size-7" />
    </div>
  );
}

export function MosaicMark({ className }: { className?: string }) {
  // 5x5 grid van gekleurde tegels — geïnspireerd op het logo
  const palette = [
    "var(--mosaic-1)",
    "var(--mosaic-2)",
    "var(--mosaic-3)",
    "var(--mosaic-4)",
    "var(--mosaic-5)",
    "var(--mosaic-6)",
  ];
  // Deterministisch patroon
  const tiles = [
    5, 0, 4, 2, 1,
    3, 5, 1, 0, 4,
    2, 4, 5, 3, 0,
    0, 1, 3, 4, 5,
    4, 2, 0, 5, 3,
  ];
  return (
    <div
      className={cn("grid grid-cols-5 grid-rows-5 gap-[1px] rounded-[3px] overflow-hidden", className)}
    >
      {tiles.map((p, i) => (
        <div key={i} style={{ backgroundColor: palette[p] }} />
      ))}
    </div>
  );
}
