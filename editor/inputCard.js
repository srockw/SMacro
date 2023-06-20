import { CenterConstraint, ConstantColorConstraint, SiblingConstraint, UIRoundedRectangle, UIText } from "../../Elementa";
import { animateColorTransition } from "../utils";
import { BACKGROUND_COLOR_BRIGHT, HOVERED_ITEM_COLOR, INPUT_LIST_PADDING, ROUNDED_RADIUS } from "./constants";

/**
 * @param {string} name
 * @param {string[]} aliases 
 */
export default function InputCard(name, aliases) {
    const MainBlock = new UIRoundedRectangle(ROUNDED_RADIUS)
        .setX(new CenterConstraint())
        .setY(new SiblingConstraint(INPUT_LIST_PADDING))
        .setWidth((90).percent())
        .setHeight((15).percent())
        .onMouseEnter(comp => animateColorTransition(comp, HOVERED_ITEM_COLOR))
        .onMouseLeave(comp => animateColorTransition(comp, BACKGROUND_COLOR_BRIGHT))
        .setColor(new ConstantColorConstraint(BACKGROUND_COLOR_BRIGHT));

    const Name = new UIText(name)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setTextScale((1.5).pixels())
        .setChildOf(MainBlock);

    const Aliases = new UIText(aliases.join(", "))
        .setX(new CenterConstraint())
        .setY(new SiblingConstraint())
        .setChildOf(MainBlock);

    return MainBlock;
}