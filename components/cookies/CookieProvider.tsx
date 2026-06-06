"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Cookie consent — stored locally as a versioned record.
 *
 * Storage key: `bellostas-cookie-consent`
 *
 * Increment CONSENT_VERSION whenever the cookie policy changes meaningfully
 * (new category, new vendor, etc.). Stored consents from older versions will
 * be treated as missing and the banner will reappear.
 */

export const CONSENT_VERSION = 1;
export const STORAGE_KEY = "bellostas-cookie-consent";

export type ConsentChoices = {
  /** Always true — essentials cannot be disabled */
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

export type ConsentRecord = {
  version: number;
  /** ISO timestamp of when the user made the choice */
  timestamp: string;
  choices: ConsentChoices;
};

type ConsentContextValue = {
  /** null = the user hasn't decided yet (or storage was cleared). */
  consent: ConsentRecord | null;
  /** Whether the user has already made a decision (consent !== null). */
  hasDecided: boolean;
  /** Whether the preferences modal is open. */
  modalOpen: boolean;
  /** Whether the provider has finished reading localStorage on mount. */
  ready: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  /** Save a custom selection. `necessary` is forced to true. */
  setChoices: (choices: Omit<ConsentChoices, "necessary"> & { necessary?: true }) => void;
  /** Clear the stored consent (useful for "withdraw consent"). Banner will reappear. */
  reset: () => void;
  openModal: () => void;
  closeModal: () => void;
};

const CookieConsentContext = createContext<ConsentContextValue | null>(null);

function readStorage(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (parsed.version !== CONSENT_VERSION) return null;
    if (!parsed.choices || parsed.choices.necessary !== true) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStorage(record: ConsentRecord) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* swallow — quota, disabled storage, etc. */
  }
}

function clearStorage() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}

export function CookieProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage after mount (SSR-safe).
  useEffect(() => {
    setConsent(readStorage());
    setReady(true);
  }, []);

  const persist = useCallback((choices: ConsentChoices) => {
    const record: ConsentRecord = {
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      choices,
    };
    writeStorage(record);
    setConsent(record);
    // Dispatch a custom event so non-React consumers (e.g. GA loader) can react.
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("bellostas-consent-changed", { detail: record }));
    }
  }, []);

  const acceptAll = useCallback(() => {
    persist({ necessary: true, analytics: true, marketing: true });
    setModalOpen(false);
  }, [persist]);

  const rejectAll = useCallback(() => {
    persist({ necessary: true, analytics: false, marketing: false });
    setModalOpen(false);
  }, [persist]);

  const setChoices = useCallback(
    (next: Omit<ConsentChoices, "necessary"> & { necessary?: true }) => {
      persist({
        necessary: true,
        analytics: !!next.analytics,
        marketing: !!next.marketing,
      });
      setModalOpen(false);
    },
    [persist],
  );

  const reset = useCallback(() => {
    clearStorage();
    setConsent(null);
    setModalOpen(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("bellostas-consent-changed", { detail: null }));
    }
  }, []);

  const value: ConsentContextValue = {
    consent,
    hasDecided: consent !== null,
    modalOpen,
    ready,
    acceptAll,
    rejectAll,
    setChoices,
    reset,
    openModal: () => setModalOpen(true),
    closeModal: () => setModalOpen(false),
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): ConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used inside <CookieProvider>");
  }
  return ctx;
}
