import { resolve } from "path";
import { callbackify } from "util";
import type { LoaderDefinitionFunction } from "webpack";

const webManifestLoader: LoaderDefinitionFunction = function (source) {
  const manifest = JSON.parse(source) as unknown;

  if (typeof manifest !== "object" || manifest == null) return source;

  const tasks: Promise<void>[] = [];

  const loadImage = async (image: Image): Promise<void> => {
    try {
      image.src = await this.importModule(resolve(this.context, image.src));
    } catch {
      // error handled by webpack
    }
  };

  const loadImages = (images: unknown): void => {
    if (!Array.isArray(images)) return;

    for (let i = 0; i < images.length; ++i) {
      const image = images[i];
      if (isImage(image)) tasks.push(loadImage(image));
    }
  };

  const loadLocalizedImages = (localized: unknown): void => {
    if (typeof localized !== "object" || localized == null) return;

    for (const images of Object.values(localized)) loadImages(images);
  };

  if ("icons" in manifest) {
    loadImages(manifest.icons);
  }
  if ("icons_localized" in manifest) {
    loadLocalizedImages(manifest.icons_localized);
  }
  if ("screenshots" in manifest) {
    loadImages(manifest.screenshots);
  }

  callbackify(async () => {
    await Promise.all(tasks);

    return JSON.stringify(manifest);
  })(this.async());
};

export default webManifestLoader;

type Image = { src: string };

function isImage(image: unknown): image is Image {
  return (
    typeof image === "object" &&
    image != null &&
    "src" in image &&
    typeof image.src === "string"
  );
}
