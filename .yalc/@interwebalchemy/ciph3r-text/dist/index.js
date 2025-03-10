import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

var lodash_debounce;
var hasRequiredLodash_debounce;

function requireLodash_debounce () {
	if (hasRequiredLodash_debounce) return lodash_debounce;
	hasRequiredLodash_debounce = 1;
	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/** Used as references for various `Number` constants. */
	var NAN = 0 / 0;

	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';

	/** Used to match leading and trailing whitespace. */
	var reTrim = /^\s+|\s+$/g;

	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;

	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;

	/** Built-in method references without a dependency on `root`. */
	var freeParseInt = parseInt;

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max,
	    nativeMin = Math.min;

	/**
	 * Gets the timestamp of the number of milliseconds that have elapsed since
	 * the Unix epoch (1 January 1970 00:00:00 UTC).
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Date
	 * @returns {number} Returns the timestamp.
	 * @example
	 *
	 * _.defer(function(stamp) {
	 *   console.log(_.now() - stamp);
	 * }, _.now());
	 * // => Logs the number of milliseconds it took for the deferred invocation.
	 */
	var now = function() {
	  return root.Date.now();
	};

	/**
	 * Creates a debounced function that delays invoking `func` until after `wait`
	 * milliseconds have elapsed since the last time the debounced function was
	 * invoked. The debounced function comes with a `cancel` method to cancel
	 * delayed `func` invocations and a `flush` method to immediately invoke them.
	 * Provide `options` to indicate whether `func` should be invoked on the
	 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
	 * with the last arguments provided to the debounced function. Subsequent
	 * calls to the debounced function return the result of the last `func`
	 * invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is
	 * invoked on the trailing edge of the timeout only if the debounced function
	 * is invoked more than once during the `wait` timeout.
	 *
	 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
	 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
	 *
	 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	 * for details over the differences between `_.debounce` and `_.throttle`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to debounce.
	 * @param {number} [wait=0] The number of milliseconds to delay.
	 * @param {Object} [options={}] The options object.
	 * @param {boolean} [options.leading=false]
	 *  Specify invoking on the leading edge of the timeout.
	 * @param {number} [options.maxWait]
	 *  The maximum time `func` is allowed to be delayed before it's invoked.
	 * @param {boolean} [options.trailing=true]
	 *  Specify invoking on the trailing edge of the timeout.
	 * @returns {Function} Returns the new debounced function.
	 * @example
	 *
	 * // Avoid costly calculations while the window size is in flux.
	 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
	 *
	 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
	 * jQuery(element).on('click', _.debounce(sendMail, 300, {
	 *   'leading': true,
	 *   'trailing': false
	 * }));
	 *
	 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
	 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
	 * var source = new EventSource('/stream');
	 * jQuery(source).on('message', debounced);
	 *
	 * // Cancel the trailing debounced invocation.
	 * jQuery(window).on('popstate', debounced.cancel);
	 */
	function debounce(func, wait, options) {
	  var lastArgs,
	      lastThis,
	      maxWait,
	      result,
	      timerId,
	      lastCallTime,
	      lastInvokeTime = 0,
	      leading = false,
	      maxing = false,
	      trailing = true;

	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  wait = toNumber(wait) || 0;
	  if (isObject(options)) {
	    leading = !!options.leading;
	    maxing = 'maxWait' in options;
	    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
	    trailing = 'trailing' in options ? !!options.trailing : trailing;
	  }

	  function invokeFunc(time) {
	    var args = lastArgs,
	        thisArg = lastThis;

	    lastArgs = lastThis = undefined;
	    lastInvokeTime = time;
	    result = func.apply(thisArg, args);
	    return result;
	  }

	  function leadingEdge(time) {
	    // Reset any `maxWait` timer.
	    lastInvokeTime = time;
	    // Start the timer for the trailing edge.
	    timerId = setTimeout(timerExpired, wait);
	    // Invoke the leading edge.
	    return leading ? invokeFunc(time) : result;
	  }

	  function remainingWait(time) {
	    var timeSinceLastCall = time - lastCallTime,
	        timeSinceLastInvoke = time - lastInvokeTime,
	        result = wait - timeSinceLastCall;

	    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
	  }

	  function shouldInvoke(time) {
	    var timeSinceLastCall = time - lastCallTime,
	        timeSinceLastInvoke = time - lastInvokeTime;

	    // Either this is the first call, activity has stopped and we're at the
	    // trailing edge, the system time has gone backwards and we're treating
	    // it as the trailing edge, or we've hit the `maxWait` limit.
	    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
	      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
	  }

	  function timerExpired() {
	    var time = now();
	    if (shouldInvoke(time)) {
	      return trailingEdge(time);
	    }
	    // Restart the timer.
	    timerId = setTimeout(timerExpired, remainingWait(time));
	  }

	  function trailingEdge(time) {
	    timerId = undefined;

	    // Only invoke if we have `lastArgs` which means `func` has been
	    // debounced at least once.
	    if (trailing && lastArgs) {
	      return invokeFunc(time);
	    }
	    lastArgs = lastThis = undefined;
	    return result;
	  }

	  function cancel() {
	    if (timerId !== undefined) {
	      clearTimeout(timerId);
	    }
	    lastInvokeTime = 0;
	    lastArgs = lastCallTime = lastThis = timerId = undefined;
	  }

	  function flush() {
	    return timerId === undefined ? result : trailingEdge(now());
	  }

	  function debounced() {
	    var time = now(),
	        isInvoking = shouldInvoke(time);

	    lastArgs = arguments;
	    lastThis = this;
	    lastCallTime = time;

	    if (isInvoking) {
	      if (timerId === undefined) {
	        return leadingEdge(lastCallTime);
	      }
	      if (maxing) {
	        // Handle invocations in a tight loop.
	        timerId = setTimeout(timerExpired, wait);
	        return invokeFunc(lastCallTime);
	      }
	    }
	    if (timerId === undefined) {
	      timerId = setTimeout(timerExpired, wait);
	    }
	    return result;
	  }
	  debounced.cancel = cancel;
	  debounced.flush = flush;
	  return debounced;
	}

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && objectToString.call(value) == symbolTag);
	}

	/**
	 * Converts `value` to a number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 */
	function toNumber(value) {
	  if (typeof value == 'number') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return NAN;
	  }
	  if (isObject(value)) {
	    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
	    value = isObject(other) ? (other + '') : other;
	  }
	  if (typeof value != 'string') {
	    return value === 0 ? value : +value;
	  }
	  value = value.replace(reTrim, '');
	  var isBinary = reIsBinary.test(value);
	  return (isBinary || reIsOctal.test(value))
	    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
	    : (reIsBadHex.test(value) ? NAN : +value);
	}

	lodash_debounce = debounce;
	return lodash_debounce;
}

requireLodash_debounce();

var useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
function useInterval(callback, delay) {
  const savedCallback = useRef(callback);
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay === null) {
      return;
    }
    const id = setInterval(() => {
      savedCallback.current();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]);
}
function useIsClient() {
  const [isClient, setClient] = useState(false);
  useEffect(() => {
    setClient(true);
  }, []);
  return isClient;
}

// TODO: Allow extending or overriding the base characters
const BASE_PRINTABLE_CHARACTERS = `!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_abcdefghijklmnopqrstuvwxyz{|}~`;
const ACTIONS = ["encode", "decode", "transform", "scramble"];
const DEFAULT_REVEAL_PROBABILITY = 0.5;
const MINIMUM_CHARACTERS_TO_REVEAL = 1;
const MAXIMUM_CHARACTERS_TO_REVEAL = 5;
const MINIMUM_CHARACTERS_TO_REMOVE = 1;
const MAXIMUM_CHARACTERS_TO_REMOVE = 5;
const MINIMUM_CHARACTERS_TO_ADD = 1;
const MAXIMUM_CHARACTERS_TO_ADD = 5;
const BASE_MAX_ITERATIONS = 36;
const BASE_SPEED = 120;
const TRANSFORM_ITERATION_MULTIPLIER = 1.5;
const TRANSFORM_SPEED_MULTIPLIER = 1.25;
const SCRAMBLE_SPEED_MODIFIER = 0.5;
const DEFAULT_MAX_ITERATIONS = {
    encode: BASE_MAX_ITERATIONS,
    decode: BASE_MAX_ITERATIONS,
    transform: BASE_MAX_ITERATIONS * TRANSFORM_ITERATION_MULTIPLIER,
    scramble: Infinity,
};
const DEFAULT_SPEED = {
    encode: BASE_SPEED,
    decode: BASE_SPEED,
    transform: BASE_SPEED * TRANSFORM_SPEED_MULTIPLIER,
    scramble: BASE_SPEED * SCRAMBLE_SPEED_MODIFIER,
};

/**
 * Randomizes the characters in a string
 *
 * @param text - The text to randomize
 * @param characters - The characters to use for the randomization
 * @returns The randomized text
 */
const randomizeText = (text, characters = BASE_PRINTABLE_CHARACTERS) => text
    .split("")
    .map(() => getRandomCharacter(characters))
    .join("");
/**
 * Gets a random character from a string
 *
 * @param characters - The characters to use for the randomization
 * @returns The random character
 */
const getRandomCharacter = (characters = BASE_PRINTABLE_CHARACTERS) => characters[Math.floor(Math.random() * characters.length)];
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
const revealCharacters = ({ action = "decode", sourceText, targetText, maxCharactersToReveal, currentIteration, maxIterations: maxIterationsProp, revealProbability = DEFAULT_REVEAL_PROBABILITY, }) => {
    let charactersRevealed = 0;
    let maxRevealed = false;
    const maxIterations = maxIterationsProp ?? DEFAULT_MAX_ITERATIONS[action];
    const transformedText = sourceText
        .split("")
        .map((char, i) => {
        if (sourceText[i] !== targetText[i]) {
            // Reveal character if we've reached max iterations or by probability
            if (currentIteration >= maxIterations ||
                (Math.random() > revealProbability && !maxRevealed)) {
                charactersRevealed++;
                if (charactersRevealed >= maxCharactersToReveal) {
                    maxRevealed = true;
                }
                return targetText[i];
            }
            return getRandomCharacter();
        }
        return char;
    })
        .join("");
    return transformedText;
};
/**
 * Scrambles the characters in a string
 *
 * @param text - The text to scramble
 * @param maxCharactersToScramble - The maximum number of characters to scramble
 * @returns The scrambled text
 */
const scrambleCharacters = ({ text, characterSet, maxCharactersToScramble, }) => {
    const characters = text.split("");
    for (let i = 0; i < maxCharactersToScramble; i++) {
        // choose a randomish index
        const randomIndex = Math.floor(Math.random() * characters.length);
        const [temp, temp2] = [characters[i], characters[randomIndex]];
        // introduce some random characters, too
        if (Math.random() > DEFAULT_REVEAL_PROBABILITY) {
            characters[i] = getRandomCharacter(characterSet);
            characters[randomIndex] = getRandomCharacter(characterSet);
        }
        else {
            characters[i] = temp2;
            characters[randomIndex] = temp;
        }
    }
    return characters.join("");
};
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
const calculateNumberOfCharactersToEncode = (defaultText, weight = 1, minCharactersToReveal = MINIMUM_CHARACTERS_TO_REVEAL, maxCharactersToReveal = MAXIMUM_CHARACTERS_TO_REVEAL) => {
    if (maxCharactersToReveal >= defaultText.length - 1) {
        return minCharactersToReveal;
    }
    return (Math.floor(Math.random() * Math.floor(maxCharactersToReveal * weight)) +
        minCharactersToReveal);
};
/**
 * Calculates the number of characters to reveal based on the length of the text
 *
 * @param defaultText - The default text
 * @param weight - A weight to bias the number of characters to reveal
 * @param minCharactersToReveal - The minimum number of characters to reveal
 * @param maxCharactersToReveal - The maximum number of characters to reveal
 * @returns The number of characters to reveal
 */
const calculateNumberOfCharactersToReveal = (defaultText, weight = 1, minCharactersToReveal = MINIMUM_CHARACTERS_TO_REVEAL, maxCharactersToReveal = MAXIMUM_CHARACTERS_TO_REVEAL) => {
    if (maxCharactersToReveal >= defaultText.length - 1) {
        return minCharactersToReveal;
    }
    return (Math.floor(Math.random() * Math.floor(maxCharactersToReveal * weight)) +
        minCharactersToReveal);
};
/**
 * Calculates the number of characters to remove based on the length of the text
 *
 * @param defaultText - The default text
 * @param weight - A weight to bias the number of characters to remove
 * @param minCharactersToRemove - The minimum number of characters to remove
 * @param maxCharactersToRemove - The maximum number of characters to remove
 * @returns The number of characters to remove
 */
const calculateNumberOfCharactersToRemove = (defaultText, weight = 1, minCharactersToRemove = MINIMUM_CHARACTERS_TO_REMOVE, maxCharactersToRemove = MAXIMUM_CHARACTERS_TO_REMOVE) => {
    if (maxCharactersToRemove >= defaultText.length - 1) {
        return minCharactersToRemove;
    }
    return (Math.floor(Math.random() * Math.floor(maxCharactersToRemove * weight)) +
        minCharactersToRemove);
};
/**
 * Calculates the number of characters to add based on the length of the text
 *
 * @param defaultText - The default text
 * @param weight - A weight to bias the number of characters to add
 * @param minCharactersToAdd - The minimum number of characters to add
 * @param maxCharactersToAdd - The maximum number of characters to add
 * @returns The number of characters to add
 */
const calculateNumberOfCharactersToAdd = (defaultText, weight = 1, minCharactersToAdd = MINIMUM_CHARACTERS_TO_ADD, maxCharactersToAdd = MAXIMUM_CHARACTERS_TO_ADD) => {
    if (maxCharactersToAdd >= defaultText.length - 1) {
        return minCharactersToAdd;
    }
    return (Math.floor(Math.random() * Math.floor(maxCharactersToAdd * weight)) +
        minCharactersToAdd);
};
/**
 * Calculates the number of characters to scramble based on the length of the text
 *
 * @param defaultText - The default text
 * @returns The number of characters to scramble
 */
const calculateNumberOfCharactersToScramble = (defaultText) => Math.floor(Math.random() *
    Math.floor(defaultText.length * DEFAULT_REVEAL_PROBABILITY) +
    MINIMUM_CHARACTERS_TO_REVEAL);

/**
 * Ciph3rText is a React component that transforms text between encode, decode, and transform actions.
 *
 * @param props - The component props
 * @param props.action - The style of transformation to perform (encode, decode, or transform)
 * @param props.defaultText - The default text to display
 * @param props.iterationSpeed - The speed of the transformation
 * @param props.maxIterations - The maximum number of iterations
 * @param props.onFinish - The callback function to call when the transformation is finished
 * @param props.targetText - The target text to transform to when props.action is "transform"
 * @returns A React.Fragment animating the transformed text
 */
// eslint-disable-next-line complexity -- this is a complex component
const Ciph3rText = ({ defaultText, onFinish, iterationSpeed: iterationSpeedProp, maxIterations: maxIterationsProp, targetText = "", action = "decode", characters = BASE_PRINTABLE_CHARACTERS, additionalCharactersToInclude = "", ref = null, ...restProps }) => {
    const isClient = useIsClient();
    const characterSet = useMemo(() => (characters += additionalCharactersToInclude), [characters, additionalCharactersToInclude]);
    // throw an error if the default text is not provided
    if (typeof defaultText === "undefined") {
        throw new Error("defaultText is required");
    }
    // attempt to convert the default text to a string if it is not already
    if (typeof defaultText !== "string") {
        try {
            defaultText = String(defaultText);
        }
        catch (error) {
            // if we couldn't turn it into a string, throw an error
            throw new Error("defaultText must be a string");
        }
    }
    // throw an error if the action is "transform" and no target text is provided
    if (action === "transform" &&
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- we're just ensuring we don't end up with a null
        (typeof targetText === "undefined" || targetText === null)) {
        throw new Error('targetText is required for action "transform"');
    }
    // set the iteration speed and max iterations to the default values if they are not provided
    // we do this here because we need to base the default values on the action type
    const iterationSpeed = iterationSpeedProp ?? DEFAULT_SPEED[action];
    const maxIterations = maxIterationsProp ?? DEFAULT_MAX_ITERATIONS[action];
    /**
     * Formats the default text by converting it to a string of random characters if the action is "decode"
     *
     * @remarks
     * This is only used to set the initial state of the formatted text, so we are wrapping it in a useCallback
     * because we'll only need to run it if the action type changes or new defaultText is provided.
     *
     * @returns The formatted text
     */
    const formatDefaultText = (text) => action === "decode" ? randomizeText(text, characterSet) : text;
    const [isDone, setIsDone] = useState(false);
    const [iterations, setIterations] = useState(0);
    const [formattedText, setFormattedText] = useState(formatDefaultText(defaultText));
    /**
     * Scrambles the input text by randomly shuffling the characters
     *
     * @param text The input text to scramble
     * @returns The scrambled text
     */
    const scrambleText = (text) => {
        const numberOfCharactersToScramble = calculateNumberOfCharactersToScramble(defaultText);
        // Use the new revealCharacters utility function
        return scrambleCharacters({
            text,
            characterSet,
            maxCharactersToScramble: numberOfCharactersToScramble,
        });
    };
    /**
     * Converts input text to target text by padding with random characters or deleting
     * characters as needed and randomly revealing 1 to 5 characters up to the max iterations
     *
     * @param text The input text to transform
     * @returns The transformed text with characters added or removed
     */
    const transformText = (text) => {
        if (text === targetText) {
            setIsDone(true);
            return text;
        }
        let transformedText = text;
        // weigh the amount of characters to reveal and add/remove based on the difference between the text lengths
        // higher discrepancies lead to higher weights
        const weight = Math.abs(text.length - targetText.length) / targetText.length;
        if (text.length > targetText.length) {
            // remove a random number of characters less than the difference between the text lengths
            // from the end of the string; clamped between 1 and 5
            let numberOfCharactersToRemove = calculateNumberOfCharactersToRemove(defaultText, weight);
            // fully cut the string if we have reached the max iterations
            if (iterations >= maxIterations) {
                numberOfCharactersToRemove = text.length - targetText.length;
            }
            // remove the characters from the end of the string
            transformedText = transformedText.slice(0, -1 * numberOfCharactersToRemove);
        }
        else if (text.length < targetText.length) {
            // add a random number of characters less than the difference between the text lengths
            // to the end of the string; clamped between 1 and 5
            let numberOfCharactersToAdd = calculateNumberOfCharactersToAdd(defaultText, weight);
            // fully pad the string if we have reached the max iterations
            if (iterations >= maxIterations) {
                numberOfCharactersToAdd = targetText.length - text.length;
            }
            // add the characters to the end of the string
            for (let i = 0; i < numberOfCharactersToAdd; i++) {
                transformedText += getRandomCharacter(characterSet);
            }
        }
        // choose random number of characters to reveal between 1 and 3
        const numberOfCharactersToReveal = calculateNumberOfCharactersToReveal(defaultText, weight);
        // Use the new revealCharacters utility function
        return revealCharacters({
            action,
            sourceText: transformedText,
            targetText,
            maxCharactersToReveal: numberOfCharactersToReveal,
            currentIteration: iterations,
            maxIterations,
        });
    };
    /**
     * Decodes the input text by revealing 1 to 5 random characters at a time up to the max iterations
     *
     * @param text The input text to decode
     * @returns The decoded text with characters revealed
     */
    const decodeText = (text) => {
        if (text === defaultText) {
            setIsDone(true);
            return text;
        }
        const numberOfCharactersToReveal = calculateNumberOfCharactersToReveal(defaultText);
        // Use the new revealCharacters utility function
        return revealCharacters({
            action,
            sourceText: text,
            targetText: defaultText,
            maxCharactersToReveal: numberOfCharactersToReveal,
            currentIteration: iterations,
            maxIterations,
        });
    };
    /**
     * Encodes the input text by gradually replacing characters with random ones until fully encoded
     *
     * @param text The input text to encode
     * @returns The encoded text with characters replaced with random ones
     */
    const encodeText = (text) => {
        // If the text is completely randomized, we're done
        if (text === randomizeText(defaultText, characterSet) ||
            iterations >= maxIterations) {
            // Check if text is completely encoded (no character matches defaultText)
            const isFullyEncoded = text
                .split("")
                .every((char, index) => char !== defaultText.charAt(index));
            if (isFullyEncoded || iterations >= maxIterations) {
                setIsDone(true);
                // If we've hit max iterations or are fully encoded, return a fully randomized text
                return randomizeText(defaultText, characterSet);
            }
        }
        const numberOfCharactersToEncode = calculateNumberOfCharactersToEncode(defaultText);
        // Create a new string to hold our encoded text
        let encodedText = text;
        // Track positions that have already been encoded to avoid re-encoding them
        const encodedPositions = new Set();
        // Keep track of how many characters we've encoded in this iteration
        let encodedCount = 0;
        // Find characters to encode (up to numberOfCharactersToEncode)
        for (let i = 0; i < numberOfCharactersToEncode; i++) {
            // If we've encoded every character or reached our limit, stop
            if (encodedCount >= numberOfCharactersToEncode ||
                encodedCount >= defaultText.length) {
                break;
            }
            // Choose a random position to encode
            const position = Math.floor(Math.random() * defaultText.length);
            // Skip if this position is already encoded or the character doesn't match the original
            if (encodedPositions.has(position) ||
                encodedText.charAt(position) !== defaultText.charAt(position)) {
                continue;
            }
            // Replace the character at this position with a random character
            const chars = encodedText.split("");
            chars[position] = getRandomCharacter(characterSet);
            encodedText = chars.join("");
            // Mark this position as encoded
            encodedPositions.add(position);
            encodedCount++;
        }
        return encodedText;
    };
    useEffect(() => {
        setIsDone(false);
        setIterations(0);
        setFormattedText(formatDefaultText(defaultText));
    }, [defaultText]);
    // this hook will call the onFinish callback if one was supplied
    useEffect(() => {
        if (isDone) {
            // this just gives us a shortcut for checking if the callback is defined and a function we can call
            onFinish?.();
        }
    }, [isDone]);
    // this interval will run while we're animating the text transformation
    useInterval(() => {
        setIterations((previousIterations) => previousIterations + 1);
        setFormattedText((previousText) => {
            switch (action) {
                case "decode":
                    return decodeText(previousText);
                case "encode":
                    return encodeText(previousText);
                case "transform":
                    return transformText(previousText);
                case "scramble":
                    return scrambleText(previousText);
            }
        });
    }, 
    // Run the interval if the action is one of the supported types and we're not done
    ACTIONS.includes(action)
        ? !isDone && (action !== "transform" || defaultText !== targetText)
            ? iterationSpeed
            : null
        : null);
    /**
     * Renders the formatted text or the target text if the action is "transform"
     *
     * @remarks
     * This component checks for isClient and renders the unformatted, original text if this
     * isn't running in the browser. This is useful for server-side rendering and generating
     * SEO-friendly previews of the content - leaving the transformation animation to the browser.
     *
     * @returns The rendered text as a React.Fragment
     */
    return (React.createElement("span", { ref: ref, ...restProps }, isClient
        ? formattedText
        : action === "transform"
            ? targetText
            : defaultText));
};

export { Ciph3rText as default };
//# sourceMappingURL=index.js.map
