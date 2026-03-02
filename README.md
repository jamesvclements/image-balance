# Image Balance

Obsidian plugin that automatically sizes pasted images so they all have the same visual weight, regardless of aspect ratio.
Uses a constant-area algorithm: `width = defaultHeight × √(aspectRatio)`. A CSS fallback covers historical images that haven't been processed yet.

https://github.com/user-attachments/assets/daa512f8-21b8-48bf-a3e1-32fca7d1631f

## How it works

When you paste an image, the plugin reads its dimensions from the vault and computes a width using the constant-area formula, then appends it to the embed syntax (`![[image.png|400]]`). This persists in your markdown and survives plugin removal. A CSS `max-height` fallback constrains older images that haven't been processed yet, targeting only images without an explicit width attribute so it never conflicts with the suffix.

## Why not pure CSS?

CSS alone can't distinguish aspect ratios — `max-height` treats all images the same, so portraits and landscapes can't be sized differently. Per-image CSS rules (injected on paste) could solve that, but they live in memory and vanish when Obsidian restarts. We'd need to re-scan every note on open or maintain a sidecar cache — both more complex and fragile than writing the width into the markdown itself, where it's self-documenting and free to persist.

## Commands

> **Note:** Balance is automatically applied to all pasted images. The commands are useful for editing old files beyond the CSS fallback.

- **Apply balance** — Recalculate and apply widths to all images in the current note.
- **Remove balance** — Strip all width suffixes and disable CSS fallback.

## Install

> **Note:** Not yet available in Community Plugins. [PR is pending review.](https://github.com/obsidianmd/obsidian-releases/pull/10622)

Tell your agent:

```
Install jm.sv/image-balance as an Obsidian plugin.
```

Or manually: download `main.js` and `manifest.json` from the [latest release](https://github.com/jamesvclements/image-balance/releases/latest) into `.obsidian/plugins/image-balance/`.
