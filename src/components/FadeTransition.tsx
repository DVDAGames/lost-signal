"use client";

import { unstable_ViewTransition as ViewTransition } from "react";

export function FadeTransition({
  name,
  children,
  direction = "out",
  duration = 200,
}: {
  name: string;
  children: React.ReactNode;
  direction?: "in" | "out";
  duration?: number;
}) {
  const isIn = direction === "in";
  const startName = isIn ? "in" : "out";
  const endName = isIn ? "out" : "in";

  return (
    <>
      <style>
        {`
          @keyframes ${name}-enter-slide-${startName} {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          @keyframes ${name}-exit-slide-${endName} {
            0% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }

          ::view-transition-new(.${name}-enter-slide-${startName}) {
            animation: ${name}-enter-slide-${startName} ease-in ${duration}ms;
          }
          ::view-transition-old(.${name}-exit-slide-${endName}) {
            animation: ${name}-exit-slide-${endName} ease-out ${duration}ms;
          }
        `}
      </style>
      <ViewTransition name={name}>{children}</ViewTransition>
    </>
  );
}
