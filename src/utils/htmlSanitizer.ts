import sanitizeHtml from 'sanitize-html';

export function sanitizeHTML(html: string): string {
  if (!html) return '';
  const sanitizeConfig: sanitizeHtml.IOptions = {
    allowedTags: [
      'b', 'i', 'em', 'strong', 'p', 'br',
      'ul', 'ol', 'li', 'h1', 'h2', 'h3',
      'a', 'img', 'u'
    ],
    // Directly map ALLOWED_ATTR, but structure it per tag or use '*' for all
    allowedAttributes: {
      // Allow these attributes on any tag (*) that is allowed
      '*': ['alt', 'title', 'width', 'height'], 
      // Specific attributes for 'a' tags
      'a': [ 'href', 'target', 'rel' ],
      // Specific attributes for 'img' tags
      'img': [ 'src', 'alt', 'title', 'width', 'height' ] 
      // Note: 'alt', 'title', 'width', 'height' are duplicated here from '*' 
      // but it's okay. You could remove them from '*' if you only want them on img.
    },
    allowedSchemesByTag: {
         img: ['data', 'http', 'https'] // Allow data URIs specifically for <img> src
    },
  };

  //console.debug('sanitizeHTML input:', html);
  try {
    const cleaned = sanitizeHtml(html, sanitizeConfig); 
    //console.debug('sanitizeHTML output:', cleaned);
    return cleaned;
  } catch (error) {
    // Keep the error handling
    console.error('sanitizeHTML error:', error, html);
    return ''; 
  }
}