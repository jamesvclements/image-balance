# Image Balance

Obsidian plugin that automatically sizes pasted images so they all have the same visual weight, regardless of aspect ratio.

https://github.com/jamesvclements/image-balance/raw/main/demo-paste.mp4

https://github.com/jamesvclements/image-balance/raw/main/demo-balance.mp4

Uses a constant-area algorithm: `width = defaultHeight × √(aspectRatio)`. A CSS fallback covers historical images that haven't been processed yet.

## Commands

- **Apply balance** — Recalculate and apply widths to all images in the current note.
- **Remove balance** — Strip all width suffixes and disable CSS fallback.

## Install

> **Note:** Not yet available in Community Plugins. PR is pending review.

Tell your agent:

```
Install jm.sv/image-balance as an Obsidian plugin.
```

Or manually: download `main.js` and `manifest.json` from the [latest release](https://github.com/jamesvclements/image-balance/releases/latest) into `.obsidian/plugins/image-balance/`.
