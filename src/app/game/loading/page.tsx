"use client";

import dynamic from "next/dynamic";

import Screen from "@/components/Screen";
import { Suspense } from "react";

const Loading = dynamic(() => import("@/components/Loading"), {
  ssr: false,
});

export default function LoadingPage(): React.ReactElement {
  return (
    <Screen>
      <div className="flex flex-col w-screen items-center justify-center h-screen bg-neutral-950">
        <div
          className={`relative flex flex-col items-center justify-start text-4xl w-full`}
        >
          <Suspense fallback={<p>Loading...</p>}>
            <Loading />
          </Suspense>
        </div>
      </div>
    </Screen>
  );
}
