import { rm } from "fs/promises";
import { resolve } from "path";
import { beforeAll, expect, it } from "vitest";
import type { Stats } from "webpack";
import compiler from "../compiler.js";

const outputPath = resolve(import.meta.dirname, "../../artifacts/test/output");

beforeAll(async () => {
  try {
    await rm(outputPath, { recursive: true });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return;
    }

    throw error;
  }
});

it("errors for web app manifests with malformed JSON", async () => {
  let error: unknown;

  try {
    await compiler("invalid/malformed-json");
  } catch (err) {
    error = err;
  }

  expect(getErrorMessage(error)).toMatch("JSON.parse");
});

it("errors for web app manifests with unresolved images", async () => {
  let error: unknown;

  try {
    await compiler("invalid/unresolved-image");
  } catch (err) {
    error = err;
  }

  expect(getErrorMessage(error)).toMatch("Can't resolve");
});

it("outputs comprehensive web app manifests", async () => {
  const stats = await compiler("valid/comprehensive");

  expect(parseManifestJSON(stats)).toMatchInlineSnapshot(`
    {
      "background_color": "#D5415C",
      "description": "A build system for web application icon and image assets",
      "display": "standalone",
      "icons": [
        {
          "sizes": "1024x1024",
          "src": "/path/to/public/icon-masked-1024x1024.public.png",
          "type": "image/png",
        },
        {
          "sizes": "512x512",
          "src": "/path/to/public/icon-masked-512x512.public.png",
          "type": "image/png",
        },
        {
          "sizes": "192x192",
          "src": "/path/to/public/icon-masked-192x192.public.png",
          "type": "image/png",
        },
        {
          "purpose": "maskable",
          "sizes": "1024x1024",
          "src": "/path/to/public/icon-maskable-1024x1024.public.png",
          "type": "image/png",
        },
        {
          "purpose": "maskable",
          "sizes": "512x512",
          "src": "/path/to/public/icon-maskable-512x512.public.png",
          "type": "image/png",
        },
        {
          "purpose": "maskable",
          "sizes": "192x192",
          "src": "/path/to/public/icon-maskable-192x192.public.png",
          "type": "image/png",
        },
      ],
      "icons_localized": {
        "en-AU": [
          {
            "sizes": "1024x1024",
            "src": "/path/to/public/icon-masked-1024x1024.public.png",
            "type": "image/png",
          },
          {
            "sizes": "512x512",
            "src": "/path/to/public/icon-masked-512x512.public.png",
            "type": "image/png",
          },
          {
            "sizes": "192x192",
            "src": "/path/to/public/icon-masked-192x192.public.png",
            "type": "image/png",
          },
          {
            "purpose": "maskable",
            "sizes": "1024x1024",
            "src": "/path/to/public/icon-maskable-1024x1024.public.png",
            "type": "image/png",
          },
          {
            "purpose": "maskable",
            "sizes": "512x512",
            "src": "/path/to/public/icon-maskable-512x512.public.png",
            "type": "image/png",
          },
          {
            "purpose": "maskable",
            "sizes": "192x192",
            "src": "/path/to/public/icon-maskable-192x192.public.png",
            "type": "image/png",
          },
        ],
      },
      "lang": "en-US",
      "name": "Iconduit",
      "related_applications": [
        {
          "id": "915056765",
          "platform": "itunes",
          "url": "https://itunes.apple.com/app/id915056765",
        },
        {
          "id": "com.google.android.apps.maps",
          "platform": "play",
          "url": "https://play.google.com/store/apps/details?id=com.google.android.apps.maps",
        },
        {
          "id": "9wzdncrdtbvb",
          "platform": "windows",
          "url": "https://microsoft.com/p/app/9wzdncrdtbvb",
        },
      ],
      "screenshots": [
        {
          "form_factor": "narrow",
          "label": "Original",
          "platform": "ios",
          "sizes": "552x696",
          "src": "/path/to/public/screenshot-a.public.png",
          "type": "image/png",
        },
        {
          "form_factor": "narrow",
          "label": "Neon Orange",
          "platform": "ios",
          "sizes": "552x696",
          "src": "/path/to/public/screenshot-b.public.png",
          "type": "image/png",
        },
        {
          "form_factor": "narrow",
          "label": "Cowboy Bebop",
          "platform": "ios",
          "sizes": "552x696",
          "src": "/path/to/public/screenshot-c.public.png",
          "type": "image/png",
        },
      ],
      "short_name": "Iconduit",
      "start_url": ".",
      "theme_color": "#D5415C",
    }
  `);
});

it("outputs partially malformed web app manifests", async () => {
  const stats = await compiler("valid/partially-malformed");

  expect(parseManifestJSON(stats)).toMatchInlineSnapshot(`
    {
      "background_color": "#D5415C",
      "description": "A build system for web application icon and image assets",
      "display": "standalone",
      "icons": [
        {
          "sizes": "1024x1024",
          "type": "image/png",
        },
        {
          "sizes": "512x512",
          "src": "/path/to/public/icon-masked-512x512.public.png",
          "type": "image/png",
        },
        {
          "sizes": "192x192",
          "src": "/path/to/public/icon-masked-192x192.public.png",
          "type": "image/png",
        },
        {
          "purpose": "maskable",
          "sizes": "1024x1024",
          "type": "image/png",
        },
        {
          "purpose": "maskable",
          "sizes": "512x512",
          "src": "/path/to/public/icon-maskable-512x512.public.png",
          "type": "image/png",
        },
        {
          "purpose": "maskable",
          "sizes": "192x192",
          "src": "/path/to/public/icon-maskable-192x192.public.png",
          "type": "image/png",
        },
      ],
      "icons_localized": null,
      "lang": "en-US",
      "name": "Iconduit",
      "related_applications": [
        {
          "id": "915056765",
          "platform": "itunes",
          "url": "https://itunes.apple.com/app/id915056765",
        },
        {
          "id": "com.google.android.apps.maps",
          "platform": "play",
          "url": "https://play.google.com/store/apps/details?id=com.google.android.apps.maps",
        },
        {
          "id": "9wzdncrdtbvb",
          "platform": "windows",
          "url": "https://microsoft.com/p/app/9wzdncrdtbvb",
        },
      ],
      "screenshots": {
        "form_factor": "narrow",
        "label": "Original",
        "platform": "ios",
        "sizes": "552x696",
        "src": "screenshot-a.png",
        "type": "image/png",
      },
      "short_name": "Iconduit",
      "start_url": ".",
      "theme_color": "#D5415C",
    }
  `);
});

it("outputs non-object web app manifests", async () => {
  const stats = await compiler("valid/non-object");

  expect(parseManifestJSON(stats)).toMatchInlineSnapshot(`null`);
});

function parseManifestJSON(stats: Stats): string {
  const { modules = [] } = stats.toJson({ source: true });

  for (const { name, source } of modules) {
    if (name === "./app.webmanifest") return JSON.parse(String(source));
  }

  throw new Error("No web app manifest found in compilation");
}

function getErrorMessage(err: unknown): string {
  return Array.isArray(err) &&
    typeof err[0] === "object" &&
    err[0] != null &&
    "message" in err[0]
    ? err[0].message
    : "";
}
