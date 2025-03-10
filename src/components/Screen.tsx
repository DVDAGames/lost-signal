import { FadeTransition } from "./FadeTransition";

export default function Screen({ children }: { children: React.ReactNode }) {
  return (
    <FadeTransition name="screen">
      <div className="flex flex-col w-full h-full">{children}</div>
    </FadeTransition>
  );
}
