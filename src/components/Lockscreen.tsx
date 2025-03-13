"use client";

import { IconLock } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";

export interface LockscreenProps {
  isLocked: boolean;
  toggleLock: () => void;
}

export default function Lockscreen({
  children,
  isLocked,
  toggleLock,
}: React.PropsWithChildren<LockscreenProps>): React.ReactElement {
  const [time, setTime] = useState(new Date());
  const [hideLockScreen, setHideLockScreen] = useState(false);

  useInterval(() => {
    setTime(new Date());
  }, 1000);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "L" && e.shiftKey) {
        console.log("L pressed");
        e.preventDefault();

        toggleLock();
      }
    };

    const handleTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === "opacity") {
        setHideLockScreen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("transitionend", handleTransitionEnd);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, []);

  const renderLockScreenClock = (): React.ReactNode => {
    return (
      <div className="flex flex-col items-center justify-center">
        <p className="text-neutral-50 text-4xl font-mono">
          {time.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })}
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {isLocked ? (
        <div className="flex flex-col items-center justify-center h-full w-full bg-neutral-800">
          <div
            className={`flex flex-row items-center justify-center transition-opacity duration-300 ease-in-out${
              isLocked ? " opacity-100" : " opacity-0"
            }${hideLockScreen ? " hidden" : ""}`}
          >
            <IconLock className="text-neutral-50 mr-4" size={30} />
            {renderLockScreenClock()}
          </div>
          <div className="mt-4 flex flex-row items-center justify-center text-sm font-mono text-gray-500">
            Press [<kbd className="text-white">SHIFT</kbd>] + [
            <kbd className="text-white">L</kbd>] to unlock.
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
