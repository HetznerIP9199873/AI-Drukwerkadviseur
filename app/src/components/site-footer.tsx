import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/products";
import { MosaicMark } from "./site-header";

export function SiteFooter() {
  return (
    <footer className="mt-32">
      <div className="mosaic-band h-2" aria-hidden />
      <div className="bg-ink text-background">
        <div className="mx-auto max-w-7xl px-6 py-20 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-3xl">unfold</span>
              <MosaicMark className="size-8" />
            </div>
            <p className="font-script text-2xl text-background/80 mt-2">
              Print op echt álles!
            </p>
            <p className="text-background/60 text-sm mt-6 max-w-xs">
              Een onafhankelijke drukkerij in Haarlem die de extra mile gaat,
              voor festivals, beurzen, retail, evenementen en alles
              daartussenin.
            </p>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-background/50 mb-4">
              Producten
            </h4>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/$category"
                    params={{ category: c.slug }}
                    className="text-background/80 hover:text-background transition"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-background/50 mb-4">
              Service
            </h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li><a href="#" className="hover:text-background">Aanleverspecificaties</a></li>
              <li><a href="#" className="hover:text-background">Offerte aanvragen</a></li>
              <li><a href="#" className="hover:text-background">AI-adviseur</a></li>
              <li><a href="#" className="hover:text-background">Wederverkopers</a></li>
              <li><a href="#" className="hover:text-background">Algemene voorwaarden</a></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-background/50 mb-4">
              Contact
            </h4>
            <address className="not-italic text-sm text-background/80 space-y-1">
              <div>Unfold</div>
              <div>A. Hofmanweg 36</div>
              <div>2031 BL Haarlem</div>
              <div className="pt-3">
                <a href="tel:0235290308" className="hover:text-background">023 - 5290308</a>
              </div>
              <div>
                <a href="mailto:info@unfold.nu" className="hover:text-background">info@unfold.nu</a>
              </div>
              <div className="pt-3 text-background/60">
                Ma t/m vr · 9:00 - 17:00
              </div>
            </address>
          </div>
        </div>

        <div className="border-t border-background/10">
          <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-background/50">
            <span>© {new Date().getFullYear()} Unfold. Alle prijzen excl. BTW.</span>
            <span>Mockup gemaakt om te tonen wat mogelijk is.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
