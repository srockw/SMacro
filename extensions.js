import TickBuilder from "./tickBuilder";

class Extension {
    /**
     * @param {string} name 
     * @param {(tick: TickBuilder) => TickBuilder} apply 
     */
    constructor(name, apply) {
        this.name = name;
        this.apply = apply;
    }
}

export default class Extensions {
    static W = new Extension("w", tick => tick.setW(true));

    static A = new Extension("a", tick => tick.setA(true));

    static S = new Extension("s", tick => tick.setS(true));

    static D = new Extension("d", tick => tick.setD(true));

    static WA = new Extension("wa", tick => tick.setW(true).setA(true));

    static WD = new Extension("wd", tick => tick.setW(true).setD(true));

    static SA = new Extension("sa", tick => tick.setS(true).setA(true));

    static SD = new Extension("sd", tick => tick.setS(true).setD(true));

    static getAll() {
        return [
            Extensions.W,
            Extensions.A,
            Extensions.S,
            Extensions.D,
            Extensions.WA,
            Extensions.WD,
            Extensions.SA,
            Extensions.SD
        ];
    }

    /**
     * @param {string} text 
     */
    static fromString(text) {
        return Extensions.getAll().find(it => it.name.toLowerCase() == text);
    }
}