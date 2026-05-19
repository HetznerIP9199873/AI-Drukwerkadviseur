import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AiAdvisorProvider } from "@/components/ai-advisor-provider";
import { AiAdvisorDrawer, AdvisorFloatingButton } from "@/components/ai-advisor-drawer";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Pagina niet gevonden</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Deze pagina bestaat niet of is verplaatst.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Terug naar home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Unfold — Print op echt álles" },
      { name: "description", content: "Unfold is dé Haarlemse drukker die de extra mile gaat. Plaatmateriaal, zelfklevend, print media, displays en accessoires — met een AI-adviseur die meedenkt." },
      { name: "author", content: "Unfold" },
      { property: "og:title", content: "Unfold — Print op echt álles" },
      { property: "og:description", content: "Unfold is dé Haarlemse drukker die de extra mile gaat. Plaatmateriaal, zelfklevend, print media, displays en accessoires — met een AI-adviseur die meedenkt." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Unfold — Print op echt álles" },
      { name: "twitter:description", content: "Unfold is dé Haarlemse drukker die de extra mile gaat. Plaatmateriaal, zelfklevend, print media, displays en accessoires — met een AI-adviseur die meedenkt." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/65d29ff1-a9b8-4847-b36f-66b0d0352ef3/id-preview-a25b245a--52394f20-ad01-4e7e-ae5a-4683a5534b20.lovable.app-1777532519537.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/65d29ff1-a9b8-4847-b36f-66b0d0352ef3/id-preview-a25b245a--52394f20-ad01-4e7e-ae5a-4683a5534b20.lovable.app-1777532519537.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Caveat:wght@400;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AiAdvisorProvider>
      <Outlet />
      <AiAdvisorDrawer />
      <AdvisorFloatingButton />
      <Toaster position="top-center" />
    </AiAdvisorProvider>
  );
}
