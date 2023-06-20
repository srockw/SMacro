import { leftClick, loadKeys, rightClick, shiftPlayerPitch, shiftPlayerYaw } from "./utils";
import TickBuilder from "./tickBuilder";

export default class Macro {
    /**
     * @param {string} name 
     */
    constructor(name) {
        this.name = name;
        this.ticks = [];
    }

    /**
     * @param {TickBuilder[]} ticks 
     */
    setTicks(ticks) {
        this.ticks = ticks.map(it => it.build());
        return this;
    }

    isEmpty() {
        return this.ticks.length < 1;
    }

    addTick() {
        this.ticks.push(new TickBuilder().build());
    }

    removeTick(index) {
        this.ticks = this.ticks.filter((_, i) => i != index);
    }

    execute() {
        this.keys = loadKeys();

        let currentTick = 0;

        const trigger = register("tick", () => {
            if (currentTick >= this.ticks.length) {
                // End the macro.
                this.keys.forEach(it => it.setState(false));
                return trigger.unregister();
            }

            const tick = this.ticks[currentTick];

            tick.forEach((action, index) => {
                if (index < 7) {
                    // key actions
                    this.keys[index].setState(action);
                }

                // mouse actions
                if (index == 7 && action) leftClick();
                if (index == 8 && action) rightClick();

                // turning actions
                if (index == 9) shiftPlayerYaw(action);
                if (index == 10) shiftPlayerPitch(action);
            })

            currentTick++;
        })
    }
}