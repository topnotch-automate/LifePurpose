// Author configuration
// Set this in your environment variables or update directly here
export const AUTHOR_NAME = process.env.AUTHOR_NAME || "Your Name";
export const AUTHOR_EMAIL = process.env.AUTHOR_EMAIL || "";

export function isAuthor(name: string, email?: string): boolean {
  // Simple check - you can enhance this with authentication later
  // For now, we'll use a combination of name and optional email
  const nameMatch = name.toLowerCase().trim() === AUTHOR_NAME.toLowerCase().trim();
  if (email && AUTHOR_EMAIL) {
    return nameMatch && email.toLowerCase().trim() === AUTHOR_EMAIL.toLowerCase().trim();
  }
  return nameMatch;
}

export function getAuthorDisplayName(): string {
  return AUTHOR_NAME;
}

