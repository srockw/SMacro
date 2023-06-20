import TickBuilder from "../tickBuilder";
import { createSimpleCommand } from "../utils";
import Command from "./command";

// Simple commands
export const Walk = createSimpleCommand(tick => tick, 1, 0, "walk", "w");
export const Sprint = createSimpleCommand(tick => tick.setSprint(true), 1, 0, "sprint", "s");
export const Sneak = createSimpleCommand(tick => tick.setSneak(true), 1, 0, "sneak", "sn");
export const Sneaksprint = createSimpleCommand(tick => tick.setSneak(true).setSprint(true), 1, 0, "sneaksprint", "sns");
export const Stop = createSimpleCommand(tick => tick.clear(), 1, 0, "stop", "st");

// Jump commands
export const Walkjump = createSimpleCommand(
    (tick, index) => index == 0 ? tick.setJump(true) : tick,
    12, 0, "walkjump", "wj"
);

export const Sprintjump = createSimpleCommand(
    (tick, index) => index == 0 ? tick.setSprint(true).setJump(true) : tick.setSprint(true),
    12, 0, "sprintjump", "sj"
);

export const Sneakjump = createSimpleCommand(
    (tick, index) => index == 0 ? tick.setSneak(true).setJump(true) : tick.setSneak(true),
    12, 0, "sneakjump", "snj"
);

export const Sneaksprintjump = createSimpleCommand(
    (tick, index) => index == 0 ? tick.setSneak(true).setSprint(true).setJump(true) : tick.setSneak(true).setSprint(true),
    12, 0, "sneaksprintjump", "snsj"
);

export const Stopjump = createSimpleCommand(
    (tick, index) => index == 0 ? tick.clear().setJump(true) : tick.clear(),
    1, 0, "stopjump", "stj"
);

// Complex commands
export const sprintjump45 = new Command((duration = 12, shift = 0) => {
    const main = [];

    for (let i = 0; i < duration; i++) {
        let tick = new TickBuilder().setSprint(true);

        if (i == 0) {
            tick.setJump(true);
        }

        if (i == 1) {
            tick.setYawTurn(45 + shift);
        }
        
        if (i >= 1) {
            tick.setA(true);
        }

        main.push(tick);
    }

    return main;
}, "sprintjump45", "sj45");