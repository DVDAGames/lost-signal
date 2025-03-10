import { ESOTERIC_CHARACTERS } from "@/constants";

export const generateCharacterSet = (sets: string[]) => {
  const characters = sets.map((characterSet) => {
    const path = characterSet;
    let resolution = ESOTERIC_CHARACTERS;
    let foundCharacters = "";

    if (path.includes(".")) {
      const pathArray = path.split(".");

      pathArray.forEach((part, index, array) => {
        if (Object.prototype.hasOwnProperty.call(resolution, part)) {
          // @ts-expect-error -- we're doing something weird here, TS doesn't like it
          resolution = resolution[part];
        }

        if (index === array.length - 1) {
          foundCharacters += resolution;
        }
      });
    } else {
      if (Object.prototype.hasOwnProperty.call(resolution, path)) {
        // @ts-expect-error -- we're doing something weird here, TS doesn't like it
        if (typeof resolution[path] === "string") {
          // @ts-expect-error -- we're doing something weird here, TS doesn't like it
          foundCharacters += resolution[path];
        } else {
          // @ts-expect-error -- we're doing something weird here, TS doesn't like it
          Object.values(resolution[path]).forEach((value) => {
            foundCharacters += value;
          });
        }
      }
    }

    return foundCharacters;
  });

  return characters.join("");
};

export const MATRIX_CHARACTER_SET = generateCharacterSet(["matrix"]);

export const CURSED_CHARACTER_SET = generateCharacterSet(["cursed"]);

export const RUNES_CHARACTER_SET = generateCharacterSet(["runes"]);

export const BLOCKS_CHARACTER_SET = generateCharacterSet(["blocks"]);

export const MATH_SYMBOLS_CHARACTER_SET = generateCharacterSet(["mathSymbols"]);

export const ALL_SYMBOLS_CHARACTER_SET = generateCharacterSet([
  "matrix.symbols",
  "mathSymbols",
  "miscSymbols",
  "matrix.kanji",
]);

export const FULL_CHARACTER_SET = generateCharacterSet([
  "matrix",
  "cursed",
  "runes",
  "blocks",
  "mathSymbols",
  "miscSymbols",
  "lang",
]);
