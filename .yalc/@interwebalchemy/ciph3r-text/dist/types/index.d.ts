import React from "react";
import type { Ciph3rTextProps } from "./types";
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
declare const Ciph3rText: ({ defaultText, onFinish, iterationSpeed: iterationSpeedProp, maxIterations: maxIterationsProp, targetText, action, characters, additionalCharactersToInclude, ref, ...restProps }: React.ComponentPropsWithRef<"span"> & Ciph3rTextProps) => React.ReactElement<React.ComponentPropsWithRef<"span">>;
export default Ciph3rText;
