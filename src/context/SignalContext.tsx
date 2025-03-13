"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import { useNotifications } from "@/context/NotificationContext";

export interface Signal {
  id: string;
  title: string;
  message: string;
  difficulty: "easy" | "medium" | "hard";
  isDecoding?: boolean;
  isDecoded?: boolean;
}

export interface SignalContextType {
  signals: Signal[];
  activeSignal: Signal | null;
  setActiveSignal: (signal: Signal | null) => void;
  addSignal: (signal: Signal) => void;
  removeSignal: (signal: Signal) => void;
  updateSignal: (signal: Signal) => void;
}

export interface SignalProviderProps {
  children: ReactNode;
}

const SignalContext = createContext<SignalContextType | undefined>(undefined);

export function SignalProvider({ children }: SignalProviderProps) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [activeSignal, setActiveSignal] = useState<Signal | null>(null);
  const { addNotification } = useNotifications();

  const addSignal = (signal: Signal) => {
    setSignals([
      ...signals,
      { ...signal, isDecoded: false, isDecoding: false },
    ]);

    addNotification({
      title: "Signal Detected",
      message: [
        `${signal.title} signal has been detected.`,
        "Open your sign4l dashboard to view the signal.",
      ],
      type: "info",
      autoClose: false,
    });
  };

  const removeSignal = (signal: Signal) => {
    setSignals(signals.filter((s) => s.id !== signal.id));
  };

  const updateSignal = (signal: Signal) => {
    setSignals(signals.map((s) => (s.id === signal.id ? signal : s)));
  };

  return (
    <SignalContext.Provider
      value={{
        signals,
        activeSignal,
        setActiveSignal,
        addSignal,
        removeSignal,
        updateSignal,
      }}
    >
      {children}
    </SignalContext.Provider>
  );
}

export function useSignal() {
  const context = useContext(SignalContext);
  if (!context) {
    throw new Error("useSignal must be used within a SignalProvider");
  }
  return context;
}
