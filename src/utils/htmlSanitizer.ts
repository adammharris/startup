import DOMPurify from 'dompurify';
import type { Config } from 'dompurify';

export function sanitizeHTML(html: string): string {
  if (!html) return '';

  // only allow http(s), mailto and data:image URIs
  const purifyConfig: Config = {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'p', 'br',
      'ul', 'ol', 'li', 'h1', 'h2', 'h3',
      'a', 'img', 'u'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel',
      'src', 'alt', 'title', 'width', 'height'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|data:image\/)/i,
    FORCE_BODY: false
  };

  // 1) strip any non-data src images
  // 2) strip any srcset attributes
  const cleaned = html
    .replace(
      /<img[^>]+src\s*=\s*["'](?!data:)[^"'>]+["'][^>]*>/gi,
      ''
    )
    .replace(/\s+srcset\s*=\s*["'][^"']*["']/gi, '');

  return DOMPurify.sanitize(cleaned, purifyConfig);
}