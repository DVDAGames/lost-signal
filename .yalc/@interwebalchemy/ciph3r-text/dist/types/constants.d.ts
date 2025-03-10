export declare const BASE_PRINTABLE_CHARACTERS = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_abcdefghijklmnopqrstuvwxyz{|}~";
export declare const ACTIONS: readonly ["encode", "decode", "transform", "scramble"];
export declare const DEFAULT_REVEAL_PROBABILITY = 0.5;
export declare const MINIMUM_CHARACTERS_TO_REVEAL = 1;
export declare const MAXIMUM_CHARACTERS_TO_REVEAL = 5;
export declare const MINIMUM_CHARACTERS_TO_REMOVE = 1;
export declare const MAXIMUM_CHARACTERS_TO_REMOVE = 5;
export declare const MINIMUM_CHARACTERS_TO_ADD = 1;
export declare const MAXIMUM_CHARACTERS_TO_ADD = 5;
export declare const BASE_MAX_ITERATIONS = 36;
export declare const BASE_SPEED = 120;
export declare const TRANSFORM_ITERATION_MULTIPLIER = 1.5;
export declare const TRANSFORM_SPEED_MULTIPLIER = 1.25;
export declare const SCRAMBLE_SPEED_MODIFIER = 0.5;
export declare const DEFAULT_MAX_ITERATIONS: {
    encode: number;
    decode: number;
    transform: number;
    scramble: number;
};
export declare const DEFAULT_SPEED: {
    encode: number;
    decode: number;
    transform: number;
    scramble: number;
};
