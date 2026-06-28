import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes HTML strings to prevent XSS attacks.
 * This is especially useful for rich text inputs like property descriptions,
 * job requirements, and messaging between users.
 * 
 * @param html The raw HTML string to sanitize
 * @returns Clean, safe HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'span', 'div'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });
}

/**
 * Strips all HTML tags and returns only text content.
 * Useful for inputs where no formatting is allowed (e.g. titles).
 * 
 * @param text The string to strip tags from
 * @returns Plain text string
 */
export function stripHtml(text: string): string {
  if (!text) return '';
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
}
