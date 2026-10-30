"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";

type Prompt = { prompt: () => Promise<void> };

export function InstallButton() {
  const [prompt, setPrompt] = useState<Prompt | null>(null);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as unknown as Prompt);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!prompt) return null;

  return (
    <Button
      variant="outline"
      onClick={async () => {
        await prompt.prompt();
        setPrompt(null);
      }}
    >
      Install app
    </Button>
  );
}
