import { Terminal } from "@xterm/xterm";
import color from 'ansicolor';
import { error } from './console_utils';
import { init} from './main';

type CommandSignature = [(term: Terminal, arg0: string, args: string[]) => Promise<number>, string];
type CommandMap = { [key: string]: CommandSignature};

let commands: CommandMap;

async function help(term: Terminal, arg0: string, args: string[]): Promise<number> {
    term.writeln("Commands:");
    for (let command in commands) {
        let [_fn, help] = commands[command];
        term.writeln(`     ${color.lightGreen(command)} - ${color.lightGray(help)}`)
    }
    return 0;
}

async function echo(term: Terminal, arg0: string, args: string[]): Promise<number> {
    term.writeln(args.slice(1).join(" "));
    return 0;
}

async function clear(term: Terminal, arg0: string, args: string[]): Promise<number> {
    init();
    return 0;
}

async function login(term: Terminal, arg0: string, args: string[]): Promise<number> {
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    term.writeln("logging in...");

    await new Promise<void>(resolve => setTimeout(resolve, 2500));
    term.writeln("logged in");
    return 0;
}

commands = {
    help: [help, "prints this help message"],
    echo: [echo, "prints the arguments to the console"],
    clear: [clear, "clears the screen"],
    login: [login, "logs in to the server"]
};

export async function dispatch(term: Terminal, args: string[]): Promise<number> {
    let err = false;
    if (args.length == 0){
        error(term, "no command specified. using 'help'");
        args = ["help"];
        err = true;
    }

    const arg0 = args[0];

    let command = help;

    if (arg0 in commands){
        command = commands[arg0][0];
    } else {
        error(term, "command not found. using 'help'");
        err = true;
    }

    let status = await command(term, arg0, args);

    if (err) {
        return 1;
    } else {
        return status;
    }
}