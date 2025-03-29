import { Terminal } from '@xterm/xterm';
import colors from 'ansicolor';

export function error(term: Terminal, message: string) {
    term.writeln(colors.lightRed("Err") + ": " + colors.lightGray(message));
}