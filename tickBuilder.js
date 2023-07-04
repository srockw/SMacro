export default class TickBuilder {
    static fromArray(array) {
        if (array.length < 11) return new TickBuilder();

        return new TickBuilder()
            .setW(array[0])
            .setA(array[1])
            .setS(array[2])
            .setD(array[3])
            .setSprint(array[4])
            .setSneak(array[5])
            .setJump(array[6])
            .setLeftClick(array[7])
            .setRightClick(array[8])
            .setYawTurn(array[9])
            .setPitchTurn(array[10]);
    }

    constructor() {
        this.clear();
    }

    clear() {
        this.array = [
            false, // W
            false, // A
            false, // S,
            false, // D,
            false, // SPRINT
            false, // SNEAK
            false, // JUMP
            false, // LEFT CLICK
            false, // RIGHT CLICK
            0,     // YAW TURN
            0      // PITCH TURN
        ];
        return this;
    }

    /**
     * @param {number} index 
     * @param {boolean} value 
     */
    setBool(index, value) {
        if (typeof value == "boolean") {
            this.array[index] = value;
        }
        return this;
    }

    /**
     * @param {number} index 
     * @param {number} value 
     */
    setNumber(index, value) {
        if (typeof value == "number") {
            this.array[index] = value;
        }
        return this;
    }

    /**
     * @param {boolean} value 
     */
    setW(value) {
        return this.setBool(0, value);
    }

    /**
     * @param {boolean} value 
     */
    setA(value) {
        return this.setBool(1, value);
    }

    /**
     * @param {boolean} value 
     */
    setS(value) {
        return this.setBool(2, value);
    }

    /**
     * @param {boolean} value 
     */
    setD(value) {
        return this.setBool(3, value);
    }

    /**
     * @param {boolean} value 
     */
    setSprint(value) {
        return this.setBool(4, value);
    }

    /**
     * @param {boolean} value 
     */
    setSneak(value) {
        return this.setBool(5, value);
    }

    /**
     * @param {boolean} value 
     */
    setJump(value) {
        return this.setBool(6, value);
    }

    /**
     * @param {boolean} value 
     */
    setLeftClick(value) {
        return this.setBool(7, value);
    }

    /**
     * @param {boolean} value 
     */
    setRightClick(value) {
        return this.setBool(8, value);
    }

    /**
     * @param {number} value 
     */
    setYawTurn(value) {
        return this.setNumber(9, value);
    }

    /**
     * @param {number} value 
     */
    setPitchTurn(value) {
        return this.setNumber(10, value);
    }

    build() {
        return this.array;
    }
}