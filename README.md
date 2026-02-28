# Default Image Width

Obsidian plugin that automatically appends a pixel width to every image you paste or drop into a note.

```
![[screenshot.png]]  →  ![[screenshot.png|400]]
```

The default is 400px. You can change it in Settings → Default Image Width.

## How it works

Instead of hooking into Obsidian's paste event (which fires before the embed exists in the editor), the plugin uses a CodeMirror 6 `updateListener`. It fires after every document change, detects image embeds that were just inserted without a width, and dispatches a follow-up transaction to add one. No timeouts, no flicker.

## Install from Community Plugins

Search "Default Image Width" in Settings → Community Plugins → Browse.

## Install with an AI agent

The plugin is ~90 lines with no build step. If you'd rather have your agent write it directly into your vault instead of installing a dependency, give it this prompt:

```
Create an Obsidian plugin called "default-image-width" in my vault's
.obsidian/plugins/default-image-width/ directory.

The plugin should:
- Automatically append |400 to any image embed (png, jpg, jpeg, gif,
  webp, svg, bmp, avif) inserted into the editor without a width
- Use a CM6 updateListener (not setTimeout) so it fires deterministically
  after the embed is inserted
- Use a StateEffect to tag its own fix-up transactions and prevent
  infinite recursion
- Have a settings tab where the user can configure the default width
- Default to 400px

It needs two files: manifest.json and main.js (no build step).

Reference implementation: https://raw.githubusercontent.com/jamesvclements/default-image-width/main/main.js
```

## Manual install

Download `main.js` and `manifest.json` from the [latest release](https://github.com/jamesvclements/default-image-width/releases/latest) into your vault's `.obsidian/plugins/default-image-width/` directory. Enable the plugin in Settings → Community Plugins.
