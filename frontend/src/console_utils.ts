import { Terminal } from '@xterm/xterm';
import colors from 'ansicolor';

export function error(term: Terminal, message: string) {
    term.writeln(colors.lightRed("Err") + ": " + colors.lightGray(message));
}

export function info(term: Terminal, message: any) {
    if (typeof message !== 'string') {
        message = JSON.stringify(message, null, 2).replace(/\n/g, "\r\n");
    }

    term.writeln(colors.lightBlue("Info") + ": " + colors.lightGray(message));
}