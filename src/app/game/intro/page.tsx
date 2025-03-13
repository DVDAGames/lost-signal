"use client";

import { useTimeout } from "usehooks-ts";

import { useSignal } from "@/context/SignalContext";

import Screen from "@/components/Screen";
import Dashboard from "@/components/Dashboard";

export default function IntroPage(): React.ReactElement {
  const { addSignal } = useSignal();

  useTimeout(() => {
    addSignal({
      id: "0001",
      title: "Unknown",
      message:
        "Never gonna give you up. Never gonna let you down. Never gonna run around and desert you...",
      difficulty: "easy",
    });
  }, 500);

  return (
    <Screen locked>
      <div className="flex flex-col items-center justify-center h-full w-full">
        <Dashboard />
      </div>
    </Screen>
  );
}
