"use client";

import { useEffect, useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import Ciph3rText from "@interwebalchemy/ciph3r-text";

import { COMMANDS, COMMAND_MAP, CommandName } from "./commands";
import { useSignal } from "@/context/SignalContext";

import "./terminal.css";

export interface TerminalProps {
  open?: boolean;
  locked?: boolean;
  toggleTerminal?: () => void;
}

export default function Terminal({
  open = false,
  locked = false,
  toggleTerminal,
}: TerminalProps): React.ReactElement {
  const [command, setCommand] = useState<string>("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [commandHistoryIndex, setCommandHistoryIndex] = useState(0);
  const [commandOutput, setCommandOutput] = useState<string[][]>([]);
  const [commandUsageHint, setCommandUsageHint] = useState<string[]>([]);
  const [displayCommand, setDisplayCommand] = useState<string>("");
  const [displayCommandOutput, setDisplayCommandOutput] = useState<string[]>(
    []
  );
  const { activeSignal, setActiveSignal, signals, updateSignal } = useSignal();

  const terminalRef = useClickAway<HTMLDivElement>(() => {
    if (open) {
      toggleTerminal?.();
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!command) {
      return;
    }

    const [thisCommand, ...args] = command.split(" ");

    const thisArgs = args.filter((arg) => arg).map((arg) => arg.trim());

    const getOutput = async (...args: string[]) => {
      return await COMMAND_MAP[thisCommand as CommandName].handler?.(...args);
    };

    if (command === "clear") {
      setCommandOutput([]);
      setDisplayCommand("");
      setDisplayCommandOutput([]);
    } else if (command.startsWith("decode")) {
      const signalId = command.split(" ")[1].replace("#", "");

      const signal = signals.find((s) => s.id === signalId);

      if (signal) {
        updateSignal({
          ...signal,
          isDecoding: true,
        });

        setActiveSignal(signal);

        setDisplayCommandOutput(["Decoding signal..."]);
      } else {
        setDisplayCommandOutput(["ERROR", `Signal ${signalId} not found`]);
      }
    } else {
      if (
        typeof COMMAND_MAP?.[thisCommand as CommandName]?.handler ===
          "function" &&
        thisArgs.length > 0
      ) {
        getOutput(...thisArgs)
          .then((newOutput) => {
            if (newOutput) {
              setDisplayCommand(command);
              setDisplayCommandOutput(newOutput);
            }
          })
          .catch((error) => {
            setCommandOutput((output) => [...output, ["ERROR", error.message]]);
          });
      } else if (
        typeof COMMAND_MAP?.[thisCommand as CommandName]?.output === "string"
      ) {
        const newOutput = COMMAND_MAP[thisCommand as CommandName].output;

        if (newOutput) {
          setDisplayCommand(command);
          setDisplayCommandOutput(newOutput.split(" "));
        }
      } else if (
        typeof COMMAND_MAP?.[thisCommand as CommandName] === "undefined"
      ) {
        setDisplayCommand(command);
        setDisplayCommandOutput(["ERROR", `${command} not found`]);
      }
    }

    setCommand("");
    setCommandUsageHint([]);
    setCommandHistory((history) => [...history, command]);
    setCommandHistoryIndex((i) => (i += 1));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommand(e.target.value as CommandName);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "`":
        e.preventDefault();
        break;
      case "Enter":
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
        break;
      case "Tab":
        e.preventDefault();

        // TODO: add support for TAB after typing the first part of command, like: `help s<TAB>` or `help<TAB>`
        if (commandUsageHint.length === 0) {
          const suggestions = COMMANDS.filter((c) =>
            c.name.startsWith(command)
          );

          if (suggestions.length === 1) {
            if (
              typeof suggestions[0]?.usage !== "undefined" &&
              suggestions[0].usage.includes(" ")
            ) {
              setCommand(suggestions[0].name + " ");
              setCommandUsageHint(
                suggestions[0].usage.split(" ").filter((c) => c !== "")
              );
            } else {
              setCommand(suggestions[0].name);
              setCommandUsageHint([]);
            }
          } else {
            setCommandUsageHint(suggestions.map((s) => s.name));
          }
        } else {
          const hintParts = commandUsageHint.filter(
            (h) => !command.includes(h)
          );

          const commandParts = command.split(" ").splice(1);

          // TODO: fix how this is handled at some point - it seems to work once and then fail
          if (hintParts.length > 0) {
            switch (hintParts[0]) {
              case "<command>": {
                const commandSuggestions = COMMANDS.filter((c) =>
                  c.name.startsWith(commandParts[0])
                ).map((c) => c.name);

                if (commandSuggestions.length > 1) {
                  setCommandUsageHint(commandSuggestions);
                } else {
                  setCommandUsageHint([]);
                  setCommand(
                    (command) =>
                      command.split(" ").slice(0, -1).join(" ") +
                      " " +
                      commandSuggestions[0]
                  );
                }

                break;
              }

              case "#<signal>": {
                setCommand(command + "#");

                const commandSuggestions = signals.map((s) => s.id);

                console.log(commandSuggestions);

                if (commandSuggestions.length > 1) {
                  setCommandUsageHint(commandSuggestions);
                } else {
                  setCommandUsageHint([]);
                  setCommand(command + "#" + commandSuggestions[0]);
                }

                break;
              }

              default:
                break;
            }
          } else {
            setCommandUsageHint([]);
          }
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        handleCommandHistory("up");
        break;
      case "ArrowDown":
        e.preventDefault();
        handleCommandHistory("down");
        break;
      case "Escape":
        e.preventDefault();
        setCommand("");
        setCommandUsageHint([]);
        break;
      default:
        break;
    }
  };

  const handleCommandHistory = (direction: "up" | "down") => {
    let index = commandHistoryIndex;

    if (direction === "up") {
      index = commandHistoryIndex - 1;
    }

    if (direction === "down") {
      index = commandHistoryIndex + 1;
    }

    if (index < 0 || index >= commandHistory.length) {
      setCommandHistoryIndex(commandHistory.length - 1);
      setCommand("");
      setCommandUsageHint([]);
    } else {
      setCommand(commandHistory[index]);
      setCommandHistoryIndex(index);
      setCommandUsageHint([]);
    }
  };

  const renderCommandOutput = (): React.ReactNode[] => {
    return commandOutput.map((line, index) => (
      <li key={index} className="flex flex-col items-start justify-start">
        <div className="flex flex-row items-center justify-start">
          {line.map((l, i) => (
            <span
              key={`${index}-${i}`}
              className={`text-md mr-2${
                l.includes("ERROR") ? " text-red-500" : ""
              }`}
            >
              {l}
            </span>
          ))}
        </div>
      </li>
    ));
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!locked) {
        if (e.key === "`") {
          e.preventDefault();
          toggleTerminal?.();
        }
      }
    };

    document.addEventListener("keyup", handleGlobalKeyDown);

    return () => {
      document.removeEventListener("keyup", handleGlobalKeyDown);
    };
  }, [locked]);

  useEffect(() => {
    if (!command) {
      setCommandUsageHint([]);
    }
  }, [command]);

  return (
    <div
      ref={terminalRef}
      id="terminal"
      className={`z-50 flex flex-col items-start justify-start bg-gray-900 border-2 border-gray-300 font-mono text-emerald-600 rounded-md p-2 h-[45vh] w-[100vw]${
        open ? " open" : ""
      }`}
    >
      <ol className="flex flex-col items-start justify-start w-full h-full">
        {renderCommandOutput()}
        <li id="active-command">
          {displayCommandOutput && displayCommandOutput.length > 0 && (
            <Ciph3rText
              className="animate-fade-in-quick"
              defaultText={displayCommand}
              action={"transform"}
              targetText={displayCommandOutput.join(" ")}
              iterationSpeed={25}
              maxIterations={35}
              onFinish={() => {
                setDisplayCommand("");
                setDisplayCommandOutput([]);
                setCommandOutput((output) => [...output, displayCommandOutput]);
              }}
            />
          )}
        </li>
      </ol>
      <div className="flex flex-col items-center justify-start align-start w-full">
        <div className="flex flex-row items-center justify-start pl-[20px] text-md text-gray-500 w-full">
          {commandUsageHint.map((hint, index) => (
            <div key={index} className="mr-2">
              {hint}
            </div>
          ))}
        </div>
        <form
          className="relative flex flex-row items-center justify-start w-full"
          onSubmit={handleSubmit}
        >
          <label
            htmlFor="command"
            className="text-md font-mono text-orange-700 font-bold"
          >
            {">"}&nbsp;
          </label>
          <input
            ref={(el) => {
              if (el) {
                el.focus();
              }
            }}
            type="text"
            name="command"
            id="command"
            className="w-full bg-transparent outline-none caret-emerald-500"
            value={command}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}
