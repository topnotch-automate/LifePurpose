import fs from "fs";
import path from "path";
import matter from "gray-matter";
import prompts from "prompts";

const CONTENT_ROOT = path.join(process.cwd(), "content");

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
  if (desc.length > maxLength) {
    desc = desc.substring(0, maxLength - 3) + "...";
  }
  return desc;
}

// Update frontmatter while preserving content
function syncFrontmatter(filePath: string, options: { autoDescription?: boolean; updateDate?: boolean } = {}) {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);

  let updated = false;
  const updatedData: any = { ...data };

  // Auto-generate description if missing or if autoDescription is enabled
  if (options.autoDescription && content.trim()) {
    const autoDesc = extractDescription(content);
    if (!data.description || data.description.trim() === "") {
      updatedData.description = autoDesc;
      updated = true;
    }
  }

  // Update date if updateDate is enabled (use file modification time)
  if (options.updateDate) {
    const stats = fs.statSync(filePath);
    const fileDate = new Date(stats.mtime).toISOString().split("T")[0];
    if (data.date !== fileDate) {
      updatedData.date = fileDate;
      updated = true;
    }
  }

  if (!updated) {
    return false;
  }

  // Write back with updated frontmatter
  const updatedFrontmatter = matter.stringify(content, updatedData, {
    delimiters: "---",
    language: "yaml",
  });

  fs.writeFileSync(filePath, updatedFrontmatter);
  return true;
}

async function syncAllContent() {
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
    // Find all MDX files recursively
    function findMdxFiles(dir: string): string[] {
      const files: string[] = [];
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
    
    files = findMdxFiles(CONTENT_ROOT);
  }

  const options = {
    autoDescription: action === "all" || action === "description",
    updateDate: action === "all" || action === "date",
  };

  let synced = 0;
  for (const file of files) {
    if (syncFrontmatter(file, options)) {
      console.log(`✅ Synced: ${path.relative(process.cwd(), file)}`);
      synced++;
    }
  }

  console.log(`\n✨ Synced ${synced} file(s).\n`);
}

syncAllContent().catch(console.error);

