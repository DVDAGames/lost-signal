"use client";

import { useState } from "react";
import { COMMANDS } from "./commands";

export default function Terminal(): React.ReactElement {
  const [command, setCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [commandHistoryIndex, setCommandHistoryIndex] = useState(0);
  const [commandOutput, setCommandOutput] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setCommandHistory((history) => [...history, command]);
    setCommand("");
    setCommandOutput((output) => [...output, command]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommand(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
        break;
      case "Tab":
        e.preventDefault();
        const suggestions = COMMANDS.filter((c) => c.name.startsWith(command));

        if (suggestions.length === 1) {
          if (suggestions[0].usage.includes(" ")) {
            setCommand(suggestions[0].name + " ");
          } else {
            setCommand(suggestions[0].name);
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
    } else {
      setCommand(commandHistory[index]);
      setCommandHistoryIndex(index);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-col items-start justify-start border-2 border-gray-300 rounded-md p-2 min-h-[60%] h-[60%]">
        <div className="flex flex-row items-center justify-start w-full h-full">
          <ol className="flex flex-col items-start justify-start w-full h-full">
            {commandOutput.map((output, index) => (
              <li key={index}>{output ?? ""}</li>
            ))}
          </ol>
        </div>
        <div className="flex flex-row items-center justify-start">
          <form
            className="flex flex-row items-center justify-start"
            onSubmit={handleSubmit}
          >
            <label
              htmlFor="command"
              className="text-sm font-mono text-orange-700 font-bold"
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
              className="w-full bg-transparent outline-none"
              value={command}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </form>
        </div>
      </div>
    </div>
  );
}
