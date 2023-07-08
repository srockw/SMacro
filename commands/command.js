import Extensions from "../extensions";
import TickBuilder from "../tickBuilder";

export default class Command {
    /**
     * @type {Command[]}
     */
    static ALL = [];

    static REGEX = new RegExp("^(\\w+)(?:\\.)?(\\w{1,2})?(?:\\((.*)\\))?");

    /**
     * @param {(...args) => TickBuilder[]} action 
     * @param {string} name 
     * @param  {...string} aliases 
     */
    constructor(action, name, ...aliases) {
        this.name = name;
        this.aliases = aliases;
        this.action = action;
        this.names = [this.name].concat(this.aliases);
        this.applyExtension = true;

        Command.ALL.push(this);
        Command.ALL.sort((a, b) => b.name.length - a.name.length);
    }

    /**
     * @param {string} input 
     * @returns {boolean}
     */
    matches(input) {
        if (!Command.REGEX.test(input.toLowerCase())) return false;
        const [_, name] = Command.REGEX.exec(input.toLowerCase());
        return this.names.includes(name);
    }

    shouldApplyExtension(bool) {
        if (typeof bool != "boolean") return this;
        this.applyExtension = bool;
        return this;
    }

    /**
     * @param {string} input 
     * @returns 
     */
    evaluate(input) {
        if (!this.matches(input.toLowerCase())) return new Error("Input does not match.");

        const [_, name, ext = "w", argsText] = Command.REGEX.exec(input.toLowerCase());

        const extension = Extensions.fromString(ext);
        if (!extension) return new Error("Invalid extension.");

        const args = argsText?.split(",")?.filter(it => it && parseFloat(it)) ?? [];

        return this.action(...args).map(it => this.applyExtension ? extension.apply(it) : it);
    }
}