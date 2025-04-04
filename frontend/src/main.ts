import './style.css'
import '@xterm/xterm/css/xterm.css'
import { WebLinksAddon } from '@xterm/addon-web-links';
import { FitAddon } from '@xterm/addon-fit'; 
import { Terminal } from '@xterm/xterm';
import { split } from 'shlex';
import colors from 'ansicolor'
import { dispatch } from './commands';
import { error } from './console_utils';
import { userCommand } from './user_command';

const term = new Terminal();
const fitAddon = new FitAddon();
term.loadAddon(new WebLinksAddon());
term.loadAddon(fitAddon);
term.open(document.getElementById('xterm-container')!);

fitAddon.fit();

window.addEventListener("resize", e => { fitAddon.fit(); });

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

let last_status = 0;

function prompt() {
  if (last_status == 0) {
    term.write(colors.lightGreen(" $ "));
  } else {
    term.write(colors.lightRed(" $ "));
  }
}

async function main() {
  init();
  while (true) {
    prompt();

    const command = await userCommand(term);

    let args: string[] = [];

    try {
      args = split(command.command);
    } catch (e) {
      error(term, `${e}`);
    }

    await dispatch(term, args);
  }
}

main();