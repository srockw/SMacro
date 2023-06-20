import Command from "./commands/command";
import TickBuilder from "./tickBuilder";
import { f as fields, m as methods } from "../mappings/mappings";
import { Animations, ConstantColorConstraint, animate } from "../Elementa";

export const MODULE_NAME = "SMacro";
export const SAVED_MACROS_PATH = `${Config.modulesFolder}/${MODULE_NAME}/macros`;

/**
 * @param {(tick: TickBuilder, index: number) => TickBuilder} tickModifier 
 * @param {number} defaultDuration
 * @param {number} defaultTurn
 * @param {string} name 
 * @param  {...string} aliases 
 */
export function createSimpleCommand(tickModifier, defaultDuration = 1, defaultTurn = 0, name, ...aliases) {
    return new Command((duration = defaultDuration, turn = defaultTurn) => {
        const main = [];

        for (let i = 0; i < duration; i++) {
            let tick = new TickBuilder();

            if (i == 0) {
                tick.setYawTurn(parseFloat(turn));
            }
            
            main.push(tickModifier(tick, i));
        }

        return main;
    }, name, ...aliases);
}

/**
 * @returns {KeyBind[]}
 */
export function loadKeys() {
    return [
        Client.getKeyBindFromDescription("key.forward"),
        Client.getKeyBindFromDescription("key.left"),
        Client.getKeyBindFromDescription("key.back"),
        Client.getKeyBindFromDescription("key.right"),
        Client.getKeyBindFromDescription("key.sprint"),
        Client.getKeyBindFromDescription("key.sneak"),
        Client.getKeyBindFromDescription("key.jump")
    ]
}

/**
 * @param {number} shift 
 */
export function shiftPlayerYaw(shift) {
    Player.getPlayer()[fields.rotationYaw] = Player.getRawYaw() + shift;
}

/**
 * @param {number} shift 
 */
export function shiftPlayerPitch(shift) {
    Player.getPlayer()[fields.rotationPitch] = clamp(Player.getPitch() + shift, -90, 90);
}

export function leftClick() {
    const mc = Client.getMinecraft();
    const method = mc.class.getDeclaredMethod(methods.clickMouse);
    method.setAccessible(true);
    method.invoke(mc);
}

export function rightClick() {
    const mc = Client.getMinecraft();
    const method = mc.class.getDeclaredMethod(methods.rightClickMouse);
    method.setAccessible(true);
    method.invoke(mc);
}

/**
 * @param {number} number 
 * @param {number} min 
 * @param {number} max 
 */
export function clamp(number, min, max) {
    return Math.min(max, Math.max(number, min));
}

export function animateColorTransition(component, colorTo) {
    animate(component, anim => {
        anim.setColorAnimation(
            Animations.OUT_EXP,
            0.25,
            new ConstantColorConstraint(colorTo)
        )
    })
}