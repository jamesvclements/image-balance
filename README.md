# Image Balance

Obsidian plugin that automatically sizes pasted images so they all have the same visual weight, regardless of aspect ratio.
Uses a constant-area algorithm: `width = defaultHeight × √(aspectRatio)`. A CSS fallback covers historical images that haven't been processed yet.

https://github.com/user-attachments/assets/59e3d72e-8e4d-4f61-b4d5-b20314144050

## Install

> **Note:** Not yet available in Community Plugins. PR is pending review.

Tell your agent:

```
Install jm.sv/image-balance as an Obsidian plugin.
```

Or manually: download `main.js` and `manifest.json` from the [latest release](https://github.com/jamesvclements/image-balance/releases/latest) into `.obsidian/plugins/image-balance/`.


## Commands
> **Note:** Balance is automatically applied to all pasted images. The commands are useful for editing old files beyond the CSS fallback.

- **Apply balance** — Recalculate and apply widths to all images in the current note.
- **Remove balance** — Strip all width suffixes and disable CSS fallback.


https://github.com/user-attachments/assets/dd902429-6c11-47c7-9476-387b6503f000

