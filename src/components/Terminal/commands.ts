export type CommandName =
  | "help"
  | "clear"
  | "exit"
  | "scan"
  | "listen"
  | "decode";

export interface Command {
  name: CommandName;
  description: string;
  flags?: Record<string, string>;
  usage?: string;
  handler?: (...args: string[]) => Promise<string[]>;
  output?: string;
}

export const COMMANDS: Command[] = [
  {
    name: "help",
    description: "Show help",
    usage: "help <command>",
  },
  {
    name: "clear",
    description: "Clear the terminal",
  },
  {
    name: "exit",
    description: "Exit the terminal",
  },
  {
    name: "scan",
    description: "Scan for signals",
  },
  {
    name: "decode",
    description: "Decode a signal",
    usage: "decode #<signal>",
  },
];

const MAP = COMMANDS.reduce((obj: Record<CommandName, Command>, command) => {
  obj[command.name] = command;

  return obj;
}, {} as Record<CommandName, Command>);

MAP.help.output = `Available commands: ${COMMANDS.map(
  (command) => command.name
).join(", ")}`;

MAP.help.handler = async (commandName: string): Promise<string[]> => {
  console.log(commandName);
  const command = MAP[commandName as CommandName];

  if (!command) {
    throw new Error(`${commandName} not found`);
  }

  return [command.name, command.description, command.usage ?? ""];
};

export const COMMAND_MAP = MAP;
