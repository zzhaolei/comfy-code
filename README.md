# Comfy Code

A custom build of [Iosevka](https://github.com/be5invis/Iosevka) for comfortable, distraction-free coding.

## Features

- Fixed-pitch, sans-serif letterforms
- Normal and Condensed widths
- Upright and italic styles
- Programming ligatures disabled
- Wider aperture on lowercase `c` and shorter dashed arrows `⇡⇣`
- Hinted TTF, unhinted TTF, and webfont packages

## Specimen

A quick at-a-glance view of letterforms, numerals, and punctuation.

<p align="center">
  <img src="asserts/image/specimen.png" alt="Comfy Code specimen preview" width="720" />
</p>

## Weights & Italics

The preview highlights Light, Regular, Medium, and Bold in both roman and italic. Releases include the full set of generated weights.

<p align="center">
  <img src="asserts/image/weights.png" alt="Comfy Code weights and italics preview" width="720" />
</p>

## Download & Install

Download the [latest release](https://github.com/zzhaolei/comfy-code/releases/latest) and choose the package for your use case:

- `ComfyCode-hinted.zip` for desktop use
- `ComfyCode-unhinted.zip` for unhinted TTF files
- `ComfyCode-webfont.zip` for web projects

Extract the archive, then install the TTF files through your operating system or use the included webfont files and CSS in your project.

## Build Locally with Docker

Run these commands from the repository root with Docker running. The image uses the version in `IOSEVKA_VERSION`, installs the build tools, and registers the custom glyph variants. The first build downloads the source and dependencies; subsequent image builds reuse Docker's cache. Your build plan is mounted read-only and loaded on every run.

```bash
# Quick trial: Regular weight, both widths, upright and italic (4 unhinted TTFs).
docker compose run --build --rm fonts preview

# All configured weights, widths, and slopes as unhinted TTFs.
docker compose run --build --rm fonts unhinted

# All weights and all formats: hinted/unhinted TTF and webfonts.
docker compose run --build --rm fonts full
```

Preview fonts appear in `dist/docker/ComfyCodePreview/TTF-Unhinted/` and use the family name **Comfy Code Preview**, so you can install and compare them alongside Comfy Code. Full-family builds appear in `dist/docker/ComfyCode/`. On macOS, open the generated unhinted TTFs in Font Book to install them, then select the font in your editor.

The default is two concurrent jobs. To reduce memory usage, use `BUILD_JOBS=1 docker compose run --build --rm fonts preview`. Keep `--build` when changing `IOSEVKA_VERSION`, the custom glyph extension, or Docker build files so the image includes those changes.

## Custom Glyph Shapes

Custom glyphs are drawn with Iosevka's parametric geometry and selected in `private-build-plans.toml`:

```toml
[buildPlans.ComfyCode.variants.design]
c = "open-serifless"
vertical-dashed-arrows = "short"
```

`open-serifless` reduces lowercase `c`'s terminal depth to 70%. `short` draws `⇡` / `⇣` (U+21E1 / U+21E3) at 75% height, preserving arrowhead size and stroke thickness. Both adapt to the font's weight, width, and slope. Set `c = "serifless"` and `vertical-dashed-arrows = "standard"` to restore the upstream shapes. Individual slopes can override these choices in `variants.upright` or `variants.italic`.

These two options are Comfy Code extensions, not built-in Iosevka options. The workflow applies [the variant registration and drawing code](.github/patches/iosevka-custom-variants.patch) before compiling. The original variants remain available; adding the extension alone does not change the default shapes. A plan file cannot contain glyph outlines by itself.

For local builds, copy `private-build-plans.toml` into the Iosevka checkout, run `git apply /path/to/comfy-code/.github/patches/iosevka-custom-variants.patch` there once, then build normally. When updating the version in `IOSEVKA_VERSION`, verify that the extension still applies and inspect the generated glyphs.

## License

The repository configuration and automation are licensed under the [MIT License](LICENSE). Generated fonts are derivatives of Iosevka and remain licensed under the [SIL Open Font License 1.1](https://github.com/be5invis/Iosevka/blob/main/LICENSE.md).
