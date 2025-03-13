import React, { useEffect, useRef, useState } from "react";
import { IconPlayerPlay, IconPlayerStop } from "@tabler/icons-react";
import Ciph3rText from "@/components/Ciph3rText";

import { useSignal } from "@/context/SignalContext";
import { useNotifications } from "@/context/NotificationContext";
import {
  MATRIX_CHARACTER_SET,
  CURSED_CHARACTER_SET,
  RUNES_CHARACTER_SET,
  BLOCKS_CHARACTER_SET,
  MATH_SYMBOLS_CHARACTER_SET,
  // ALL_SYMBOLS_CHARACTER_SET,
  // FULL_CHARACTER_SET,
} from "@/utils/generateCharacterSet";

import { TEXT_COLORS } from "@/constants";

export interface SignalProps {
  id?: string;
  title?: string;
  details?: string;
  message?: string;
  difficulty?: "easy" | "medium" | "hard";
  active?: boolean;
  isDecoded?: boolean;
  isDecoding?: boolean;
}

export default function Signal({
  id = "????",
  title = "Unknown Signal",
  // details = "",
  message = "Testing a message with a lot of characters to see how it looks",
  difficulty = "easy",
  active = false,
  isDecoded = false,
  isDecoding = false,
}: SignalProps): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  // Add refs for animation
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  // Add ref for the audio source node so we can stop it later
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(active);
  // Use ref for animation offset instead of state to avoid re-render issues
  const animationOffsetRef = useRef(0);
  const lastTimestampRef = useRef(0);
  const [scrambledMessage, setScrambledMessage] = useState("");
  const [shouldPause, setShouldPause] = useState(false);

  const { setActiveSignal, activeSignal, signals, updateSignal } = useSignal();
  const { addNotification } = useNotifications();

  // Initialize audio context only once
  useEffect(() => {
    try {
      audioContextRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
      console.log("AudioContext initialized successfully");
    } catch (error) {
      console.error("Failed to initialize AudioContext:", error);
    }

    // Cleanup on unmount
    return () => {
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const characterSet =
      difficulty === "easy"
        ? MATRIX_CHARACTER_SET
        : difficulty === "medium"
        ? RUNES_CHARACTER_SET + BLOCKS_CHARACTER_SET
        : CURSED_CHARACTER_SET + MATH_SYMBOLS_CHARACTER_SET;

    setScrambledMessage(
      message
        .split(" ")
        .map((word) => {
          return word
            .split("")
            .map(() => {
              return characterSet[
                Math.floor(Math.random() * characterSet.length)
              ];
            })
            .join("");
        })
        .join(" ")
    );
  }, [message, difficulty]);

  // Convert message to audio data
  useEffect(() => {
    if (!message || !audioContextRef.current) {
      console.log("No message or audio context available");
      return;
    }

    const generateAudioFromMessage = async () => {
      try {
        const audioContext = audioContextRef.current!;
        console.log(
          "Generating audio from message:",
          message.substring(0, 20) + "..."
        );

        // Generate a longer audio buffer for proper playback
        const sampleRate = audioContext.sampleRate;
        const duration = 8; // Increase duration from 5 to 8 seconds
        const bufferSize = sampleRate * duration;

        const buffer = audioContext.createBuffer(1, bufferSize, sampleRate);
        const channelData = buffer.getChannelData(0);

        // Generate message fingerprint for consistent audio characteristics
        let fingerprint = 0;
        for (let i = 0; i < message.length; i++) {
          fingerprint += message.charCodeAt(i);
        }

        // Lower frequency range for deeper sound (80-280 Hz instead of 220-660 Hz)
        const basePitch = 80 + (fingerprint % 200);
        // Slower modulation for a more ominous feel
        const modulationRate = 0.2 + (fingerprint % 60) / 100;
        const modulationDepth = 0.15 + (fingerprint % 40) / 200;
        // Slightly increased noise for texture
        const noiseLevel = 0.08 + (fingerprint % 20) / 200;

        console.log("Audio characteristics:", {
          basePitch,
          modulationRate,
          modulationDepth,
          noiseLevel,
          bufferSize,
          duration,
        });

        // Find all spaces in the message to create drum beats
        const spacePositions = [];
        for (let i = 0; i < message.length; i++) {
          if (message[i] === " ") {
            spacePositions.push(i);
          }
        }

        console.log(`Found ${spacePositions.length} spaces for drum beats`);

        // Create a mapping of space positions to time positions in the audio
        const drumBeats = spacePositions.map((pos) => {
          // Create a cyclical pattern throughout the audio duration
          return (pos / message.length) * bufferSize;
        });

        // Create a reverb buffer to simulate reverb effect
        const createReverb = (
          signal: Float32Array,
          delayMs: number,
          decay: number
        ) => {
          const delaySamples = Math.floor((delayMs / 1000) * sampleRate);
          const result = new Float32Array(signal.length);

          // Copy original signal
          for (let i = 0; i < signal.length; i++) {
            result[i] = signal[i];
          }

          // Add delayed copies with progressively less volume
          for (let i = delaySamples; i < signal.length; i++) {
            result[i] += signal[i - delaySamples] * decay;
          }

          return result;
        };

        // Fill the buffer with procedural audio based on message properties
        for (let i = 0; i < bufferSize; i++) {
          const time = i / sampleRate;

          // Generate carrier wave with frequency modulation
          const modulation =
            Math.sin(2 * Math.PI * modulationRate * time) * modulationDepth;
          const instantFreq = basePitch * (1 + modulation);

          // Add harmonics based on message content with emphasis on lower harmonics
          let sample = 0;
          for (let h = 1; h <= 4; h++) {
            // Emphasize lower harmonics for deeper sound
            const harmonicStrength =
              (h === 1 ? 0.7 : 0.3) / (h * (1 + (fingerprint % 10) / 10));
            sample +=
              harmonicStrength * Math.sin(2 * Math.PI * instantFreq * h * time);
          }

          // Add sub-harmonic for deeper feel (half frequency)
          if (fingerprint % 3 === 0) {
            // More frequent sub-harmonics
            sample += 0.4 * Math.sin(Math.PI * instantFreq * time);
          }

          // Reduce the main signal volume to make room for the drums
          sample = sample * 0.5; // Reduced from 0.5 to 0.3

          // Add drum beats for spaces in the message
          for (const beatPos of drumBeats) {
            // Calculate how far we are from the beat position
            const distFromBeat = Math.abs(i - beatPos);
            const drumDuration = sampleRate * 0.15; // Increased from 0.1 to 0.15 seconds

            if (distFromBeat < drumDuration) {
              // Create a drum-like sound that decays over time
              const decay = Math.exp(-distFromBeat / (drumDuration * 0.5)); // Even slower decay

              // Bass drum component (50-90 Hz) - slightly deeper
              const drumFreq = 50 + (fingerprint % 40);
              const bassDrum = Math.sin(
                2 * Math.PI * drumFreq * (distFromBeat / sampleRate)
              );

              // Add some higher frequency attack for "click" sound
              const clickFreq = 1000 + (fingerprint % 500);
              const clickDecay = Math.exp(
                -distFromBeat / (drumDuration * 0.05)
              );
              const click =
                Math.sin(
                  2 * Math.PI * clickFreq * (distFromBeat / sampleRate)
                ) *
                clickDecay *
                0.5; // Increased from 0.4

              // Add drum sound to the sample with further increased amplitude
              sample += bassDrum * decay * 4.0 + click; // Increased from 1.2 to 2.0
            }

            // Create echo-repeats for longer messages with more spaces
            if (spacePositions.length > 3) {
              const echoDelay = sampleRate * 0.3;
              const echoBeatPos = beatPos + echoDelay;
              const distFromEchoBeat = Math.abs(i - echoBeatPos);

              if (distFromEchoBeat < drumDuration * 0.7) {
                const echoDecay =
                  Math.exp(-distFromEchoBeat / (drumDuration * 0.2)) * 0.7; // Increased from 0.6
                const echoDrum = Math.sin(
                  2 *
                    Math.PI *
                    (60 + (fingerprint % 30)) * // Lowered from 70 to 60
                    (distFromEchoBeat / sampleRate)
                );
                sample += echoDrum * echoDecay * 0.9; // Increased from 0.7 to 0.9
              }
            }

            // Add a second echo for more reverb-like effect
            if (spacePositions.length > 2) {
              const echo2Delay = sampleRate * 0.5; // 500ms second echo
              const echo2BeatPos = beatPos + echo2Delay;
              const distFromEcho2Beat = Math.abs(i - echo2BeatPos);

              if (distFromEcho2Beat < drumDuration * 0.6) {
                const echo2Decay =
                  Math.exp(-distFromEcho2Beat / (drumDuration * 0.3)) * 0.5;
                const echo2Drum = Math.sin(
                  2 *
                    Math.PI *
                    (55 + (fingerprint % 25)) *
                    (distFromEcho2Beat / sampleRate)
                );
                sample += echo2Drum * echo2Decay * 0.6;
              }
            }
          }

          // Add some noise based on message characteristics
          const noise = (Math.random() * 2 - 1) * noiseLevel;

          // Add occasional blips/artifacts based on message characters
          if (i % sampleRate < sampleRate / 20) {
            const charIndex = Math.floor(i / sampleRate) % message.length;
            const charCode = message.charCodeAt(charIndex);
            if (charCode % 7 === 0) {
              sample *= 1 + (charCode % 5) / 10;
            }
          }

          // Combine signal and noise
          channelData[i] = sample + noise;
        }

        // Apply a simple envelope to avoid clicks
        const fadeTime = Math.floor(sampleRate * 0.05); // 50ms fade

        // Fade in
        for (let i = 0; i < fadeTime; i++) {
          const fade = i / fadeTime;
          channelData[i] *= fade;
        }

        // Fade out
        for (let i = 0; i < fadeTime; i++) {
          const fade = i / fadeTime;
          channelData[bufferSize - 1 - i] *= fade;
        }

        // Apply reverb to the entire signal
        const reverbedSignal = createReverb(channelData, 80, 0.3); // 80ms delay, 0.3 decay
        const reverbedSignal2 = createReverb(reverbedSignal, 150, 0.2); // Second reverb layer

        // Mix back to the main buffer
        for (let i = 0; i < bufferSize; i++) {
          channelData[i] = reverbedSignal2[i];
        }

        // Final normalization to prevent clipping
        let maxAmp = 0;
        for (let i = 0; i < bufferSize; i++) {
          maxAmp = Math.max(maxAmp, Math.abs(channelData[i]));
        }

        if (maxAmp > 0.8) {
          const normalizeRatio = 0.8 / maxAmp;
          for (let i = 0; i < bufferSize; i++) {
            channelData[i] *= normalizeRatio;
          }
          console.log("Applied normalization with ratio:", normalizeRatio);
        }

        console.log("Audio buffer created with duration:", duration, "seconds");
        setAudioBuffer(buffer);

        // Reset animation offset when creating new audio
        animationOffsetRef.current = 0;
      } catch (error) {
        console.error("Error generating audio data:", error);
      }
    };

    generateAudioFromMessage();
  }, [message]);

  // Draw animated waveform on canvas
  const drawWaveform = (timestamp: number) => {
    if (!canvasRef.current || !audioBuffer) {
      return;
    }

    // Calculate delta time for smooth animation regardless of frame rate
    if (!lastTimestampRef.current) {
      lastTimestampRef.current = timestamp;
    }
    const deltaTime = timestamp - lastTimestampRef.current;
    lastTimestampRef.current = timestamp;

    const canvas = canvasRef.current;
    // Ensure canvas has proper dimensions
    if (!canvas.width) {
      canvas.width = canvas.clientWidth || 400;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Could not get canvas context");
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background with subtle gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#e8e8e8"); //"#e8e8e8");
    gradient.addColorStop(0.45, "#e0e0e0");
    gradient.addColorStop(0.5, "#000"); //"#e0e0e0");
    gradient.addColorStop(0.55, "#e0e0e0");
    gradient.addColorStop(1, "#e8e8e8"); //"#e0e0e0");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Get audio data
    const channelData = audioBuffer.getChannelData(0);
    const center = canvas.height / 2;
    const animationSpeed = 0.15; // Increased speed for more intense movement

    // Enhanced visualization settings
    ctx.lineWidth = 2.5; // Thicker line for more impact
    ctx.strokeStyle = "#0f766e"; // Teal color for the waveform

    // Add a stronger glow effect
    ctx.shadowColor = "rgba(15, 118, 110, 0.5)"; // Increased intensity
    ctx.shadowBlur = 8; // Increased blur
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw the fluid waveform
    const drawFluidWaveform = () => {
      ctx.beginPath();

      // Set initial position at the center
      ctx.moveTo(0, center);

      // Time-based modifiers for movement - more dramatic
      const timeModifier = timestamp / 1200; // Faster time modifier
      const waveModifier = Math.sin(timeModifier) * 0.6 + 0.7; // Larger amplitude

      // Smooth flowing detail level
      const sliceWidth = canvas.width / 150; // More detailed waveform

      // Draw the fluid waveform
      for (let i = 0; i < canvas.width; i++) {
        // Add more dramatic movement with multiple overlapping cycles
        const cycle1 = Math.sin(i * 0.03 + timeModifier * 3) * 0.35; // More intense primary wave
        const cycle2 = Math.sin(i * 0.015 + timeModifier * 2) * 0.25; // More intense secondary wave
        const cycle3 = Math.cos(i * 0.007 + timeModifier * 1.5) * 0.15; // Add tertiary wave
        const cycleFactor = cycle1 + cycle2 + cycle3;

        // Calculate position in audio data with wrapping and animation
        const dataPos =
          (i * sliceWidth + animationOffsetRef.current) % channelData.length;

        // Smooth sampling
        const index = Math.floor(dataPos);
        const fraction = dataPos - index;

        // Get multiple samples for smoother interpolation
        const idx1 = index % channelData.length;
        const idx2 = (index + 1) % channelData.length;
        const idx3 = (index + 2) % channelData.length;

        // Cubic-like interpolation for silky smooth curves
        const v0 = channelData[idx1];
        const v1 = channelData[idx2];
        const v2 = channelData[idx3];

        // Hermite interpolation for smoother curves
        const tension = 0.5;
        const sample =
          v1 +
          fraction *
            ((v2 - v0) * tension +
              fraction * ((v2 - v1) * (1 - tension) - (v1 - v0) * tension));

        // Apply stronger non-linear amplification
        const amplifiedSample =
          Math.sign(sample) * Math.pow(Math.abs(sample), 0.7); // More aggressive curve

        // Add random micro-fluctuations for visual interest
        const microNoise = (Math.random() - 0.5) * 0.05;

        // Combine with cyclical movement and add micro-noise
        const combinedSample =
          amplifiedSample * waveModifier + cycleFactor + microNoise;

        // Scale amplitude higher for more dramatic effect
        const amplitude = center * 0.85; // Increased amplitude
        const y = center + combinedSample * amplitude;

        // Draw line to this point
        ctx.lineTo(i, y);
      }

      ctx.stroke();

      // Add accent lines
      ctx.beginPath();
      ctx.strokeStyle = "rgba(15, 118, 110, 0.3)";
      ctx.lineWidth = 1;

      // Add pulse effect based on bass frequencies
      const pulseRate = Math.sin(timestamp * 0.002) * 0.5 + 0.5;
      const pulseScale = center * 0.3 * pulseRate;

      // Draw 3 accent lines that follow the main waveform rhythm
      for (let j = 0; j < 3; j++) {
        ctx.beginPath();
        const offset = (j - 1) * pulseScale;

        for (let i = 0; i < canvas.width; i += 4) {
          // Draw fewer points for performance
          const dataPos =
            (i * sliceWidth + animationOffsetRef.current * (1 + j * 0.1)) %
            channelData.length;
          const index = Math.floor(dataPos);
          const idx = index % channelData.length;

          // Get base sample and apply different amplification
          const rawSample = channelData[idx];
          const accentSample =
            Math.sign(rawSample) * Math.pow(Math.abs(rawSample), 0.65) * 0.7;

          // Calculate position with offset and reduced amplitude
          const y = center + accentSample * center * 0.7 + offset;

          if (i === 0) {
            ctx.moveTo(i, y);
          } else {
            ctx.lineTo(i, y);
          }
        }
        ctx.stroke();
      }
    };

    // Add more dynamic background effects
    const drawBackgroundEffect = () => {
      // Stronger ambient glow that moves with the animation
      const glowIntensity = (Math.sin(timestamp * 0.002) * 0.5 + 0.5) * 0.25; // More intense glow
      const gradientSize = canvas.width * 0.7; // Larger gradient
      const gradientX = ((timestamp * 0.05) % gradientSize) + gradientSize; // Faster movement

      const radialGradient = ctx.createRadialGradient(
        gradientX,
        center,
        0,
        gradientX,
        center,
        canvas.width * 0.8
      );

      radialGradient.addColorStop(0, `rgba(15, 118, 110, ${glowIntensity})`);
      radialGradient.addColorStop(1, "rgba(15, 118, 110, 0)");

      ctx.fillStyle = radialGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // Draw in layers for visual depth
    drawBackgroundEffect();
    drawFluidWaveform();

    // Update animation offset - faster movement with acceleration/deceleration cycles
    const speedVariation = Math.sin(timestamp * 0.0005) * 0.05 + 1; // Vary speed over time
    animationOffsetRef.current =
      (animationOffsetRef.current +
        animationSpeed * speedVariation * (deltaTime / 16.67)) %
      channelData.length;

    // Continue animation only if playing
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(drawWaveform);
    }
  };

  // Draw idle waveform when not playing
  const clearWaveform = () => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw just the background with subtle gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#e8e8e8");
    gradient.addColorStop(1, "#e0e0e0");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Handle animation state changes for isPlaying changes
  useEffect(() => {
    // This effect primarily handles animation starts/stops based on play state changes
    if (isPlaying && audioBuffer) {
      console.log("Play state changed to playing, starting waveform animation");
      // Reset timestamp for smooth animation
      lastTimestampRef.current = 0;
      // Start the animation with the timestamp parameter
      animationRef.current = requestAnimationFrame(drawWaveform);
    } else if (!isPlaying && animationRef.current) {
      // Stop the animation when playback stops
      console.log("Play state changed to stopped, stopping animation");
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;

      // Clear the waveform when stopping audio if in waveform view
      if (audioBuffer) {
        clearWaveform();
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPlaying, audioBuffer]);

  // Handle view changes
  useEffect(() => {
    if (isPlaying && audioBuffer) {
      // Cancel any existing animation frame to avoid duplicates
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Reset timestamp for smooth animation
      lastTimestampRef.current = 0;
      // Start the animation
      animationRef.current = requestAnimationFrame(drawWaveform);
    } else if (audioBuffer) {
      // If not playing but we have audio data, clear the waveform
      clearWaveform();
    }
  }, [isPlaying, audioBuffer]);

  const togglePlay = () => {
    if (!audioBuffer || !audioContextRef.current) {
      console.error("Audio buffer or context not available");
      return;
    }

    // If already playing, stop the audio
    if (isPlaying && sourceNodeRef.current) {
      try {
        console.log("Stopping audio playback");
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
        setIsPlaying(false);

        setActiveSignal(null);

        clearWaveform();
      } catch (error) {
        console.error("Error stopping audio:", error);
      }
      return;
    }

    // Otherwise, start playback
    try {
      // Resume audio context if it's suspended (browser autoplay policy)
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;

      // Enable looping
      source.loop = true;

      // Slow down playback rate
      source.playbackRate.value = 0.25; // 75% of normal speed

      source.connect(audioContextRef.current.destination);

      // Store source node in ref for later access
      sourceNodeRef.current = source;

      // Add event listeners for debugging
      source.onended = () => {
        console.log("Audio playback ended");
        // Clean up reference if it ends naturally
        sourceNodeRef.current = null;
        setIsPlaying(false);
      };

      console.log("Starting looped audio playback at 50% speed");
      source.start();

      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.stop();
          sourceNodeRef.current.disconnect();
        } catch (error) {
          console.error("Error cleaning up audio source:", error);
        }
        sourceNodeRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    const handleMouseOver = () => {
      setShouldPause(true);
    };

    const handleMouseLeave = () => {
      setShouldPause(false);
    };

    canvas?.addEventListener("mousedown", handleMouseOver);
    canvas?.addEventListener("mouseup", handleMouseLeave);

    return () => {
      canvas?.removeEventListener("mousedown", handleMouseOver);
      canvas?.removeEventListener("mouseup", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    if (activeSignal?.id === id) {
      togglePlay(true);
    }
  }, [activeSignal?.id]);

  const renderSignalText = () => {
    if (isPlaying) {
      if (isDecoded) {
        return (
          <Ciph3rText defaultText={message} action="wave" preserveSpaces />
        );
      } else if (isDecoding) {
        return (
          <Ciph3rText
            defaultText={message}
            action="decode"
            targetText={message}
            iterationSpeed={120}
            onFinish={() => {
              const signal = signals.find((s) => s.id === id);

              if (signal && signal.id === "0001") {
                updateSignal({
                  ...signal,
                  title: "Rickroll",
                  isDecoded: true,
                  isDecoding: false,
                });

                addNotification({
                  title: "Got 'em!",
                  message: [
                    "How'd you like that Rickroll?",
                    "Seriously, though, you should scan for some new signals.",
                  ],
                  type: "info",
                });
              }
            }}
          />
        );
      } else {
        const messageParts = [];
        let currentPart = [];

        for (let i = 0; i < scrambledMessage.length; i++) {
          const char = scrambledMessage[i];

          if (Math.random() < 0.5) {
            currentPart.push(char);
            i++;
          } else {
            messageParts.push(currentPart);
            currentPart = [];
          }
        }

        if (currentPart.length > 0) {
          messageParts.push(currentPart);
        }

        // Use the actual encrypted text rather than displaying random characters
        return messageParts.map((part, index) => (
          <Ciph3rText
            key={index}
            className={`signal-part ${
              TEXT_COLORS[Math.floor(Math.random() * TEXT_COLORS.length)]
            }`}
            defaultText={part.join("")}
            action="scramble"
            iterationSpeed={120}
            shouldPause={shouldPause}
            onMouseEnter={() => setShouldPause(true)}
            onMouseLeave={() => setShouldPause(false)}
          />
        ));
      }
    } else {
      return <></>;
    }
  };

  return (
    <div className="relative flex flex-row items-center justify-start w-full h-20 p-2 bg-neutral-200 rounded-sm text-neutral-950 font-mono text-sm">
      <h3 className="w-1/6 uppercase">{title}</h3>
      <div
        className="flex flex-row w-2/3 items-center justify-center h-16 bg-neutral-200 rounded-md border-2 border-emerald-800 mr-4 overflow-hidden"
        onMouseLeave={() => setShouldPause(false)}
      >
        {renderSignalText()}
      </div>
      <canvas
        ref={canvasRef}
        width={300}
        className="w-1/4 h-16 bg-neutral-200 rounded-md border-2 border-emerald-800 mr-6"
      />
      <button
        onClick={() => {
          togglePlay();
        }}
        className="ml-auto appearance-none border-none bg-transparent text-neutral-600 cursor-pointer"
      >
        {isPlaying ? (
          <IconPlayerStop size={20} />
        ) : (
          <IconPlayerPlay size={20} />
        )}
      </button>
      <div className="absolute bottom-1 left-2">
        <span className="text-xs text-neutral-400">#{id}</span>
      </div>
    </div>
  );
}
