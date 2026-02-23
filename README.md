# Image Batch Styles

Creating image styles in Figma takes a lot of clicks, and it's all one image at a time. This plugin allows you to create images styles in bulk from a selection of images.

> This plugin is from August 2024 when I needed to create a lot of image styles in bulk. I used Figma's starter files and ChatGPT to create a utilitarian v1. I may take this further and publish to the Figma Community, but my focus is currently on other projects. Someone asked about this plugin, and so I went ahead to share here in case it can save you some time.

## Getting setup (development-mode for now)

For now you can use it in Figma's plugin development mode:

1. Clone or [download this repo](https://github.com/benbennitt/figma-plugin-image-batch-styles/archive/refs/heads/main.zip).
2. In Figma, right-click and go to Plugins > Development > Import plugin from manifest...
3. Select the `manifest.json` from this project

## Using the plugin

1. Name the image layers you want to convert to styles. Their layer names will be the style names.
2. Select your image layers.
3. Run the plugin, optionally enter a style prefix, then click Create Styles.

That's it! The plugin creates a fill style for each selected layer’s image, names it with your prefix + the layer name, and applies the new style to that layer.

## Development

**Requirements:** [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) (`npm install -g pnpm`).

1. In this folder: `pnpm install`.
2. **While developing:** run `pnpm run watch` so `code.ts` is recompiled to `build/code.js` as you edit.
3. **One-off compile:** run `pnpm run build` to compile once (e.g. before importing the plugin or sharing the folder).

## License

MIT
