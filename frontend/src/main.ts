import './style.css'
import '@xterm/xterm/css/xterm.css'
import { WebLinksAddon } from '@xterm/addon-web-links';
import { FitAddon } from '@xterm/addon-fit'; 
import { Terminal } from '@xterm/xterm';
import { split } from 'shlex';
import colors from 'ansicolor'
import { dispatch } from './commands';
import { error } from './console_utils';

const term = new Terminal();
const fitAddon = new FitAddon();
term.loadAddon(new WebLinksAddon());
term.loadAddon(fitAddon);
term.open(document.getElementById('xterm-container')!);

fitAddon.fit();

window.addEventListener("resize", e => { fitAddon.fit(); });

let command = "";
let last_status = 0;

function prompt() {
  if (last_status == 0) {
    term.write(colors.lightGreen(" $ "));
  } else {
    term.write(colors.lightRed(" $ "));
  }
  command = "";
}

function handleCommand(command: string) {
  let args: string[] = [];

  try {
    args = split(command);
  } catch (e) {
    error(term, `${e}`);
  }

  const arg0 = args[0];

  //term.writeln("");
  //term.writeln(`${bgLightGreen(black("Executing command"))}: ${arg0}`);

  last_status = dispatch(term, args);
}

export function init() {
  term.reset();
  term.options.cursorBlink = true;
  term.focus();
  term.writeln("                                                                                  ");
  term.writeln(colors.green(" ██╗    ██╗███████╗██████╗ ███████╗██╗████████╗███████╗    ██╗  ██╗███████╗ █████╗ ██╗  ████████╗██╗  ██╗"));
  term.writeln(colors.green(" ██║    ██║██╔════╝██╔══██╗██╔════╝██║╚══██╔══╝██╔════╝    ██║  ██║██╔════╝██╔══██╗██║  ╚══██╔══╝██║  ██║"));
  term.writeln(colors.green(" ██║ █╗ ██║█████╗  ██████╔╝███████╗██║   ██║   █████╗      ███████║█████╗  ███████║██║     ██║   ███████║"));
  term.writeln(colors.green(" ██║███╗██║██╔══╝  ██╔══██╗╚════██║██║   ██║   ██╔══╝      ██╔══██║██╔══╝  ██╔══██║██║     ██║   ██╔══██║"));
  term.writeln(colors.green(" ╚███╔███╔╝███████╗██████╔╝███████║██║   ██║   ███████╗    ██║  ██║███████╗██║  ██║███████╗██║   ██║  ██║"));
  term.writeln(colors.green("  ╚══╝╚══╝ ╚══════╝╚═════╝ ╚══════╝╚═╝   ╚═╝   ╚══════╝    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝   ╚═╝  ╚═╝"));
  term.writeln(colors.green("                                                                                                         "));
  term.writeln(" - Version 1.0")


  term.writeln("");
  term.writeln("  type: "  + colors.lightGreen(colors.italic("help")) +" for list of commands")
}

function printable(e: string) {
  return (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0');
}

term.onData(e => {
    switch (e) {
      case '\r':
          term.writeln("");
          handleCommand(command);
          prompt();
          break;
      case '\u000C': // Ctrl+L
          init();
          break;
      case '\u0003': // Ctrl+C
          term.write('^C');
          break;
      case '\u007f': // Backspace
          if (command.length <= 0) {
            break;
          }
          command = command.slice(0, command.length-1);

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
          term.write(e);
          command += e;
          break;
    }
});

init();
prompt();