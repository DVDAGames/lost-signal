"use client";

import { useState } from "react";
import { FadeTransition } from "./FadeTransition";
import Terminal from "./Terminal";
import Notifications from "./Notifications";
import Lockscreen from "./Lockscreen";

export interface ScreenProps {
  locked?: boolean;
}

export default function Screen({
  locked = false,
  children,
}: React.PropsWithChildren<ScreenProps>): React.ReactElement {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(locked);

  const toggleTerminal = () => {
    setIsTerminalOpen((prev) => !prev);
  };

  const toggleLock = () => {
    setIsLocked((prev) => !prev);
  };

  return (
    <FadeTransition name="screen">
      <Notifications />
      <Terminal
        open={isTerminalOpen}
        toggleTerminal={toggleTerminal}
        locked={isLocked}
      />
      <div id="screen" className="flex flex-col w-full h-full">
        <Lockscreen isLocked={isLocked} toggleLock={toggleLock}>
          {children}
        </Lockscreen>
      </div>
    </FadeTransition>
  );
}
