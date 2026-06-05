import fs from "fs";
import path from "path";
import { getSiteUrl } from "./site-url";

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"];

/**
 * Resolve a public image path from frontmatter. If the path has no extension,
 * tries common image extensions under /public (helps when admin omits .png).
 */
export function resolveArticleImagePath(image?: string): string | undefined {
  if (!image?.trim()) return undefined;

  const trimmed = image.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const urlPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const relative = urlPath.replace(/^\//, "");
  const basePath = path.join(process.cwd(), "public", relative);

  if (fs.existsSync(basePath) && fs.statSync(basePath).isFile()) {
    return urlPath;
  }

  const hasKnownExt = IMAGE_EXTENSIONS.some((ext) =>
    relative.toLowerCase().endsWith(ext)
  );

  if (!hasKnownExt) {
    for (const ext of IMAGE_EXTENSIONS) {
      const candidate = `${basePath}${ext}`;
      if (fs.existsSync(candidate)) {
        return `${urlPath}${ext}`;
      }
    }
  }

  return urlPath;
}

export function getAbsoluteArticleImageUrl(image?: string): string | undefined {
  const resolved = resolveArticleImagePath(image);
  if (!resolved) return undefined;

  if (resolved.startsWith("http://") || resolved.startsWith("https://")) {
    return resolved;
  }

  const siteUrl = getSiteUrl();
  return `${siteUrl}${resolved.startsWith("/") ? resolved : `/${resolved}`}`;
}
