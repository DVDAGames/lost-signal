"use client";

import { useState } from "react";
import { FadeTransition } from "./FadeTransition";
import Terminal from "./Terminal";

export default function Screen({ children }: { children: React.ReactNode }) {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const toggleTerminal = () => {
    setIsTerminalOpen((prev) => !prev);
  };

  return (
    <FadeTransition name="screen">
      <Terminal open={isTerminalOpen} toggleTerminal={toggleTerminal} />
      <div className="flex flex-col w-full h-full">{children}</div>
    </FadeTransition>
  );
}
