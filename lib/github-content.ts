interface GitHubConfig {
  token: string;
  repo: string;
  branch: string;
}

function getGitHubConfig(): GitHubConfig | null {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) {
    return null;
  }

  return {
    token,
    repo,
    branch: process.env.GITHUB_BRANCH || "main",
  };
}

export function isGitHubConfigured(): boolean {
  return getGitHubConfig() !== null;
}

async function githubRequest(path: string, init?: RequestInit) {
  const config = getGitHubConfig();
  if (!config) {
    throw new Error("GitHub is not configured. Set GITHUB_TOKEN and GITHUB_REPO.");
  }

  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`GitHub API error (${response.status}): ${detail}`);
  }

  return response.json();
}

export async function getGitHubFile(
  relativePath: string
): Promise<{ content: string; sha: string } | null> {
  const config = getGitHubConfig();
  if (!config) {
    throw new Error("GitHub is not configured");
  }

  const encodedPath = relativePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  const response = await fetch(
    `https://api.github.com/repos/${config.repo}/contents/${encodedPath}?ref=${config.branch}`,
    {
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`GitHub API error (${response.status}): ${detail}`);
  }

  const data = await response.json();
  const content = Buffer.from(data.content, "base64").toString("utf8");
  return { content, sha: data.sha };
}

export async function putGitHubFile(
  relativePath: string,
  content: string,
  message: string,
  sha?: string
): Promise<void> {
  const config = getGitHubConfig();
  if (!config) {
    throw new Error("GitHub is not configured");
  }

  const encodedPath = relativePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  await githubRequest(`/repos/${config.repo}/contents/${encodedPath}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf8").toString("base64"),
      branch: config.branch,
      ...(sha ? { sha } : {}),
    }),
  });
}
