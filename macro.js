import { MODULE_NAME, SAVED_MACROS_PATH, leftClick, loadKeys, rightClick, shiftPlayerPitch, shiftPlayerYaw } from "./utils";
import TickBuilder from "./tickBuilder";
import PogObject from "../PogData";
const File = Java.type("java.io.File");

export default class Macro {
    /**
     * @returns {string[]} Saved macro names
     */
    static GetSavedNames() {
        const dir = new File(SAVED_MACROS_PATH);

        if (!dir.exists()) {
            dir.mkdirs();
        }

        if (!dir.isDirectory()) {
            dir.delete();
            dir.mkdirs();
        }

        return dir.listFiles()
            .filter(file => file.getName().endsWith(".json") && file.getName() != "Cached Macro.json")
            .map(file => file.getName().replace(".json", ""));
    }

    static GetPogObject(name, ticks = []) {
        return new PogObject(MODULE_NAME, {
            name: name,
            ticks
        }, `./macros/${name}.json`);
    }

    /**
     * @param {string} name 
     */
    static ensureValidMacroName(name) {
        if (!name || name.length < 1) {
            name = `macro${Macro.GetSavedNames().length}`;
        }
        return name;
    }

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

    /**
     * @param {string} name 
     */
    setName(name) {
        this.name = name;
        return this;
    }

    isEmpty() {
        return this.ticks.length < 1;
    }

    addTick() {
        this.ticks.push(new TickBuilder().build());
        return this;
    }

    save() {
        const object = Macro.GetPogObject(this.name, this.ticks);
        object.ticks = this.ticks;
        object.save();
        return this;
    }

    /**
     * @param {string} name 
     */
    load() {
        if (!Macro.GetSavedNames().includes(this.name)) return this;
        this.ticks = this.ticks.concat(Macro.GetPogObject(this.name).ticks);
        return this;
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