# Image Balance

Obsidian plugin that automatically sizes pasted images so they all have the same visual weight, regardless of aspect ratio.
Uses a constant-area algorithm: `width = defaultHeight × √(aspectRatio)`. A CSS fallback covers historical images that haven't been processed yet.

https://github.com/user-attachments/assets/daa512f8-21b8-48bf-a3e1-32fca7d1631f

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
