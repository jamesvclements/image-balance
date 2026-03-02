# Image Balance

Obsidian plugin that automatically sizes pasted images so they all have the same visual weight, regardless of aspect ratio.

```
![[landscape.png]]  →  ![[landscape.png|400]]
![[portrait.png]]   →  ![[portrait.png|225]]
![[ultrawide.png]]  →  ![[ultrawide.png|600]]
```

Uses a constant-area algorithm: `width = defaultHeight × √(aspectRatio)`. A square, a landscape, and a portrait all occupy roughly the same number of pixels on screen.

A CSS fallback (`max-height` on images without an explicit width) covers historical images that haven't been processed yet.

## Settings

- **Default height** — Base target height in pixels (default 300). Width is derived from the image's aspect ratio to maintain constant visual area.

## Commands

- **Apply image widths to current file** — Suffix all images in the current note (overwrites existing widths).
- **Remove image widths from current file** — Strip all width suffixes and disable CSS fallback. Full reset.

## How it works

The plugin uses a CodeMirror 6 `updateListener` that fires after every document change. When it detects a new image embed without a width, it reads the image's dimensions from the vault, computes the width using the constant-area formula, and dispatches a follow-up transaction to add the suffix. No timeouts, no flicker.

## Install from Community Plugins

Search "Image Balance" in Settings → Community Plugins → Browse.

## Manual install

Download `main.js` and `manifest.json` from the [latest release](https://github.com/jamesvclements/image-balance/releases/latest) into your vault's `.obsidian/plugins/image-balance/` directory. Enable the plugin in Settings → Community Plugins.
