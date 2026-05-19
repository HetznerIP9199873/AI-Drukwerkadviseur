import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type AdvisorContextValue = {
  isOpen: boolean;
  initialMessage: string | null;
  open: (initialMessage?: string) => void;
  close: () => void;
};

const AdvisorContext = createContext<AdvisorContextValue | null>(null);

export function AiAdvisorProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState<string | null>(null);

  const open = useCallback((msg?: string) => {
    setInitialMessage(msg ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <AdvisorContext.Provider value={{ isOpen, initialMessage, open, close }}>
      {children}
    </AdvisorContext.Provider>
  );
}

export function useAiAdvisor() {
  const ctx = useContext(AdvisorContext);
  if (!ctx) throw new Error("useAiAdvisor must be used inside AiAdvisorProvider");
  return ctx;
}
