import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, X, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAiAdvisor } from "./ai-advisor-provider";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Buitenbanner van 4m voor een festival deze zomer",
  "Stevige geveldecoratie voor mijn winkel",
  "Vloersticker voor een beurs van 3 dagen",
  "Iets duurzaams en recyclebaars voor een event",
];

export function AiAdvisorDrawer() {
  const { isOpen, close, initialMessage } = useAiAdvisor();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && initialMessage && messages.length === 0) {
      send(initialMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialMessage]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch("/api/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (resp.status === 429) {
        toast.error("Even rustig — te veel verzoeken. Probeer het zo opnieuw.");
        setLoading(false);
        return;
      }
      if (resp.status === 402) {
        toast.error("AI-credits op. Voeg credits toe aan je workspace.");
        setLoading(false);
        return;
      }
      if (!resp.ok || !resp.body) {
        toast.error("Verbinding met AI mislukt.");
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantSoFar = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") continue;
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              assistantSoFar += delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: assistantSoFar };
                return copy;
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Onverwachte fout met de AI-adviseur.");
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    send(input.trim());
  }

  return (
    <Sheet open={isOpen} onOpenChange={(v) => !v && close()}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col gap-0">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2 font-display">
            <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="size-4" />
            </span>
            Unfold AI-adviseur
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            Vertel waar je print voor nodig hebt — ik adviseer materiaal & afwerking.
          </p>
        </SheetHeader>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Probeer bijvoorbeeld:</p>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="block w-full text-left px-4 py-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition text-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[90%] whitespace-pre-wrap",
                m.role === "user"
                  ? "bg-ink text-background ml-auto rounded-br-sm"
                  : "bg-surface-2 text-ink rounded-bl-sm",
              )}
            >
              {m.content || (loading && i === messages.length - 1 ? (
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" />
                  denkt mee…
                </span>
              ) : null)}
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="p-4 border-t border-border bg-surface">
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit(e as unknown as React.FormEvent);
                }
              }}
              placeholder="Beschrijf je project…"
              rows={2}
              className="resize-none rounded-xl"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              size="icon"
              className="rounded-full size-11 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center">
            AI-advies is indicatief — bel ons voor een definitieve offerte.
          </p>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export function AdvisorFloatingButton() {
  const { open, isOpen } = useAiAdvisor();
  if (isOpen) return null;
  return (
    <button
      onClick={() => open()}
      className="fixed bottom-6 right-6 z-30 group"
      aria-label="AI-adviseur openen"
    >
      <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
      <span className="relative flex items-center gap-2 bg-ink text-background px-5 py-3.5 rounded-full shadow-2xl shadow-ink/20 hover:scale-105 transition">
        <Sparkles className="size-4 text-primary" />
        <span className="font-medium text-sm">AI-adviseur</span>
      </span>
    </button>
  );
}
