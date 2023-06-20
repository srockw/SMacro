// Load commands
import "./commands";

import SillyCommand from "../sillycommand";
import Command from "./commands/command";
import Macro from "./macro";
import { Editor } from "./editor/editor";

let cachedMacro = new Macro("Cached Macro");

new SillyCommand("smacro")
    .setArgs({
        run(args) {
            if (args.length < 1) {
                if (!cachedMacro.isEmpty()) {
                    return cachedMacro.execute();
                }

                return ChatLib.chat("&cEmpty macro?");
            }

            let ticks = [];

            args.forEach(it => {
                const cmd = Command.ALL.find(cmd => cmd.matches(it));
                if (!cmd) return ChatLib.chat(`&cInvalid input on ${it}. Run /smacro list to see valid commands.`);

                const result = cmd.evaluate(it);

                if (result instanceof Error) {
                    return ChatLib.chat(`&cInvalid input on ${it}: ${result.message}`);
                }

                ticks = ticks.concat(result);
            })

            cachedMacro.setTicks(ticks).execute();
        },

        list() {
            ChatLib.chat("&aValid commands:")
            Command.ALL.forEach(it => {
                ChatLib.chat(`&a  - ${it.name} (${it.aliases.join(", ")})`);
            })
        },

        editor() {
            Editor.open(cachedMacro, it => cachedMacro = it);
        }
    })
    .setGlobalDefault(() => ChatLib.chat("&cInvalid command."))
    .registerCommand();