import { AdditiveConstraint, CenterConstraint, SiblingConstraint, SubtractiveConstraint, UIRoundedRectangle, UIText } from "../../Elementa";
import { BACKGROUND_COLOR, BACKGROUND_COLOR_DARK, COLUMN_LABELS, ROUNDED_RADIUS, TICK_LIST_PADDING } from "./constants";

export default function TickColumnLabel() {
    const MainBlock = new UIRoundedRectangle(ROUNDED_RADIUS / 2)
        .setX(new CenterConstraint())
        .setY(new SiblingConstraint(TICK_LIST_PADDING))
        .setWidth((90).percent())
        .setHeight((5).percent())
        .setColor(BACKGROUND_COLOR);

    COLUMN_LABELS.forEach((it, index) => {
        const Block = new UIRoundedRectangle(ROUNDED_RADIUS / 4)
            .setY(new CenterConstraint())
            .setX(new AdditiveConstraint(
                new SiblingConstraint(),
                TICK_LIST_PADDING.pixels()
            ))
            .setWidth(new SubtractiveConstraint(
                // +1 because there's a delete button at the end... very weird ik
                (95 / (COLUMN_LABELS.length + 1)).percent(),
                (TICK_LIST_PADDING * (1 + (1 / (COLUMN_LABELS.length + 1)))).pixels()
            ))
            .setHeight((90).percent())
            .setColor(BACKGROUND_COLOR_DARK)
            .setChildOf(MainBlock);

            if (index == 0) {
                Block.setX(new AdditiveConstraint(
                    (5).percent(),
                    TICK_LIST_PADDING.pixels()
                ))
            }

        const Label = new UIText(it)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setChildOf(Block);
    })

    return MainBlock;
}