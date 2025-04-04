import { Terminal } from "@xterm/xterm";
import color from 'ansicolor';
import { error } from './console_utils';
import { init} from './main';
import { userCommand } from "./user_command";
import { getToken } from "./api_client";

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
    term.write("username: ");
    const username = await userCommand(term);


    term.write("password: ");
    const password = await userCommand(term, { hideInput: true});

    if (!password.user_entered || password.command == "") {
        return -1;
    }

    term.writeln("Aquiring token...");

    const token = await getToken(username.command, password.command);

    term.writeln("Token acquired");

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
        return 0;
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