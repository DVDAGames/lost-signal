import type { ACTIONS } from "./constants";

export type Ciph3rTextAction = (typeof ACTIONS)[number];

export interface Ciph3rTextProps {
  defaultText: string;
  targetText?: string;
  action?: Ciph3rTextAction;
  iterationSpeed?: number;
  maxIterations?: number;
  onFinish?: () => void;
  characters?: string;
  additionalCharactersToInclude?: string;
  colorizeWords?: boolean;
  preserveSpaces?: boolean;
  shouldPause?: boolean;
}

export interface Ciph3rTextRevealCharactersProps {
  action?: Ciph3rTextAction;
  sourceText: string;
  targetText: string;
  maxCharactersToReveal: number;
  currentIteration: number;
  maxIterations?: number;
  revealProbability?: number;
  preserveSpaces?: boolean;
}

export interface Ciph3rTextScrambleCharactersProps {
  text: string;
  characterSet: string;
  maxCharactersToScramble: number;
  preserveSpaces?: boolean;
}
