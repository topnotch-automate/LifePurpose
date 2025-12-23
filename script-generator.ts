import fs from "fs";
import path from "path";
import slugify from "slugify";
import prompts from "prompts";

const CONTENT_ROOT = path.join(process.cwd(), "content");

async function main() {
  const response = await prompts([
    {
      type: "text",
      name: "title",
      message: "Title",
    },
    {
      type: "select",
      name: "type",
      message: "Content type",
      choices: [
        { title: "Article", value: "articles" },
        { title: "Teaching", value: "teachings" },
        { title: "Video", value: "videos" },
        { title: "Book", value: "books" },
        { title: "Guide", value: "guides" },
      ],
    },
    {
      type: "select",
      name: "section",
      message: "Section",
      choices: [
        { title: "Esoteriment", value: "esoteriment" },
        { title: "Lifeward", value: "lifeward" },
      ],
    },
  ]);

  const slug = slugify(response.title, { lower: true });

  const dir = path.join(CONTENT_ROOT, response.type);
  const filePath = path.join(dir, `${slug}.mdx`);

  if (fs.existsSync(filePath)) {
    console.error("File already exists.");
    return;
  }

  const frontmatter = `---
title: "${response.title}"
type: "${response.type}"
section: "${response.section}"
date: "${new Date().toISOString().split("T")[0]}"
published: false
---

`;

  fs.writeFileSync(filePath, frontmatter);

  console.log(`Created: ${filePath}`);
}

main();
