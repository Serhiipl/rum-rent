"use client";

import React, { useContext, useMemo } from "react";
import type { Settings } from "@/lib/mongo-operations";

type SettingsContextValue = Settings | null;

const SettingsContext = React.createContext<SettingsContextValue | undefined>(
  undefined
);

interface SettingsProviderProps {
  settings: Settings | null;
  children: React.ReactNode;
}

export function SettingsProvider({
  settings,
  children,
}: SettingsProviderProps) {
  const value = useMemo<SettingsContextValue>(
    () => settings ?? null,
    [settings]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);

  if (context === undefined) {
    throw new Error("useSettings must be used within SettingsProvider");
  }

  return context;
}

// Convenience hooks for common pieces of settings

export function useCompanyName(): string {
  const settings = useSettings();
  return settings?.company_name ?? "";
}

export function useMottoDescription(
  defaultTagline = "Wypożyczalnia sprzętu na Pomorzu"
): string {
  const settings = useSettings();
  return settings?.motto_description ?? defaultTagline;
}
export function useH1(): string {
  const settings = useSettings();
  return settings?.h1_title ?? "";
}

export function useContactInfo(): { phone: string; email: string } {
  const settings = useSettings();
  return {
    phone: settings?.company_phone ?? "",
    email: settings?.email_receiver ?? "",
  };
}
export function useSMTPSettingsEmail(): string {
  const settings = useSettings();

  return settings?.smtp_user_emailFrom ?? "";
}
export function useEmailReceiver(): string {
  const settings = useSettings();

  return settings?.email_receiver ?? "";
}
