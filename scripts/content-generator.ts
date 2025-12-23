import fs from "fs";
import path from "path";
import prompts from "prompts";

const CONTENT_ROOT = path.join(process.cwd(), "content");

// Simple slugify function
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Extract first paragraph as description helper
function extractDescription(content: string, maxLength: number = 160): string {
  const lines = content.trim().split("\n").filter(line => line.trim());
  const firstParagraph = lines.find(line => 
    line.trim().length > 20 && 
    !line.startsWith("#") && 
    !line.startsWith(">") &&
    !line.match(/^[-*+]\s/)
  ) || lines[0] || "";
  
  let desc = firstParagraph.trim();
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
    return `---
title: "${baseFields.title}"
description: "${baseFields.description}"
date: "${baseFields.date}"
section: "${data.section || "esoteriment"}"
${data.category ? `category: "${data.category}"` : ""}
${data.tags && data.tags.length > 0 ? `tags: [${data.tags.map((t: string) => `"${t}"`).join(", ")}]` : ""}
${data.image ? `image: "${data.image}"` : ""}
${data.funnel ? `funnel:\n  book: "${data.funnel.book}"${data.funnel.ctaType ? `\n  ctaType: "${data.funnel.ctaType}"` : ""}` : ""}
---
`;
  }

  if (type === "video") {
    return `---
title: "${baseFields.title}"
description: "${baseFields.description}"
date: "${baseFields.date}"
platform: "${data.platform || "youtube"}"
embedUrl: "${data.embedUrl || ""}"
section: "${data.section || "lifeward"}"
${data.relatedArticle ? `relatedArticle: "${data.relatedArticle}"` : ""}
${data.thumbnail ? `thumbnail: "${data.thumbnail}"` : ""}
---
`;
  }

  if (type === "book") {
    return `---
title: "${baseFields.title}"
${data.subtitle ? `subtitle: "${data.subtitle}"` : ""}
description: "${baseFields.description}"
date: "${baseFields.date}"
${data.cover ? `cover: "${data.cover}"` : ""}
${data.themes && data.themes.length > 0 ? `themes: [${data.themes.map((t: string) => `"${t}"`).join(", ")}]` : ""}
${data.price ? `price: ${data.price}` : ""}
${data.currency ? `currency: "${data.currency}"` : ""}
${data.status ? `status: "${data.status}"` : ""}
${data.downloadLink ? `downloadLink: "${data.downloadLink}"` : ""}
${data.purchaseLink ? `purchaseLink: "${data.purchaseLink}"` : ""}
${data.purchaseUrl ? `purchaseUrl: "${data.purchaseUrl}"` : ""}
${data.excerpt !== undefined ? `excerpt: ${data.excerpt}` : ""}
---
`;
  }

  return `---
title: "${baseFields.title}"
date: "${baseFields.date}"
---
`;
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
        format: (val: string) => val ? val.split(",").map(t => t.trim()).filter(t => t) : [],
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
        format: (val: string) => val ? val.split(",").map(t => t.trim()).filter(t => t) : [],
      },
    ]);
    Object.assign(responses, bookData);
  }

  // Generate slug
  const slug = slugify(responses.title);

  // Determine directory based on content type
  let dir: string;
  if (contentType === "article") {
    dir = path.join(CONTENT_ROOT, responses.section);
  } else {
    dir = path.join(CONTENT_ROOT, contentType === "video" ? "videos" : "books");
  }

  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const filePath = path.join(dir, `${slug}.mdx`);

  if (fs.existsSync(filePath)) {
    const { overwrite } = await prompts({
      type: "confirm",
      name: "overwrite",
      message: `File ${filePath} already exists. Overwrite?`,
      initial: false,
    });
    if (!overwrite) {
      console.log("Cancelled.");
      return;
    }
  }

  // Generate frontmatter
  const frontmatter = generateFrontmatter(contentType, responses);
  const initialContent = frontmatter + "\n\nStart writing here...\n";

  fs.writeFileSync(filePath, initialContent);
  console.log(`\n✅ Created: ${filePath}`);
  console.log(`\n📝 You can now edit this file directly. Frontmatter will be preserved.\n`);
}

createContent().catch(console.error);

