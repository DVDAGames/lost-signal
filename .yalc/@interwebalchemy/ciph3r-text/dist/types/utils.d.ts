import type { Ciph3rTextRevealCharactersProps, Ciph3rTextScrambleCharactersProps } from "./types";
/**
 * Randomizes the characters in a string
 *
 * @param text - The text to randomize
 * @param characters - The characters to use for the randomization
 * @returns The randomized text
 */
export declare const randomizeText: (text: string, characters?: string) => string;
/**
 * Gets a random character from a string
 *
 * @param characters - The characters to use for the randomization
 * @returns The random character
 */
export declare const getRandomCharacter: (characters?: string) => string;
/**
 * Reveals characters from a target text based on probability and iteration limits
 *
 * @param sourceText - The current text being transformed
 * @param targetText - The target text to reveal characters from
 * @param maxCharactersToReveal - Maximum number of characters to reveal in this iteration
 * @param currentIteration - The current iteration count
 * @param maxIterations - The maximum number of iterations
 * @param revealProbability - Probability (0-1) that a character will be revealed (default: 0.5)
 * @returns The transformed text
 */
export declare const revealCharacters: ({ action, sourceText, targetText, maxCharactersToReveal, currentIteration, maxIterations: maxIterationsProp, revealProbability, }: Ciph3rTextRevealCharactersProps) => string;
/**
 * Scrambles the characters in a string
 *
 * @param text - The text to scramble
 * @param maxCharactersToScramble - The maximum number of characters to scramble
 * @returns The scrambled text
 */
export declare const scrambleCharacters: ({ text, characterSet, maxCharactersToScramble, }: Ciph3rTextScrambleCharactersProps) => string;
/**
 * Calculates the number of characters to encode based on the length of the text
 * number of characters to reveal
 *
 * @remarks
 * If the maximum number of characters to reveal is greater than or equal to the
 * length of the text minus one, the minimum number of characters to reveal will
 * be returned. Otherwise, a random number between the mininum and maximum number
 * of characters to reveal will be returned.
 *
 * @param defaultText - The default text
 * @param weight - A weight to bias the number of characters to reveal
 * @param minCharactersToReveal - The minimum number of characters to reveal
 * @param maxCharactersToReveal - The maximum number of characters to reveal
 * @returns The number of characters to encode
 */
export declare const calculateNumberOfCharactersToEncode: (defaultText: string, weight?: number, minCharactersToReveal?: number, maxCharactersToReveal?: number) => number;
/**
 * Calculates the number of characters to reveal based on the length of the text
 *
 * @param defaultText - The default text
 * @param weight - A weight to bias the number of characters to reveal
 * @param minCharactersToReveal - The minimum number of characters to reveal
 * @param maxCharactersToReveal - The maximum number of characters to reveal
 * @returns The number of characters to reveal
 */
export declare const calculateNumberOfCharactersToReveal: (defaultText: string, weight?: number, minCharactersToReveal?: number, maxCharactersToReveal?: number) => number;
/**
 * Calculates the number of characters to remove based on the length of the text
 *
 * @param defaultText - The default text
 * @param weight - A weight to bias the number of characters to remove
 * @param minCharactersToRemove - The minimum number of characters to remove
 * @param maxCharactersToRemove - The maximum number of characters to remove
 * @returns The number of characters to remove
 */
export declare const calculateNumberOfCharactersToRemove: (defaultText: string, weight?: number, minCharactersToRemove?: number, maxCharactersToRemove?: number) => number;
/**
 * Calculates the number of characters to add based on the length of the text
 *
 * @param defaultText - The default text
 * @param weight - A weight to bias the number of characters to add
 * @param minCharactersToAdd - The minimum number of characters to add
 * @param maxCharactersToAdd - The maximum number of characters to add
 * @returns The number of characters to add
 */
export declare const calculateNumberOfCharactersToAdd: (defaultText: string, weight?: number, minCharactersToAdd?: number, maxCharactersToAdd?: number) => number;
/**
 * Calculates the number of characters to scramble based on the length of the text
 *
 * @param defaultText - The default text
 * @returns The number of characters to scramble
 */
export declare const calculateNumberOfCharactersToScramble: (defaultText: string) => number;
