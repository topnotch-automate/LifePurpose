#!/usr/bin/env node

/**
 * Content Manager - Unified CLI for content generation and management
 * 
 * Usage:
 *   npm run content:new     - Create new content
 *   npm run content:sync    - Sync frontmatter for existing content
 */

import fs from "fs";
import path from "path";
import prompts from "prompts";
import matter from "gray-matter";

const CONTENT_ROOT = path.join(process.cwd(), "content");

// Simple slugify function
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Extract first paragraph as description
function extractDescription(content: string, maxLength: number = 160): string {
  const lines = content.trim().split("\n").filter(line => line.trim());
  const firstParagraph = lines.find(line => 
    line.trim().length > 20 && 
    !line.startsWith("#") && 
    !line.startsWith(">") &&
    !line.match(/^[-*+]\s/)
  ) || lines[0] || "";
  
  let desc = firstParagraph.trim();
  // Remove markdown formatting
  desc = desc.replace(/\*\*/g, "").replace(/\*/g, "").replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1");
  
  if (desc.length > maxLength) {
    desc = desc.substring(0, maxLength - 3) + "...";
  }
  return desc;
}

// Generate frontmatter based on content type
function generateFrontmatter(
  type: "article" | "video" | "book",
  data: {
    title: string;
    section?: "esoteriment" | "lifeward";
    description?: string;
    date?: string;
    [key: string]: any;
  }
): string {
  const baseFields: Record<string, any> = {
    title: data.title,
    description: data.description || "",
    date: data.date || new Date().toISOString().split("T")[0],
  };

  if (type === "article") {
    const lines = [
      "---",
      `title: "${baseFields.title}"`,
      `description: "${baseFields.description}"`,
      `date: "${baseFields.date}"`,
      `section: "${data.section || "esoteriment"}"`,
    ];
    
    if (data.category) lines.push(`category: "${data.category}"`);
    if (data.tags && data.tags.length > 0) {
      lines.push(`tags: [${data.tags.map((t: string) => `"${t}"`).join(", ")}]`);
    }
    if (data.image) lines.push(`image: "${data.image}"`);
    if (data.foundational) lines.push(`foundational: true`);
    if (data.funnel) {
      lines.push(`funnel:`);
      lines.push(`  book: "${data.funnel.book}"`);
      if (data.funnel.ctaType) lines.push(`  ctaType: "${data.funnel.ctaType}"`);
    }
    
    lines.push("---");
    return lines.join("\n") + "\n";
  }

  if (type === "video") {
    const lines = [
      "---",
      `title: "${baseFields.title}"`,
      `description: "${baseFields.description}"`,
      `date: "${baseFields.date}"`,
      `platform: "${data.platform || "youtube"}"`,
      `embedUrl: "${data.embedUrl || ""}"`,
      `section: "${data.section || "lifeward"}"`,
    ];
    
    if (data.relatedArticle) lines.push(`relatedArticle: "${data.relatedArticle}"`);
    if (data.thumbnail) lines.push(`thumbnail: "${data.thumbnail}"`);
    
    lines.push("---");
    return lines.join("\n") + "\n";
  }

  if (type === "book") {
    const lines = [
      "---",
      `title: "${baseFields.title}"`,
    ];
    
    if (data.subtitle) lines.push(`subtitle: "${data.subtitle}"`);
    lines.push(`description: "${baseFields.description}"`);
    lines.push(`date: "${baseFields.date}"`);
    
    if (data.cover) lines.push(`cover: "${data.cover}"`);
    if (data.themes && data.themes.length > 0) {
      lines.push(`themes: [${data.themes.map((t: string) => `"${t}"`).join(", ")}]`);
    }
    if (data.price !== undefined) lines.push(`price: ${data.price}`);
    if (data.currency) lines.push(`currency: "${data.currency}"`);
    if (data.status) lines.push(`status: "${data.status}"`);
    if (data.downloadLink) lines.push(`downloadLink: "${data.downloadLink}"`);
    if (data.purchaseLink) lines.push(`purchaseLink: "${data.purchaseLink}"`);
    if (data.purchaseUrl) lines.push(`purchaseUrl: "${data.purchaseUrl}"`);
    if (data.excerpt !== undefined) lines.push(`excerpt: ${data.excerpt}`);
    
    lines.push("---");
    return lines.join("\n") + "\n";
  }

  return `---\ntitle: "${baseFields.title}"\ndate: "${baseFields.date}"\n---\n`;
}

async function createContent() {
  const { contentType } = await prompts({
    type: "select",
    name: "contentType",
    message: "What type of content?",
    choices: [
      { title: "Article (Esoteriment/Lifeward)", value: "article" },
      { title: "Video", value: "video" },
      { title: "Book", value: "book" },
    ],
  });

  if (!contentType) return;

  const responses: any = await prompts([
    {
      type: "text",
      name: "title",
      message: "Title",
      validate: (value: string) => value.trim().length > 0 || "Title is required",
    },
  ]);

  if (!responses.title) return;

  // Content type specific prompts
  if (contentType === "article") {
    const articleData = await prompts([
      {
        type: "select",
        name: "section",
        message: "Section",
        choices: [
          { title: "Esoteriment", value: "esoteriment" },
          { title: "Lifeward", value: "lifeward" },
        ],
      },
      {
        type: "text",
        name: "category",
        message: "Category (optional)",
      },
      {
        type: "text",
        name: "tags",
        message: "Tags (comma-separated, optional)",
        format: (val: string) => val ? val.split(",").map((t: string) => t.trim()).filter((t: string) => t) : [],
      },
      {
        type: "text",
        name: "image",
        message: "Featured image path (optional, e.g., /images/articles/image.jpg)",
      },
      {
        type: "text",
        name: "funnelBook",
        message: "Funnel book slug (optional - for book promotion)",
      },
      {
        type: "confirm",
        name: "foundational",
        message: "Is this a foundational message? (appears in Start Here section)",
        initial: false,
      },
    ]);

    Object.assign(responses, articleData);

    // If funnel book is provided, ask for CTA type
    if (articleData.funnelBook) {
      const funnelData = await prompts([
        {
          type: "select",
          name: "ctaType",
          message: "CTA Type",
          choices: [
            { title: "Soft", value: "soft" },
            { title: "Standard", value: "standard" },
          ],
          initial: 0,
        },
      ]);

      responses.funnel = {
        book: articleData.funnelBook,
        ctaType: funnelData.ctaType || "soft",
      };
    }
  }

  if (contentType === "video") {
    const videoData = await prompts([
      {
        type: "select",
        name: "section",
        message: "Section",
        choices: [
          { title: "Esoteriment", value: "esoteriment" },
          { title: "Lifeward", value: "lifeward" },
        ],
      },
      {
        type: "text",
        name: "embedUrl",
        message: "Video Embed URL",
        validate: (value: string) => value.trim().length > 0 || "Embed URL is required",
      },
      {
        type: "text",
        name: "relatedArticle",
        message: "Related Article Slug (optional)",
      },
    ]);
    Object.assign(responses, videoData);
  }

  if (contentType === "book") {
    const bookData = await prompts([
      {
        type: "text",
        name: "subtitle",
        message: "Subtitle (optional)",
      },
      {
        type: "text",
        name: "themes",
        message: "Themes (comma-separated, optional)",
        format: (val: string) => val ? val.split(",").map((t: string) => t.trim()).filter((t: string) => t) : [],
      },
    ]);
    Object.assign(responses, bookData);
  }

  const slug = slugify(responses.title);
  let dir: string;
  
  if (contentType === "article") {
    dir = path.join(CONTENT_ROOT, responses.section);
  } else {
    dir = path.join(CONTENT_ROOT, contentType === "video" ? "videos" : "books");
  }

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, `${slug}.mdx`);

  if (fs.existsSync(filePath)) {
    const { overwrite } = await prompts({
      type: "confirm",
      name: "overwrite",
      message: `File ${path.relative(process.cwd(), filePath)} already exists. Overwrite?`,
      initial: false,
    });
    if (!overwrite) {
      console.log("Cancelled.");
      return;
    }
  }

  const frontmatter = generateFrontmatter(contentType, responses);
  const initialContent = frontmatter + "\n\nStart writing here...\n";

  fs.writeFileSync(filePath, initialContent);
  console.log(`\n✅ Created: ${path.relative(process.cwd(), filePath)}`);
  console.log(`\n📝 You can now edit this file directly. Frontmatter will be preserved.\n`);
}

async function syncContent() {
  const { action } = await prompts({
    type: "select",
    name: "action",
    message: "What would you like to sync?",
    choices: [
      { title: "Sync all content (auto-description & dates)", value: "all" },
      { title: "Add missing descriptions only", value: "description" },
      { title: "Update dates from file modification time", value: "date" },
      { title: "Sync specific file", value: "specific" },
    ],
  });

  if (!action) return;

  function findMdxFiles(dir: string): string[] {
    const files: string[] = [];
    if (!fs.existsSync(dir)) return files;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findMdxFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  let files: string[] = [];

  if (action === "specific") {
    const { filePath } = await prompts({
      type: "text",
      name: "filePath",
      message: "Enter file path (relative to content/):",
      validate: (value: string) => {
        const fullPath = path.join(CONTENT_ROOT, value);
        return fs.existsSync(fullPath) || "File not found";
      },
    });
    files = [path.join(CONTENT_ROOT, filePath)];
  } else {
    files = findMdxFiles(CONTENT_ROOT);
  }

  const options = {
    autoDescription: action === "all" || action === "description",
    updateDate: action === "all" || action === "date",
  };

  let synced = 0;
  for (const file of files) {
    const fileContent = fs.readFileSync(file, "utf8");
    const { data, content } = matter(fileContent);

    let updated = false;
    const updatedData: any = { ...data };

    if (options.autoDescription && content.trim()) {
      const autoDesc = extractDescription(content);
      if (!data.description || data.description.trim() === "") {
        updatedData.description = autoDesc;
        updated = true;
      }
    }

    if (options.updateDate) {
      const stats = fs.statSync(file);
      const fileDate = new Date(stats.mtime).toISOString().split("T")[0];
      if (data.date !== fileDate) {
        updatedData.date = fileDate;
        updated = true;
      }
    }

    if (updated) {
      const updatedFrontmatter = matter.stringify(content, updatedData, {
        delimiters: "---",
        language: "yaml",
      });
      fs.writeFileSync(file, updatedFrontmatter);
      console.log(`✅ Synced: ${path.relative(process.cwd(), file)}`);
      synced++;
    }
  }

  console.log(`\n✨ Synced ${synced} file(s).\n`);
}

function validateContent() {
  function findMdxFiles(dir: string): string[] {
    const files: string[] = [];
    if (!fs.existsSync(dir)) return files;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findMdxFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  interface ValidationError {
    file: string;
    field: string;
    message: string;
  }

  interface ValidationWarning {
    file: string;
    message: string;
  }

  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const files = findMdxFiles(CONTENT_ROOT);

  console.log(`\n🔍 Validating ${files.length} content file(s)...\n`);

  for (const filePath of files) {
    const relativePath = path.relative(process.cwd(), filePath);
    const fileName = path.basename(filePath);
    const dirName = path.basename(path.dirname(filePath));
    
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(fileContent);

      // Determine content type based on directory
      const isArticle = dirName === "esoteriment" || dirName === "lifeward";
      const isVideo = dirName === "videos";
      const isBook = dirName === "books";

      // Common validations
      if (!data.title || typeof data.title !== "string" || data.title.trim() === "") {
        errors.push({ file: relativePath, field: "title", message: "Title is required" });
      }

      if (!data.date || typeof data.date !== "string") {
        errors.push({ file: relativePath, field: "date", message: "Date is required" });
      } else {
        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(data.date)) {
          errors.push({ file: relativePath, field: "date", message: `Invalid date format: "${data.date}". Expected YYYY-MM-DD` });
        } else {
          // Validate date is valid
          const dateObj = new Date(data.date);
          if (isNaN(dateObj.getTime())) {
            errors.push({ file: relativePath, field: "date", message: `Invalid date: "${data.date}"` });
          }
        }
      }

      // Article validations
      if (isArticle) {
        if (!data.section || (data.section !== "esoteriment" && data.section !== "lifeward")) {
          errors.push({ 
            file: relativePath, 
            field: "section", 
            message: `Invalid section: "${data.section}". Must be "esoteriment" or "lifeward"` 
          });
        }

        // Check section matches directory
        if (data.section && data.section !== dirName) {
          errors.push({ 
            file: relativePath, 
            field: "section", 
            message: `Section "${data.section}" doesn't match directory "${dirName}"` 
          });
        }

        if (!data.description || typeof data.description !== "string" || data.description.trim() === "") {
          warnings.push({ file: relativePath, message: "Missing description (recommended for SEO)" });
        }

        // Validate slug matches filename
        const expectedSlug = fileName.replace(".mdx", "");
        if (data.title) {
          const titleSlug = slugify(data.title);
          if (titleSlug !== expectedSlug) {
            warnings.push({ 
              file: relativePath, 
              message: `Filename "${expectedSlug}" doesn't match title slug "${titleSlug}" (may be intentional)` 
            });
          }
        }
      }

      // Video validations
      if (isVideo) {
        if (!data.section || (data.section !== "esoteriment" && data.section !== "lifeward")) {
          errors.push({ 
            file: relativePath, 
            field: "section", 
            message: `Invalid section: "${data.section}". Must be "esoteriment" or "lifeward"` 
          });
        }

        if (!data.embedUrl || typeof data.embedUrl !== "string" || data.embedUrl.trim() === "") {
          errors.push({ file: relativePath, field: "embedUrl", message: "Embed URL is required for videos" });
        }

        if (!data.description || typeof data.description !== "string" || data.description.trim() === "") {
          warnings.push({ file: relativePath, message: "Missing description (recommended for SEO)" });
        }
      }

      // Book validations
      if (isBook) {
        if (!data.description || typeof data.description !== "string" || data.description.trim() === "") {
          errors.push({ file: relativePath, field: "description", message: "Description is required for books" });
        }

        if (!data.themes || !Array.isArray(data.themes) || data.themes.length === 0) {
          warnings.push({ file: relativePath, message: "Missing themes array (recommended)" });
        }
      }

      // Content validations
      if (!content || content.trim().length === 0) {
        warnings.push({ file: relativePath, message: "File has no content (frontmatter only)" });
      }

    } catch (error) {
      errors.push({ 
        file: relativePath, 
        field: "parse", 
        message: `Failed to parse file: ${error instanceof Error ? error.message : String(error)}` 
      });
    }
  }

  // Report results
  if (errors.length > 0) {
    console.log("❌ Validation Errors:\n");
    errors.forEach(({ file, field, message }) => {
      console.log(`  ${file}`);
      console.log(`    Field: ${field}`);
      console.log(`    Error: ${message}\n`);
    });
  }

  if (warnings.length > 0) {
    console.log("⚠️  Validation Warnings:\n");
    warnings.forEach(({ file, message }) => {
      console.log(`  ${file}`);
      console.log(`    Warning: ${message}\n`);
    });
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log("✅ All content files are valid!\n");
    process.exit(0);
  } else if (errors.length === 0) {
    console.log(`✅ No errors found. ${warnings.length} warning(s) above.\n`);
    process.exit(0);
  } else {
    console.log(`\n❌ Found ${errors.length} error(s) and ${warnings.length} warning(s).\n`);
    console.log("Please fix the errors above before deploying.\n");
    process.exit(1);
  }
}

// Main CLI
async function main() {
  const command = process.argv[2];

  if (command === "new" || command === "create") {
    await createContent();
  } else if (command === "sync") {
    await syncContent();
  } else if (command === "validate") {
    validateContent();
  } else {
    const { action } = await prompts({
      type: "select",
      name: "action",
      message: "What would you like to do?",
      choices: [
        { title: "Create new content", value: "create" },
        { title: "Sync existing content frontmatter", value: "sync" },
        { title: "Validate all content", value: "validate" },
      ],
    });

    if (action === "create") {
      await createContent();
    } else if (action === "sync") {
      await syncContent();
    } else if (action === "validate") {
      validateContent();
    }
  }
}

main().catch(console.error);

