# SMacro

[ChatTriggers](https://www.chattriggers.com/) module for creating macros in MC 1.8.9.

# How to install

To use this module you need to have [ChatTriggers](https://www.chattriggers.com/) installed. Download the `.jar` from their website and install it like any other Forge mod.

Next step is to download the source code of this repository, go to the top of the page, big green button that says `Code`, click on it, then click on Download ZIP.

Extract this ZIP in your `modules` folder, which can be accessed by doing `/ct files` ingame or going to `./minecraft/config/ChatTriggers/modules`.

Rename the extracted folder to `SMacro` and delete the ZIP file from before.

The end result should be as follows:

`./minecraft/config/ChatTriggers/modules/SMacro`

Where `SMacro` is a directory containing files such as `metadata.json` and `index.js`

After doing this, use the command `/ct load` ingame to reload ChatTriggers and it should work.

# Features

- Quickly create complex macros based on text input. (Similar to [mothball](https://github.com/CyrenArkade/mothball))

- Editor GUI similar to `/mpk macro` in [MPK Mod 1.3.0](https://github.com/kurrycat2004/MpkMod). (Missing some stuff).

# Main Command

To access the features, use the command `/smacro`

Currently this command has the following arguments:

`<>` means required argument.

`()` means optional argument.

- `/smacro run <args>` where args is a list of actions separated by spaces. The macro will stop when the chat is opened or the USE key is pressed (Right Click by default)

- `/smacro list` will list all the available actions

- `/smacro editor` will open the editor for the currently loaded macro

- `/smacro save (name)` will save the current macro with the given name, (or an automatically generated name, such as `macro5`)

- `/smacro load <name>` will load a macro with the given name, replacing the current one.

- `/smacro delete <name>` will delete the macro with the given name. This action is irreversible.

# Editor

The editor is very similar to MPK Mod, as mentioned above, but made with [Elementa](https://github.com/EssentialGG/Elementa).

![Image of the editor](https://i.imgur.com/lWiQr97.png "Editor")

Currently it consists of the following features:

- Change all values of a tick.
- Delete ticks.
- Add empty tick rows at the end of the macro.
- Save macros with a given name.
- View all saved macros.
- Load any saved macros.
- Delete macros. (Irreversible)

# Actions

When running the command `/smacro run <args>`, these are the actions you can use:

---

| Action | Name | Aliases | Description |
|--------|------|---------|-------------|
| Walk   | walk | w       | ticks with only movement keys held
| Sprint | sprint | s | ticks with movement keys and sprint held 
| Sneak  | sneak | sn | ticks with movements keys and sneak held
| Sneaksprint | sneaksprint | sns | ticks with movements key and both sprint and sneak held (this might be an unnecessary one)
| Stop | stop | st | ticks with nothing, no keys, no turns
---

Notes:

- These actions take 2 parameters, `duration` (how many ticks of this action) and `yaw` (how much to shift the current yaw by).
- All actions can be extended with a `jump` at the end, example: `sprintjump`.
- Jump actions will only have jump pressed on the first tick.

Additionally, an action called `sprintjump45 (sj45)` is defined, it will make a normal sprintjump, but on the 2nd tick, turn 45 degrees and start holding A.

# Extensions

All actions can be extended like this: `sprintjump.wa(12)`, this will generate a sprintjump where the keys W and A are held all the time.

The available extensions are the following:

 - w
 - a
 - s
 - d
 - wa
 - wd
 - sa
 - sd

# Examples

- 6bmm Single 45: `/smacro run sj(12) sj(12) sj45(20)`

- Rex bwmm: `/smacro run wj.s(12) w.s sj.wa s(11)`

- 45bwmm: `/smacro run wj.sd(12) w.sd sj.wa(12,10) sj(1,-45) s.wa(13,45)`