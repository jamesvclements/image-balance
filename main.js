const { Plugin, PluginSettingTab, Setting } = require("obsidian");
const { StateEffect } = require("@codemirror/state");
const { EditorView } = require("@codemirror/view");

const IMAGE_EXTENSIONS = "png|jpg|jpeg|gif|webp|svg|bmp|avif";
const EMBED_REGEX = new RegExp(
	`!\\[\\[([^\\]|]+\\.(${IMAGE_EXTENSIONS}))\\]\\]`,
	"gi"
);

const DEFAULT_SETTINGS = { defaultHeight: 300 };

const dimensionCache = new Map();
const autoWidthEffect = StateEffect.define();

async function getImageDimensions(plugin, filename) {
	if (dimensionCache.has(filename)) return dimensionCache.get(filename);

	const file = plugin.app.metadataCache.getFirstLinkpathDest(filename, "");
	if (!file) return null;

	const arrayBuffer = await plugin.app.vault.readBinary(file);
	const blob = new Blob([arrayBuffer]);
	const url = URL.createObjectURL(blob);

	const dims = await new Promise((resolve) => {
		const img = new Image();
		img.onload = () => {
			URL.revokeObjectURL(url);
			resolve({ width: img.naturalWidth, height: img.naturalHeight });
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			resolve(null);
		};
		img.src = url;
	});

	if (dims) dimensionCache.set(filename, dims);
	return dims;
}

function computeWidth(dimensions, defaultHeight) {
	if (!dimensions) return defaultHeight;
	const ratio = dimensions.width / dimensions.height;
	// constant visual area: width = defaultHeight * sqrt(ratio)
	return Math.round(defaultHeight * Math.sqrt(ratio));
}

function buildExtension(plugin) {
	return EditorView.updateListener.of((update) => {
		if (!update.docChanged) return;
		if (plugin._suppressListener) return;
		if (
			update.transactions.some((tr) =>
				tr.effects.some((e) => e.is(autoWidthEffect))
			)
		)
			return;

		const pending = [];

		update.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
			const text = inserted.toString();
			EMBED_REGEX.lastIndex = 0;
			let match;
			while ((match = EMBED_REGEX.exec(text)) !== null) {
				const start = fromB + match.index;
				const end = start + match[0].length;
				pending.push({ start, end, filename: match[1] });
			}
		});

		if (pending.length === 0) return;

		Promise.all(
			pending.map((p) => getImageDimensions(plugin, p.filename))
		).then((dimensions) => {
			const changes = pending.map((p, i) => ({
				from: p.start,
				to: p.end,
				insert: `![[${p.filename}|${computeWidth(dimensions[i], plugin.settings.defaultHeight)}]]`,
			}));

			update.view.dispatch({
				changes,
				effects: autoWidthEffect.of(null),
			});
		});
	});
}

const CSS_FALLBACK_ID = "image-balance-fallback";

function injectFallbackCSS(height) {
	removeFallbackCSS();
	const style = document.createElement("style");
	style.id = CSS_FALLBACK_ID;
	style.textContent = `
		.markdown-preview-view img:not([width]),
		.markdown-source-view img:not([width]) {
			max-height: ${height}px;
			width: auto;
		}
	`;
	document.head.appendChild(style);
}

function removeFallbackCSS() {
	const el = document.getElementById(CSS_FALLBACK_ID);
	if (el) el.remove();
}

class ImageBalanceSettingTab extends PluginSettingTab {
	constructor(app, plugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Default height")
			.setDesc(
				"Base target height in pixels. Width is computed to maintain constant visual area across all aspect ratios."
			)
			.addText((text) =>
				text
					.setPlaceholder("300")
					.setValue(String(this.plugin.settings.defaultHeight))
					.onChange(async (value) => {
						const parsed = parseInt(value, 10);
						if (!isNaN(parsed) && parsed > 0) {
							this.plugin.settings.defaultHeight = parsed;
							await this.plugin.saveData(this.plugin.settings);
							injectFallbackCSS(parsed);
						}
					})
			);
	}
}

const ALL_EMBEDS_REGEX = new RegExp(
	`!\\[\\[([^\\]|]+\\.(${IMAGE_EXTENSIONS}))(\\|\\d+)?\\]\\]`,
	"gi"
);

const SUFFIXED_REGEX = new RegExp(
	`!\\[\\[([^\\]|]+\\.(${IMAGE_EXTENSIONS}))\\|\\d+\\]\\]`,
	"gi"
);

module.exports = class ImageBalance extends Plugin {
	async onload() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
		this.registerEditorExtension([buildExtension(this)]);
		this.addSettingTab(new ImageBalanceSettingTab(this.app, this));
		injectFallbackCSS(this.settings.defaultHeight);

		this.addCommand({
			id: "apply-balance",
			name: "Apply balance",
			editorCallback: async (editor) => {
				const content = editor.getValue();
				ALL_EMBEDS_REGEX.lastIndex = 0;
				const matches = [];
				let match;
				while ((match = ALL_EMBEDS_REGEX.exec(content)) !== null) {
					matches.push({
						index: match.index,
						length: match[0].length,
						filename: match[1],
					});
				}

				if (matches.length === 0) return;

				const dimensions = await Promise.all(
					matches.map((m) => getImageDimensions(this, m.filename))
				);

				let updated = content;
				for (let i = matches.length - 1; i >= 0; i--) {
					const m = matches[i];
					const width = computeWidth(
						dimensions[i],
						this.settings.defaultHeight
					);
					const replacement = `![[${m.filename}|${width}]]`;
					updated =
						updated.slice(0, m.index) +
						replacement +
						updated.slice(m.index + m.length);
				}

				// suppress listener — setValue triggers CodeMirror update synchronously
				this._suppressListener = true;
				editor.setValue(updated);
				this._suppressListener = false;
				injectFallbackCSS(this.settings.defaultHeight);
			},
		});

		this.addCommand({
			id: "remove-balance",
			name: "Remove balance",
			editorCallback: (editor) => {
				this._suppressListener = true;
				removeFallbackCSS();
				const content = editor.getValue();
				const updated = content.replace(SUFFIXED_REGEX, "![[$1]]");
				if (updated !== content) editor.setValue(updated);
				this._suppressListener = false;
			},
		});
	}

	onunload() {
		removeFallbackCSS();
	}
};
