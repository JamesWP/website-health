import { Terminal } from "@xterm/xterm";
import colors from "ansicolor";

export function easteregg(term: Terminal) {
  term.writeln(colors.green("  ╔══╗╔═══╗╔═══╗╔═══╗╔═══╗╔═══╗╔═══╗"));
  term.writeln(colors.green("  ║╔╗║╚═╗╔╝╚══╗║╔═╗║║╔═╗║║╔═╗║╚═╗╔╝"));
  term.writeln(colors.green("  ║╚╝╠═╗╔╝   ╠╣╔═╝║║╚═╝║║╚═╝╠═╗╔╝ "));
  term.writeln(colors.green("  ╚══╝╚╝╚═╝╚═╝╚╝╚═╝╚╝╚═╝╚╝╚═╝╚╝╚╝  "));
}