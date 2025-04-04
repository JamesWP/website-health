import { Terminal } from '@xterm/xterm';

function printable(e: string) {
  return (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0');
}

class Command {
  constructor(public readonly command: string, public readonly user_entered: boolean) { }
}

export async function userCommand(term: Terminal, options?: {hideInput?: boolean}): Promise<Command> {
  let command: string = "";

  // Create a promise which we can resolve later in the onData handler
  let resolveCommandPromise = (c: Command) => { };
  let commandPromise = new Promise<Command>((resolve) => {
    resolveCommandPromise = resolve;
  });

  // Handle user input untill we reach the end of a command or another exit point is reached
  const onDataHandle = term.onData(e => {
    switch (e) {
      case '\r': // Enter
        term.writeln("");
        resolveCommandPromise(new Command(command, true));
        break;
      case '\u000C': // Ctrl+L - Clear screen
        resolveCommandPromise(new Command("clear", false));
        break;
      case '\u0003': // Ctrl+C - Abort this prompt
        term.writeln('^C');
        resolveCommandPromise(new Command("", false));
        break;
      case '\u0004': // Ctrl+D - End-of-file - Exit this prompt
        term.writeln('^D');
        return new Command("quit", false);
      case '\u007f': // Backspace
        if (command.length <= 0) {
          break;
        }
        command = command.slice(0, command.length - 1);

        // move cursor back
        term.write("\b");

        // overwrite with space
        term.write(" ");

        // move back oncemore to let user continue typing
        term.write("\b");
        break;
      default:
        if (!printable(e)) {
          break;
        }
        if (options?.hideInput?? false) {
          term.write("*");
        } else {
          term.write(e);
        }
        command += e;
        break;
    }
  });

  // Await the completion of a full command
  let finishedCommand = await commandPromise;

  // clear our event handler, we're done reading input ... for now :)
  onDataHandle.dispose();

  return finishedCommand;
}
