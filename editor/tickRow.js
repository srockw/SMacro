import { AdditiveConstraint, CenterConstraint, SiblingConstraint, SubtractiveConstraint, UIContainer, UIRoundedRectangle, UIText, UITextInput } from "../../Elementa";
import { animateColorTransition } from "../utils";
import { BACKGROUND_COLOR, BACKGROUND_COLOR_BRIGHT, DELETE_COLOR, DELETE_HOVER_COLOR, HOVERED_ITEM_COLOR, NUMBERS_REGEX, ROUNDED_RADIUS, TICK_LIST_PADDING, TOGGLED_OFF_COLOR, TOGGLED_ON_COLOR } from "./constants";

/**
 * @param {(boolean | number)[]} values 
 * @param {number} tickRowIndex
 * @param {(it: (boolean | number)[]) => any} updateMacro
 */
export default function TickRow(values, tickRowIndex, updateMacro) {
    const MainBlock = new UIRoundedRectangle(ROUNDED_RADIUS / 2)
        .setY(new SiblingConstraint(TICK_LIST_PADDING))
        .setX(new CenterConstraint())
        .setWidth((100).percent())
        .setHeight((10).percent())
        .setColor(BACKGROUND_COLOR_BRIGHT);

    const RowIndexBlock = new UIContainer()
        .setY(new CenterConstraint())
        .setWidth((5).percent())
        .setHeight((90).percent())
        .setChildOf(MainBlock);

    const RowIndex = new UIText(tickRowIndex + 1)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setChildOf(RowIndexBlock);
    
    values.forEach((val, index) => {
        const Block = new UIRoundedRectangle(ROUNDED_RADIUS / 4)
            .setY(new CenterConstraint())
            .setX(new AdditiveConstraint(
                new SiblingConstraint(),
                TICK_LIST_PADDING.pixels()
            ))
            // + 1 because we add a delete button at the end. kinda weird ik
            .setWidth(new SubtractiveConstraint(
                (95 / (values.length + 1)).percent(),
                (TICK_LIST_PADDING * (1 + (1 / (values.length + 1)))).pixels()
            ))
            .setHeight((90).percent())
            .setColor(BACKGROUND_COLOR)
            .onMouseEnter(comp => animateColorTransition(comp, HOVERED_ITEM_COLOR))
            .onMouseLeave(comp => animateColorTransition(comp, BACKGROUND_COLOR));

        if (typeof val == "boolean") {
            new UIRoundedRectangle(ROUNDED_RADIUS / 4)
                .setX(new CenterConstraint())
                .setY(new CenterConstraint())
                .setWidth((90).percent())
                .setHeight((90).percent())
                .setColor(val ? TOGGLED_ON_COLOR : TOGGLED_OFF_COLOR)
                .setChildOf(Block)
                .onMouseClick(comp => {
                    values[index] = !values[index];
                    updateMacro(values);

                    if (values[index]) animateColorTransition(comp, TOGGLED_ON_COLOR);
                    else animateColorTransition(comp, TOGGLED_OFF_COLOR);
                })
        }
        else {
            const Input = new UITextInput(val)
                .setX(new CenterConstraint())
                .setY(new CenterConstraint())
                .setWidth((80).percent())
                .setHeight((50).percent())
                .onKeyType((comp, char, keyCode) => {
                    // 14 is backspace
                    if (!NUMBERS_REGEX.test(char) && keyCode != 14) {
                        comp.setText(values[index]);
                    }

                    values[index] = parseFloat(comp.getText()) || 0;
                    updateMacro(values);
                })
                .onFocusLost(comp => {
                    if (
                        comp.getText().length < 1 ||
                        Math.abs(values[index]) >= java.lang.Integer.MAX_VALUE
                    ) {
                        comp.setText("0");
                        values[index] = 0;
                    }
                })
                .setChildOf(Block);

            Block.onMouseClick(() => {
                Input.setText(values[index]);
                Input.grabWindowFocus();
            });
        }

        Block.setChildOf(MainBlock);
    })

    const DeleteBlock = new UIContainer()
        .setY(new CenterConstraint())
        .setX(new AdditiveConstraint(
            new SiblingConstraint(),
            TICK_LIST_PADDING.pixels()
        ))
        .setWidth(new SubtractiveConstraint(
            (95 / (values.length + 1)).percent(),
            (TICK_LIST_PADDING * (1 + (1 / (values.length + 1)))).pixels()
        ))
        .setHeight((90).percent())
        .setChildOf(MainBlock);

    const DeleteButton = new UIRoundedRectangle(ROUNDED_RADIUS / 2)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setWidth((80).percent())
        .setHeight((80).percent())
        .setColor(DELETE_COLOR)
        .onMouseEnter(comp => animateColorTransition(comp, DELETE_HOVER_COLOR))
        .onMouseLeave(comp => animateColorTransition(comp, DELETE_COLOR))
        // null means "delete this tick"
        .onMouseClick(() => updateMacro(null))
        .setChildOf(DeleteBlock);


    new UIText("X", false)
        .setX(new CenterConstraint())
        .setY(new CenterConstraint())
        .setChildOf(DeleteButton);

    return MainBlock;
}