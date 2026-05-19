// @lovable.dev/vite-tanstack-config bundelt: tanstackStart, viteReact, tailwindcss,
// tsConfigPaths, cloudflare (build-only), componentTagger (dev-only), VITE_* env-injection,
// @ path alias, React/TanStack dedupe, error logger plugins en sandbox-detectie.
// We disablen de Cloudflare-plugin omdat we op Node draaien (PM2), niet op Workers.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  cloudflare: false,
});
