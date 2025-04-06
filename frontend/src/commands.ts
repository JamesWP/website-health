import { Terminal } from "@xterm/xterm";
import color from 'ansicolor';
import { error, info } from './console_utils';
import { init} from './main';
import { userCommand } from "./user_command";
import { getToken, getWebsites } from "./api_client";
import moment from 'moment';

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

    // Store token in local storage
    window.localStorage.setItem("token", token);

    return 0;
}

async function websites(term: Terminal, arg0: string, args: string[]): Promise<number> {
    const token = window.localStorage.getItem("token");

    if (!token) {
        error(term, "no token stored, 'login' required");
        return -1;
    }

    const websites = await getWebsites(token);

    for (const website of websites) {
        term.writeln("→ " + color.blue("Name:                ") + website.name);
        term.writeln(color.green("\tUrl:           ") + website.url);
        term.writeln(color.green("\tDate-Added:    ") + website.date_added);
        const s = "\tStatus:        ";
        switch (website.status) {
            case "UP":
                term.write(color.bgGreen(s));
                break;
            case "DOWN":
                term.write(color.bgRed(s));
                break;
            default:
                term.write(color.bgYellow(s));
                break;
        }
        term.writeln(website.status + " (as of " + moment(website.last_checked).fromNow() + ")")
        term.writeln(color.green("\tLast-Changed:  ") + moment(website.last_status_change).fromNow());
        term.writeln("");
    }

    return 0;
}

commands = {
    help: [help, "prints this help message"],
    echo: [echo, "prints the arguments to the console"],
    clear: [clear, "clears the screen"],
    login: [login, "logs in to the server"],
    websites: [websites, "prints the list of registered websites"],
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

    try {
        let status = await command(term, arg0, args);
        return err? -1 : status;
    } catch(e){
        error(term, `Exception: ${e}`);
        return 1;
    }
}