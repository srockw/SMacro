import { AdditiveConstraint, CenterConstraint, ConstantColorConstraint, SiblingConstraint, UICircle, UIRoundedRectangle, UIText } from "../../Elementa";
import Macro from "../macro";
import { animateColorTransition } from "../utils";
import { BACKGROUND_COLOR_BRIGHT, DELETE_COLOR, DELETE_HOVER_COLOR, HOVERED_ITEM_COLOR, INPUT_LIST_PADDING, ROUNDED_RADIUS } from "./constants";

/**
 * @param {string} name
 * @param {(it: Macro) => any} updateMacro 
 */
export default function MacroCard(name, updateMacro) {
    const MainBlock = new UIRoundedRectangle(ROUNDED_RADIUS)
        .setX(new CenterConstraint())
        .setY(new SiblingConstraint(INPUT_LIST_PADDING))
        .setWidth((90).percent())
        .setHeight((15).percent())
        .onMouseEnter(comp => animateColorTransition(comp, HOVERED_ITEM_COLOR))
        .onMouseLeave(comp => animateColorTransition(comp, BACKGROUND_COLOR_BRIGHT))
        .onMouseClick(() => updateMacro(new Macro(name).load()))
        .setColor(new ConstantColorConstraint(BACKGROUND_COLOR_BRIGHT));

    const Name = new UIText(name)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setChildOf(MainBlock);

    const DeleteButton = new UICircle()
        .setX((2).pixels(true))
        .setY(new CenterConstraint())
        .setRadius((10).percent())
        .setColor(DELETE_COLOR)
        .onMouseEnter(comp => animateColorTransition(comp, DELETE_HOVER_COLOR))
        .onMouseLeave(comp => animateColorTransition(comp, DELETE_COLOR))
        .onMouseClick((_, event) => {
            new Macro(name).delete();
            updateMacro(null);
            event.stopPropagation();
        })
        .setChildOf(MainBlock);

    const XSymbol = new UIText("x")
        .setX(new AdditiveConstraint(
            new CenterConstraint(),
            (0.5).pixels()
        ))
        .setY(new CenterConstraint())
        .setChildOf(DeleteButton);

    return MainBlock;
}