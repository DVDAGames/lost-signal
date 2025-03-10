"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

import Screen from "@/components/Screen";

const Loading = dynamic(() => import("@/components/Loading"), {
  ssr: false,
});

export default function LoadingPage(): React.ReactElement {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  console.log("next", next);

  return (
    <Screen>
      <div className="flex flex-col w-screen items-center justify-center h-screen">
        <div
          className={`relative flex flex-col items-center justify-start text-4xl w-full`}
        >
          <Loading next={next ?? ""} />
        </div>
      </div>
    </Screen>
  );
}
