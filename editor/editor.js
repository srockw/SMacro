import { AdditiveConstraint, CenterConstraint, ConstantColorConstraint, FillConstraint, ScrollComponent, SiblingConstraint, SubtractiveConstraint, UIContainer, UIRoundedRectangle, UIText, WindowScreen } from "../../Elementa"
import Command from "../commands/command";
import Macro from "../macro"
import { animateColorTransition, loadKeys } from "../utils";
import { ADD_COLOR, ADD_HOVER_COLOR, BACKGROUND_COLOR, BACKGROUND_COLOR_BRIGHT, FLOAT_PADDING, INPUT_LIST_PADDING, ROUNDED_RADIUS, TICK_LIST_PADDING } from "./constants";
import InputCard from "./inputCard";
import TickColumnLabel from "./tickColumnLabel";
import TickRow from "./tickRow";

export const Editor = new JavaAdapter(WindowScreen, {
    Macro: null,
    Keys: null,
    onMacroUpdate: null,

    FloatingMainContainer: new UIContainer(),

    MacroNameTitle: new UIText(),
    FloatingMacro: new UIRoundedRectangle(ROUNDED_RADIUS),
    TicksScroller: new ScrollComponent("Empty Macro :("),

    FloatingInputContainer: new UIContainer(),

    FloatingMacroControl: new UIRoundedRectangle(ROUNDED_RADIUS),
    FloatingInputList: new UIRoundedRectangle(ROUNDED_RADIUS),

    InputListScroll: new ScrollComponent("No inputs? That is odd."),

    init() {
        this.FloatingMainContainer
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setWidth((90).percent())
            .setHeight((90).percent())
            .setChildOf(this.getWindow());

        this.FloatingMacro
            .setWidth((75).percent())
            .setHeight((100).percent())
            .setColor(new ConstantColorConstraint(BACKGROUND_COLOR))
            .setChildOf(this.FloatingMainContainer);

        this.FloatingInputContainer
            .setX(new SiblingConstraint(FLOAT_PADDING))
            .setWidth(new SubtractiveConstraint(
                new FillConstraint(),
                FLOAT_PADDING.pixels()
            ))
            .setHeight((100).percent())
            .setChildOf(this.FloatingMainContainer);

        this.FloatingMacroControl
            .setWidth((100).percent())
            .setHeight((40).percent())
            .setColor(new ConstantColorConstraint(BACKGROUND_COLOR))
            .setChildOf(this.FloatingInputContainer);

        this.FloatingInputList
            .setY(new SiblingConstraint(FLOAT_PADDING))
            .setWidth((100).percent())
            .setHeight(new SubtractiveConstraint(
                new FillConstraint(),
                FLOAT_PADDING.pixels()
            ))
            .setColor(new ConstantColorConstraint(BACKGROUND_COLOR))
            .setChildOf(this.FloatingInputContainer);

        this.initInputListScroll();
        this.updateInputList();

        this.initMacroControl();
        this.initMacroScroll();
    },

    initMacroScroll() {
        this.MacroNameTitle
            .setX(new CenterConstraint())
            .setY(INPUT_LIST_PADDING.pixels())
            .setTextScale((1.5).pixels())
            .setChildOf(this.FloatingMacro)

        TickColumnLabel().setChildOf(this.FloatingMacro);

        this.TicksScroller
            .setX(new CenterConstraint())
            .setY(new SiblingConstraint(TICK_LIST_PADDING))
            .setWidth((90).percent())
            .setHeight(new SubtractiveConstraint(
                new FillConstraint(),
                (TICK_LIST_PADDING * 8).pixels()
            ))
            .setChildOf(this.FloatingMacro)
    },

    initInputListScroll() {
        const InputListText = new UIText("List of Inputs")
            .setX(new CenterConstraint())
            .setY(INPUT_LIST_PADDING.pixels())
            .setTextScale((1.5).pixels())
            .setChildOf(this.FloatingInputList)

        this.InputListScroll
            .setX(new CenterConstraint())
            .setY(new SiblingConstraint(INPUT_LIST_PADDING))
            .setWidth((90).percent())
            .setHeight(new SubtractiveConstraint(
                new FillConstraint(),
                (INPUT_LIST_PADDING * 3).pixels()
            ))
            .setChildOf(this.FloatingInputList)
    },

    initMacroControl() {
        const TopControl = new UIRoundedRectangle(ROUNDED_RADIUS)
            .setX(new CenterConstraint())
            .setY(new AdditiveConstraint(
                new SiblingConstraint(),
                FLOAT_PADDING.pixels()
            ))
            .setWidth((90).percent())
            .setHeight((50).percent())
            .setColor(BACKGROUND_COLOR_BRIGHT)
            .setChildOf(this.FloatingMacroControl);

        const BottomControl = new UIRoundedRectangle(ROUNDED_RADIUS)
            .setX(new CenterConstraint())
            .setY(new SiblingConstraint(FLOAT_PADDING / 2))
            .setWidth((90).percent())
            .setHeight(new SubtractiveConstraint(
                new FillConstraint(),
                (FLOAT_PADDING * 2).pixels()
            ))
            .setColor(BACKGROUND_COLOR_BRIGHT)
            .setChildOf(this.FloatingMacroControl);

        const AddEmptyRow = new UIRoundedRectangle(ROUNDED_RADIUS)
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setWidth((90).percent())
            .setHeight((90).percent())
            .setColor(ADD_COLOR)
            .onMouseEnter(comp => animateColorTransition(comp, ADD_HOVER_COLOR))
            .onMouseLeave(comp => animateColorTransition(comp, ADD_COLOR))
            .onMouseClick(() => {
                this.Macro.addTick();
                this.onMacroUpdate(this.Macro);
                this.updateTickList();
            })
            .setChildOf(BottomControl);

        new UIText("Add empty row")
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setChildOf(AddEmptyRow);
    },

    updateInputList() {
        this.InputListScroll.clearChildren();

        Command.ALL.forEach(it => {
            InputCard(it.name, it.aliases).setChildOf(this.InputListScroll);
        });
    },

    updateTickList() {
        this.TicksScroller.clearChildren();

        this.Macro.ticks.forEach((it, index) => {
            TickRow(it, index, newVal => {
                if (newVal == null) {
                    this.Macro.removeTick(index);
                    this.onMacroUpdate(this.Macro);
                    return this.updateTickList();
                }

                this.Macro.ticks[index] = newVal;
                this.onMacroUpdate(this.Macro);
            }).setChildOf(this.TicksScroller);
        })
    },

    /**
     * @param {Macro} macro 
     * @param {(it: Macro) => any} onMacroUpdate
     */
    open(macro, onMacroUpdate) {
        this.Macro = macro;
        this.Keys = loadKeys();
        this.onMacroUpdate = onMacroUpdate;

        this.updateTickList();
        this.MacroNameTitle.setText(this.Macro.name);

        GuiHandler.openGui(this);
    },
})

Editor.init();