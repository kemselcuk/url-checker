interface UrlCheckResult {
  exists: boolean;
  type: "file" | "folder" | "unknown";
}

const urls: Record<string, UrlCheckResult> = {
  "https://example.com/file.txt": { exists: true, type: "file" },
  "https://example.com/docs/report.pdf": { exists: true, type: "file" },
  "https://example.com/images/logo.png": { exists: true, type: "file" },
  "https://example.com/folder/": { exists: true, type: "folder" },
  "https://example.com/docs/": { exists: true, type: "folder" },
  "https://example.com/images/": { exists: true, type: "folder" },
  "https://example.com/unknown": { exists: false, type: "unknown" },
  "https://example.com/missing.pdf": { exists: false, type: "unknown" },
};

export async function mockCheckUrl(url: string): Promise<UrlCheckResult> {

    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay

    const result = urls[url] || { exists: false, type: "unknown" };

    return result;
}