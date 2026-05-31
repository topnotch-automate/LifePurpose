import fs from "fs";
import path from "path";
import { isValidSlug, slugify } from "./content-files";
import { getGitHubFileSha, isGitHubConfigured, putGitHubBinaryFile } from "./github-content";
import type { ContentSaveBackend } from "./content-storage";

const ARTICLE_IMAGES_PUBLIC_DIR = "public/images/articles";
const ARTICLE_IMAGES_URL_PREFIX = "/images/articles";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const MIME_TO_EXT: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

function useGitHubForWrites(): boolean {
  if (isGitHubConfigured()) {
    return true;
  }
  if (process.env.NODE_ENV === "development") {
    return false;
  }
  throw new Error(
    "Image publishing requires GITHUB_TOKEN and GITHUB_REPO in production. See .env.example."
  );
}

function extensionForMime(mimeType: string): string {
  const ext = MIME_TO_EXT[mimeType.toLowerCase()];
  if (!ext) {
    throw new Error("Unsupported image type. Use PNG, JPEG, WebP, or GIF.");
  }
  return ext;
}

function buildImageBasename(slug?: string): string {
  const trimmed = slug?.trim();
  if (trimmed && isValidSlug(trimmed)) {
    return trimmed;
  }
  return `article-${Date.now()}`;
}

export function getArticleFeaturedImageRelativePath(basename: string, ext: string): string {
  return `${ARTICLE_IMAGES_PUBLIC_DIR}/${basename}${ext}`;
}

export function getArticleFeaturedImageUrl(basename: string, ext: string): string {
  return `${ARTICLE_IMAGES_URL_PREFIX}/${basename}${ext}`;
}

export async function uploadArticleFeaturedImage(
  file: Buffer,
  mimeType: string,
  slug?: string
): Promise<{ path: string; relativePath: string; backend: ContentSaveBackend }> {
  if (file.byteLength === 0) {
    throw new Error("Image file is empty");
  }
  if (file.byteLength > MAX_IMAGE_BYTES) {
    throw new Error("Image must be 5 MB or smaller");
  }

  const ext = extensionForMime(mimeType);
  const basename = buildImageBasename(slug);
  const relativePath = getArticleFeaturedImageRelativePath(basename, ext);
  const publicPath = getArticleFeaturedImageUrl(basename, ext);

  if (useGitHubForWrites()) {
    const existingSha = await getGitHubFileSha(relativePath);
    await putGitHubBinaryFile(
      relativePath,
      file,
      `Upload featured image: ${basename}${ext}`,
      existingSha ?? undefined
    );
    return { path: publicPath, relativePath, backend: "github" };
  }

  const fullPath = path.join(process.cwd(), relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, file);
  return { path: publicPath, relativePath, backend: "local" };
}

export function sanitizeUploadSlug(value?: string | null): string | undefined {
  if (!value?.trim()) return undefined;
  const slug = slugify(value.trim());
  return isValidSlug(slug) ? slug : undefined;
}
