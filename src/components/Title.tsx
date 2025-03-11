"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, Fragment } from "react";
import { useInterval, useTimeout } from "usehooks-ts";
import Ciph3rText from "@interwebalchemy/ciph3r-text";
import { generateCharacterSet } from "@/utils/generateCharacterSet";

// SIGNAL LOST
const ANAGRAMS = [
  "LOST SIGNAL",
  "A SONG STILL",
  "SIGNAL LOST",
  "SIGN4L LO$T",
  "ALL ITS SONG",
  "$IGNAL L0ST",
  "SIGNAL LOST",
  // "SLANG TOILS",
  // "ALONG LISTS",
  // "LIST SLOGAN",
  // "AS GIN TOLLS",
  // "AS LIST LONG",
  // "ALSO GLINTS",
  // "AGO IN LISTS",
  // "IN LAST SLOG",
  // "IN LOST SLAG",
  // "AS GO IT NILS",
  // "AS SONG TIL",
  // "A SONG STILL",
  // "ALL ITS SONG",
  // "GAINS TOLLS",
  // "GAINS I LOST",
  // "ALL TO SIGNS",
];

const MAIN_TITLE_CHARACTER_SET = generateCharacterSet(["matrix"]);

const SUBTITLE_CHARACTER_SET = generateCharacterSet([
  "matrix",
  "cursed",
  "runes",
  "blocks",
  "mathSymbols",
  "miscSymbols",
  "lang",
]);

// const MAIN_TITLE_DEFAULT_TEXT = ANAGRAMS[0];
const SUBTITLE_DEFAULT_TEXT = "A STORY OF SIGNALS AND LOSS.";

export default function Title(): React.ReactElement {
  const router = useRouter();

  const [isAnimating, setIsAnimating] = useState(false);
  const [defaultTextId, setDefaultTextId] = useState(0);
  const [targetTextId, setTargetTextId] = useState(0);
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [wasEncoded, setWasEncoded] = useState(false);
  const [wasEncodedOnce, setWasEncodedOnce] = useState(false);
  const [subtitleAction, setSubtitleAction] = useState("transform");
  const [subtitleIterationSpeed, setSubtitleIterationSpeed] = useState(80);
  const [subtitleDefaultText, setSubtitleDefaultText] = useState("");
  const [subtitleTargetText, setSubtitleTargetText] = useState(
    SUBTITLE_DEFAULT_TEXT
  );

  useTimeout(() => {
    setIsAnimating(true);
    setTargetTextId(1);
  }, 600);

  // wait 2 seconds before switching the text targets
  useInterval(
    () => {
      setWasEncodedOnce(true);

      setDefaultTextId(targetTextId);
      setTargetTextId((t) => (t + 1 === ANAGRAMS.length ? 0 : t + 1));

      setWasEncoded(false);
    },
    isAnimating ? (wasEncoded ? 2200 : null) : null
  );

  // wait 3 seconds to start the first scramble of the subtitle
  useInterval(
    () => {
      if (!wasEncodedOnce) {
        setTargetTextId((t) => (t + 1 === ANAGRAMS.length ? 0 : t + 1));
        setSubtitleAction("scramble");
      } else {
        setIsFirstRun(false);
        setSubtitleDefaultText(randomSubtitleString());
        setSubtitleAction("transform");
        setSubtitleIterationSpeed(100);
        setSubtitleTargetText(SUBTITLE_DEFAULT_TEXT);
      }
    },
    isAnimating ? (wasEncodedOnce ? 4000 : 2000) : null
  );

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      router.push("/game/loading?next=intro");
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const colors = [
    "text-gray-500",
    "text-cyan-700",
    "text-emerald-800",
    "text-pink-300",
    "text-teal-500",
  ];

  // generate a random string of chartacters of the same length as subtitleTargetText
  // make sure they are all printable characters
  const randomSubtitleString = () =>
    SUBTITLE_DEFAULT_TEXT.split(" ")
      .map((word) =>
        word
          .split("")
          .map(
            () =>
              SUBTITLE_CHARACTER_SET[
                Math.floor(Math.random() * SUBTITLE_CHARACTER_SET.length)
              ]
          )
          .join("")
      )
      .join(" ");

  const renderSubtitle = () => {
    if (wasEncodedOnce && !isFirstRun) {
      if (subtitleAction === "scramble") {
        // break subtitleDefaultText into an array of chunks of random sizes
        // but don't exceed the original length of subtitleDefaultText
        const words = subtitleDefaultText.split(" ");
        const chunks = [];

        for (let i = 0; i < words.length; i++) {
          let j = 0;
          const word = words[i];

          console.log("WORD:", word, word.length);
          console.log("INDEX:", i);

          while (j < word.length) {
            const chunkLength = Math.floor(
              Math.random() * (word.length - (j + 1)) + 1
            );
            const chunk = word.slice(j, j + chunkLength);

            console.log("CHUNK:", chunk, chunkLength);

            chunks.push({
              chunk,
              color: colors[Math.floor(Math.random() * colors.length)],
              position:
                i === 0
                  ? "start"
                  : j + chunkLength >= word.length
                  ? "end"
                  : "middle",
            });

            j += chunkLength;
          }
        }

        return chunks.map(({ chunk, color, position }, index) => {
          console.log("CHUNK:", chunk, chunk.length);
          console.log("POSITION:", position);

          return (
            <Fragment key={`${chunk}-${index}`}>
              <Ciph3rText
                key={index}
                defaultText={chunk}
                action={"scramble"}
                iterationSpeed={subtitleIterationSpeed}
                className={color}
                characters={SUBTITLE_CHARACTER_SET}
              />
              {position === "end" && index < chunks.length - 1 && (
                <span className="text-gray-500">&nbsp;</span>
              )}
            </Fragment>
          );
        });
      } else {
        return (
          <Ciph3rText
            defaultText={subtitleDefaultText}
            action={"transform"}
            iterationSpeed={subtitleIterationSpeed}
            targetText={subtitleTargetText}
            onFinish={() => {
              setSubtitleAction("scramble");
              setSubtitleIterationSpeed(80);
              setSubtitleDefaultText(SUBTITLE_DEFAULT_TEXT);
            }}
            className="text-gray-500"
            characters={SUBTITLE_CHARACTER_SET}
          />
        );
      }
    }

    return (
      <Ciph3rText
        defaultText={subtitleDefaultText}
        action={"transform"}
        iterationSpeed={subtitleIterationSpeed}
        targetText={subtitleTargetText}
        onFinish={() => {
          setSubtitleAction("scramble");
          setSubtitleIterationSpeed(80);
        }}
        className="text-gray-500"
        characters={MAIN_TITLE_CHARACTER_SET}
      />
    );
  };

  return (
    <div className="flex flex-col w-screen items-center justify-center h-screen">
      <div
        className={`relative flex flex-col items-center justify-start text-4xl w-full`}
      >
        <div className="">
          <Ciph3rText
            defaultText={ANAGRAMS[defaultTextId]}
            action={"transform"}
            targetText={ANAGRAMS[targetTextId]}
            iterationSpeed={120}
            onFinish={() => {
              setWasEncoded(true);
            }}
            characters={MAIN_TITLE_CHARACTER_SET}
          />
        </div>
      </div>
      <div
        className={`flex flex-row items-center justify-center text-2xl font-mono mt-4 min-h-[32px]`}
      >
        {renderSubtitle()}
      </div>
      <div className="absolute bottom-20 flex flex-row items-center justify-center text-sm font-mono text-gray-500">
        Press [<kbd className="text-white">ENTER</kbd>] to play.
      </div>
    </div>
  );
}
