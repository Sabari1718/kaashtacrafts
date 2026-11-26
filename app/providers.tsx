"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider, useTheme } from "next-themes";

function DefaultLightEnforcer({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Clean up any legacy "theme" key in localStorage from older versions
      try {
        const explicitChoice = localStorage.getItem("kaashtacrafts_theme_mode_v2");
        if (!explicitChoice) {
          localStorage.removeItem("theme");
          setTheme("light");
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [setTheme]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        storageKey="kaashtacrafts_theme_mode_v2"
      >
        <DefaultLightEnforcer>
          {children}
        </DefaultLightEnforcer>
      </ThemeProvider>
    </SessionProvider>
  );
}

