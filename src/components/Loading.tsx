"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useInterval } from "usehooks-ts";
import { useVisibilityChange } from "@uidotdev/usehooks";
import { IconChevronRightPipe } from "@tabler/icons-react";

import Ciph3rText from "@interwebalchemy/ciph3r-text";

import { chunkText } from "@/utils/chunkText";

import {
  ALL_SYMBOLS_CHARACTER_SET,
  FULL_CHARACTER_SET,
} from "@/utils/generateCharacterSet";

const LOADING_COUNT_INTERVAL = 1000;
const LOADING_COUNT_MAX = 4;

export default function Loading(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();

  const next = searchParams.get("next");

  const [isLoading, setIsLoading] = useState(true);
  const [loadingCount, setLoadingCount] = useState(0);

  const isVisible = useVisibilityChange();

  useEffect(() => {
    if (!isVisible) {
      setIsLoading(true);
    }
  }, [isVisible]);

  useInterval(
    () => {
      if (isLoading) {
        setLoadingCount((count) => (count += 1));
      }
    },
    // !isVisible ?
    loadingCount < LOADING_COUNT_MAX ? LOADING_COUNT_INTERVAL : null
    //: null
  );

  useEffect(() => {
    if (loadingCount >= LOADING_COUNT_MAX) {
      setIsLoading(false);
    }
  }, [loadingCount]);

  const renderLoadingText = (): React.ReactNode[] => {
    return chunkText(
      ".".repeat(
        Math.floor(Math.random() * (Math.floor(LOADING_COUNT_MAX * 1.5) + 1)) +
          1
      ),
      10
    ).map((chunk, index) => {
      return (
        <Ciph3rText
          key={`${chunk}-${index}`}
          defaultText={chunk}
          characters={FULL_CHARACTER_SET}
          action="scramble"
          iterationSpeed={60}
          className="text-gray-600"
        />
      );
    });
  };

  return (
    <div className="flex flex-col items-start justify-center h-screen w-1/2">
      <div className="relative flex flex-col min-h-[40px] h-[40px] w-full items-start justify-center bg-gray-700 rounded-sm">
        <div
          className="flex h-full bg-amber-500 transition-all duration-200 ease-in-out rounded-sm"
          style={{ width: `${(loadingCount / LOADING_COUNT_MAX) * 100}%` }}
        ></div>
        <div className="absolute w-full h-full top-0 left-0 text-2xl font-bold">
          {isLoading ? (
            <div className="flex flex-row w-full h-full px-5 items-center justify-start">
              Loading&nbsp;{renderLoadingText()}
            </div>
          ) : (
            <button
              className="flex flex-row w-full h-full px-5 items-center appearance-none cursor-pointer justify-start hover:bg-amber-600 rounded-sm bg-transparent transition-all duration-300 ease-in-out"
              onClick={() => {
                router.push(`/game/${next}`);
              }}
            >
              <>
                Ready&nbsp;
                <Ciph3rText
                  defaultText="?"
                  action="scramble"
                  characters={ALL_SYMBOLS_CHARACTER_SET}
                  iterationSpeed={750}
                />
                <IconChevronRightPipe className="ml-auto" />
              </>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
