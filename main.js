const { Plugin, PluginSettingTab, Setting } = require("obsidian");
const { StateEffect } = require("@codemirror/state");
const { EditorView } = require("@codemirror/view");

const IMAGE_EXTENSIONS = "png|jpg|jpeg|gif|webp|svg|bmp|avif";
const EMBED_REGEX = new RegExp(
	`!\\[\\[([^\\]|]+\\.(${IMAGE_EXTENSIONS}))\\]\\]`,
	"gi"
);

const DEFAULT_SETTINGS = { width: 400 };

const autoWidthEffect = StateEffect.define();

function buildExtension(plugin) {
	return EditorView.updateListener.of((update) => {
		if (!update.docChanged) return;
		if (
			update.transactions.some((tr) =>
				tr.effects.some((e) => e.is(autoWidthEffect))
			)
		)
			return;

		const width = plugin.settings.width;
		const changes = [];

		update.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
			const text = inserted.toString();
			EMBED_REGEX.lastIndex = 0;
			let match;
			while ((match = EMBED_REGEX.exec(text)) !== null) {
				const start = fromB + match.index;
				const end = start + match[0].length;
				changes.push({
					from: start,
					to: end,
					insert: `![[${match[1]}|${width}]]`,
				});
			}
		});

		if (changes.length > 0) {
			update.view.dispatch({
				changes,
				effects: autoWidthEffect.of(null),
			});
		}
	});
}

class DefaultImageWidthSettingTab extends PluginSettingTab {
	constructor(app, plugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Default width")
			.setDesc("Width in pixels applied to pasted images.")
			.addText((text) =>
				text
					.setPlaceholder("400")
					.setValue(String(this.plugin.settings.width))
					.onChange(async (value) => {
						const parsed = parseInt(value, 10);
						if (!isNaN(parsed) && parsed > 0) {
							this.plugin.settings.width = parsed;
							await this.plugin.saveData(this.plugin.settings);
						}
					})
			);
	}
}

module.exports = class DefaultImageWidth extends Plugin {
	async onload() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
		this.registerEditorExtension([buildExtension(this)]);
		this.addSettingTab(new DefaultImageWidthSettingTab(this.app, this));
	}
};
