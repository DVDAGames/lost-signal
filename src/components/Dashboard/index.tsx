import { IconX } from "@tabler/icons-react";
import { useTimeout } from "usehooks-ts";

import Signal from "./Signal";
import { useSignal } from "@/context/SignalContext";
import { useNotifications } from "@/context/NotificationContext";

export default function Dashboard(): React.ReactElement {
  const { signals, activeSignal } = useSignal();
  const { clearNotifications } = useNotifications();

  useTimeout(() => {
    clearNotifications();
  }, 3000);

  return (
    <div className="flex flex-col items-center justify-center h-[90vh] w-[90vw]">
      <div className="flex flex-col items-center justify-center h-full w-full border-2 border-cyan-900">
        <div className="flex flex-row items-center justify-start w-full p-2 bg-blue-950 font-bold text-neutral-400">
          sign4l
          <button className="ml-auto flex flex-row items-center justify-center p-2 bg-red-950 rounded-md appearance-none border-none cursor-pointer">
            <IconX size={16} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-start h-full w-full bg-neutral-500 p-10 pt-20">
          {signals.map((signal) => (
            <Signal
              key={signal.id}
              id={signal.id}
              title={signal.title}
              message={signal.message}
              difficulty={signal.difficulty}
              active={activeSignal?.id === signal.id}
              isDecoded={signal.isDecoded}
              isDecoding={signal.isDecoding}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
