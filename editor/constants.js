const Color = Java.type("java.awt.Color");

export const BACKGROUND_COLOR = new Color(33/255, 33/255, 33/255);
export const BACKGROUND_COLOR_BRIGHT = new Color(66/255, 66/255, 66/255);
export const BACKGROUND_COLOR_DARK = new Color(11/255, 11/255, 11/255);
export const HOVERED_ITEM_COLOR = new Color(1, 1, 1, 0.5);
export const TOGGLED_ON_COLOR = new Color(0, 132/255, 0);
export const TOGGLED_OFF_COLOR = new Color(132/255, 0, 0);
export const DELETE_COLOR = new Color(66/255, 0, 0);
export const DELETE_HOVER_COLOR = new Color(1, 0, 0);
export const ADD_COLOR = new Color(0, 66/255, 0);
export const ADD_HOVER_COLOR = new Color(0, 1, 0);

export const ROUNDED_RADIUS = 16;
export const FLOAT_PADDING = 12;
export const INPUT_LIST_PADDING = 8;
export const TICK_LIST_PADDING = 4;

export const NUMBERS_REGEX = new RegExp("[-0-9\.]");

export const COLUMN_LABELS = ["W", "A", "S", "D", "Sprint", "Sneak", "Jump", "LClick", "RClick", "Yaw", "Pitch"];