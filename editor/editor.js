import { AdditiveConstraint, CenterConstraint, ConstantColorConstraint, FillConstraint, ScrollComponent, SiblingConstraint, SubtractiveConstraint, UIContainer, UIRoundedRectangle, UIText, UITextInput, WindowScreen } from "../../Elementa"
import Macro from "../macro"
import { animateColorTransition, loadKeys } from "../utils";
import { ADD_COLOR, ADD_HOVER_COLOR, BACKGROUND_COLOR, BACKGROUND_COLOR_BRIGHT, BACKGROUND_COLOR_DARK, FLOAT_PADDING, INPUT_LIST_PADDING, NAME_ALLOWED_CHARS_REGEX, ROUNDED_RADIUS, SAVE_COLOR, SAVE_HOVER_COLOR, TICK_LIST_PADDING } from "./constants";
import MacroCard from "./macroCard";
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

    FloatingControlContainer: new UIContainer(),

    FloatingMacroControl: new UIRoundedRectangle(ROUNDED_RADIUS),
    FloatingMacroList: new UIRoundedRectangle(ROUNDED_RADIUS),

    MacroListScroll: new ScrollComponent("No macros saved."),

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

        this.FloatingControlContainer
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
            .setChildOf(this.FloatingControlContainer);

        this.FloatingMacroList
            .setY(new SiblingConstraint(FLOAT_PADDING))
            .setWidth((100).percent())
            .setHeight(new SubtractiveConstraint(
                new FillConstraint(),
                FLOAT_PADDING.pixels()
            ))
            .setColor(new ConstantColorConstraint(BACKGROUND_COLOR))
            .setChildOf(this.FloatingControlContainer);

        this.initMacroList();
        this.updateMacroList();

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

    initMacroList() {
        const InputListText = new UIText("Saved Macros")
            .setX(new CenterConstraint())
            .setY(INPUT_LIST_PADDING.pixels())
            .setTextScale((1.5).pixels())
            .setChildOf(this.FloatingMacroList)

        this.MacroListScroll
            .setX(new CenterConstraint())
            .setY(new SiblingConstraint(INPUT_LIST_PADDING))
            .setWidth((90).percent())
            .setHeight(new SubtractiveConstraint(
                new FillConstraint(),
                (INPUT_LIST_PADDING * 3).pixels()
            ))
            .setChildOf(this.FloatingMacroList)
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

        const TextInputContainer = new UIRoundedRectangle(ROUNDED_RADIUS / 2)
            .setX(new CenterConstraint())
            .setY(new AdditiveConstraint(
                new SiblingConstraint(),
                (FLOAT_PADDING / 2).pixels()
            ))
            .setWidth((90).percent())
            .setHeight(new SubtractiveConstraint(
                (50).percent(),
                FLOAT_PADDING.pixels()
            ))
            .setColor(BACKGROUND_COLOR_DARK)
            .onMouseClick(() => MacroNameInput.grabWindowFocus())
            .setChildOf(TopControl);

        let macroNameState = "";

        const MacroNameInput = new UITextInput("Macro name...")
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setWidth((90).percent())
            .setHeight((9).pixels())
            .onKeyType((comp, char, keyCode) => {
                // 14 is backspace
                if (!NAME_ALLOWED_CHARS_REGEX.test(char) && keyCode != 14) {
                    comp.setText(macroNameState);
                }

                macroNameState = comp.getText();
            })
            .setChildOf(TextInputContainer);

        const SaveButton = new UIRoundedRectangle(ROUNDED_RADIUS / 2)
            .setX(new CenterConstraint())
            .setY(new SiblingConstraint(FLOAT_PADDING / 2))
            .setWidth((90).percent())
            .setHeight(new SubtractiveConstraint(
                new FillConstraint(),
                (FLOAT_PADDING * 1.5).pixels()
            ))
            .setColor(SAVE_COLOR)
            .onMouseEnter(comp => animateColorTransition(comp, SAVE_HOVER_COLOR))
            .onMouseLeave(comp => animateColorTransition(comp, SAVE_COLOR))
            .onMouseClick(() => {
                if (!macroNameState) {
                    macroNameState = Macro.ensureValidMacroName(macroNameState);
                }
                
                MacroNameInput.setText(macroNameState);
                this.Macro.setName(macroNameState).save();
                this.onMacroUpdate(this.Macro);
                this.updateMacroList();
            })
            .setChildOf(TopControl);

        const SaveText = new UIText("Save macro")
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setChildOf(SaveButton);

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

        const AddEmptyRow = new UIRoundedRectangle(ROUNDED_RADIUS / 2)
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
                this.updateMacroView();
            })
            .setChildOf(BottomControl);

        new UIText("Add empty row")
            .setX(new CenterConstraint())
            .setY(new CenterConstraint())
            .setChildOf(AddEmptyRow);
    },

    updateMacroList() {
        this.MacroListScroll.clearChildren();

        Macro.GetSavedNames().forEach(it => {
            MacroCard(it, newMacro => {
                this.Macro = newMacro;
                this.onMacroUpdate(this.Macro);
                this.updateMacroView();
            }).setChildOf(this.MacroListScroll);
        })
    },

    updateMacroView() {
        this.TicksScroller.clearChildren();

        this.MacroNameTitle.setText(this.Macro.name);

        this.Macro.ticks.forEach((it, index) => {
            TickRow(it, index, newVal => {
                if (newVal == null) {
                    this.Macro.removeTick(index);
                    this.onMacroUpdate(this.Macro);
                    return this.updateMacroView();
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

        this.updateMacroList();
        this.updateMacroView();

        GuiHandler.openGui(this);
    },
})

Editor.init();