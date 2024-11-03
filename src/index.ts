import { resolve } from "path";
import { callbackify } from "util";
import type { LoaderDefinitionFunction } from "webpack";

const subLoaderPath = require.resolve("./sub-loader.js");

const webManifestLoader: LoaderDefinitionFunction = function (source) {
  const manifest = JSON.parse(source) as unknown;

  if (typeof manifest !== "object" || manifest == null) return source;

  const tasks: Promise<void>[] = [];

  const loadSrc = async (obj: unknown): Promise<void> => {
    if (!hasProperty(obj, "src") || typeof obj.src !== "string") return;

    obj.src = await this.importModule(
      `!!${subLoaderPath}!${resolve(this.context, obj.src)}`,
    );
  };

  const loadImages = (images: unknown): void => {
    if (!Array.isArray(images)) return;

    for (let i = 0; i < images.length; ++i) {
      const image = images[i];
      tasks.push(loadSrc(image));
    }
  };

  const loadLocalizedImages = (localized: unknown): void => {
    if (typeof localized !== "object" || localized == null) return;

    for (const images of Object.values(localized)) loadImages(images);
  };

  if (hasProperty(manifest, "icons")) {
    loadImages(manifest.icons);
  }
  if (hasProperty(manifest, "icons_localized")) {
    loadLocalizedImages(manifest.icons_localized);
  }
  if (hasProperty(manifest, "shortcuts") && Array.isArray(manifest.shortcuts)) {
    for (const shortcut of manifest.shortcuts) {
      if (hasProperty(shortcut, "icons")) {
        loadImages(shortcut.icons);
      }
      if (hasProperty(shortcut, "icons_localized")) {
        loadLocalizedImages(shortcut.icons_localized);
      }
    }
  }
  if (hasProperty(manifest, "screenshots")) {
    loadImages(manifest.screenshots);
  }

  callbackify(async () => {
    await Promise.all(tasks);

    return JSON.stringify(manifest);
  })(this.async());
};

module.exports = webManifestLoader;

function hasProperty<T extends string>(
  obj: unknown,
  tag: T,
): obj is { [K in T]: unknown } {
  return typeof obj === "object" && obj != null && tag in obj;
}
