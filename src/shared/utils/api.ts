// Minimal API utilities for InfoSection.tsx and file URL resolution
export const NEWSLETTER_SUBSCRIBE_URL = 'https://api.mylg.studio/newsletter/subscribe';

export const apiFetch = async (url: string, options?: RequestInit): Promise<unknown> => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
};

export const getFileUrl = (path: string): string => {
  // If it's already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Otherwise, prepend the base URL for file storage
  return `https://d2qb21tb4meex0.cloudfront.net/${path}`;
};